#!/usr/bin/env node
// Injects the A-Translator userscript into every page of an Electron/Chromium app that was
// started with --remote-debugging-port. Nothing in the app is modified.
//
//   node inject.mjs <port> <path/to/a-translator.user.js> [--origin https://app.alchemyrpg.com] [--no-update]
//   node inject.mjs --pipe-app <binary> [--pipe-arg <arg>]... <path/to/a-translator.user.js> [...]
//
// Second form ("pipe" mode): the injector itself starts the application with --remote-debugging-pipe and talks to it
// through two inherited pipes: no network port is opened at all. The application then lives and dies with this process.
//
// The given script is the copy embedded in the launcher. Unless --no-update (or ATX_NO_UPDATE=1) is given,
// the latest published version is fetched first (see update.mjs) and used if it is newer; any failure
// falls back to the embedded or previously cached copy.
//
// Stays running while the app runs (new pages and reloads are handled), exits when it quits.

import fs from "node:fs";
import { execFile, spawn } from "node:child_process";
import { Cdp } from "./cdp.mjs";
import { CdpPipe } from "./cdp-pipe.mjs";
import { pickScript } from "./update.mjs";
import { evaluateWithRetry } from "./retry.mjs";

const args = process.argv.slice(2);
let origin = "https://app.alchemyrpg.com";
const oi = args.indexOf("--origin");
if (oi !== -1) origin = args.splice(oi, 2)[1];

const noUpdate = args.includes("--no-update");
if (noUpdate) args.splice(args.indexOf("--no-update"), 1);
let pipeApp = null;
const pipeArgs = [];
for (let i = args.indexOf("--pipe-app"); i !== -1; i = args.indexOf("--pipe-app")) pipeApp = args.splice(i, 2)[1];
for (let i = args.indexOf("--pipe-arg"); i !== -1; i = args.indexOf("--pipe-arg")) pipeArgs.push(args.splice(i, 2)[1]);
const port = pipeApp ? null : Number(args[0]);
const scriptPath = pipeApp ? args[0] : args[1];
if ((!pipeApp && !port) || !scriptPath) {
  console.error("Usage: node inject.mjs <port> <a-translator.user.js> [--origin URL]\n       node inject.mjs --pipe-app <binary> [--pipe-arg <arg>]... <a-translator.user.js> [--origin URL]");
  process.exit(2);
}

const log = (...m) => console.log("[inject]", ...m);
const picked = await pickScript({
  embeddedPath: scriptPath,
  disabled: noUpdate,
  url: process.env.ATX_UPDATE_URL || undefined, // tests only
  cacheDir: process.env.ATX_CACHE_DIR || undefined, // tests only
  log: (m) => log("mise à jour :", m)
});
const source = picked.source;
const version = picked.version;
log(`script utilisé : ${version} (${picked.from})`);
if (picked.updated && !process.env.ATX_CACHE_DIR && process.platform === "darwin") { // (ATX_CACHE_DIR is only set by the tests: no notification then)
  execFile("osascript", ["-e", `display notification "A-Translator mis à jour vers la version ${version}." with title "Alchemy Launcher"`], () => {});
}

// The script is a userscript (@run-at document-end, GM_info available): reproduce that here.
// It only runs on the Alchemy origin, never on the stream window, and never twice per document.
const payload = `(() => {
  if (location.origin !== ${JSON.stringify(origin)}) return "ignoré (autre origine)";
  if (/^\\/game\\/[^/]+\\/stream\\/?$/.test(location.pathname)) return "ignoré (fenêtre de stream)";
  if (window.__ATX_INJECTED__) return "déjà injecté";
  window.__ATX_INJECTED__ = true;
  window.GM_info = { script: { version: ${JSON.stringify(version)} } };
  const run = () => {
${source}
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true });
  else run();
  return "injecté";
})();`;

const attached = new Map();

// `open()` gives an object with send(method, params) and closed (a promise): a WebSocket client or a pipe session.
async function attachTarget(target, open) {
  attached.set(target.id, null);
  try {
    const cdp = await open();
    attached.set(target.id, cdp);
    cdp.closed.then(() => attached.delete(target.id));

    await cdp.send("Page.enable");
    // Runs at the start of every future document of this page (reloads, navigations).
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: payload });
    // And once now, for the document that is already loaded.
    let closed = false;
    cdp.closed.then(() => (closed = true));
    let failure = null;
    const value = await evaluateWithRetry({
      targetUrl: target.url,
      origin,
      isClosed: () => closed,
      log: (m) => log(m + " :", target.url.slice(0, 80)),
      evaluate: async () => {
        const res = await cdp.send("Runtime.evaluate", { expression: payload, returnByValue: true });
        if (res.exceptionDetails) { failure = res.exceptionDetails.exception?.description || res.exceptionDetails.text; return null; }
        return res.result?.value ?? null;
      }
    });
    if (failure) log("erreur dans la page :", failure);
    else log(`${value || "ok"} :`, target.url.slice(0, 80));

    // Optional read-only diagnostic (ATX_PROBE=1): is the translator alive in that page? Logs flags and counts only.
    if (process.env.ATX_PROBE === "1" && String(target.url).startsWith(origin)) {
      await new Promise((r) => setTimeout(r, 6000));
      try {
        const res = await cdp.send("Runtime.evaluate", { returnByValue: true, expression: `JSON.stringify((() => { const c = window.__AlchemyTranslateCore__; return { core: !!c, version: window.GM_info?.script?.version ?? null, enabled: c?.enabled ?? null, dictSize: c?.dict?.size ?? null, sample: c?.translateString ? c.translateString("Featured") : null, button: !!document.getElementById("alchemy-translate-buttons"), path: location.pathname }; })())` });
        log("sonde :", res.result?.value ?? JSON.stringify(res.exceptionDetails?.text));
      } catch (e) { log("sonde impossible :", e.message); }
    }
  } catch (err) {
    attached.delete(target.id);
    log("échec d'attache :", err.message);
  }
}

// WebSocket mode: one WebSocket per page target.
async function attach(target) {
  return attachTarget(target, async () => {
    const cdp = new Cdp(target.webSocketDebuggerUrl);
    await cdp.ready;
    return cdp;
  });
}

async function listTargets() {
  const res = await fetch(`http://127.0.0.1:${port}/json/list`);
  return res.json();
}

let everConnected = false;
let failures = 0;
const startedAt = Date.now();

log(`version du script : ${version}, origine : ${origin}, ${pipeApp ? "mode tube (aucun port)" : "port : " + port}`);

if (pipeApp) {
  // Pipe mode: start the application ourselves with the DevTools pipe on its file descriptors 3 and 4.
  const child = spawn(pipeApp, ["--remote-debugging-pipe", ...pipeArgs], { stdio: ["ignore", "ignore", "ignore", "pipe", "pipe"] });
  child.on("error", (e) => { console.error("[inject] impossible de lancer l'application : " + e.message); process.exit(1); });
  const bc = new CdpPipe(child.stdio[3], child.stdio[4]);
  const seen = new Set();
  const consider = (info) => {
    if (!info || info.type !== "page" || seen.has(info.targetId) || String(info.url).startsWith("devtools://")) return;
    seen.add(info.targetId);
    attachTarget({ id: info.targetId, url: info.url || "" }, async () => {
      const { sessionId } = await bc.send("Target.attachToTarget", { targetId: info.targetId, flatten: true });
      return bc.session(sessionId);
    });
  };
  bc.onEvent((msg) => {
    if (msg.method === "Target.targetCreated" || msg.method === "Target.targetInfoChanged") consider(msg.params?.targetInfo);
    if (msg.method === "Target.targetDestroyed") seen.delete(msg.params?.targetId);
  });
  child.on("exit", (code, signal) => {
    log(`l'application est fermée (${signal || "code " + code}), fin.`);
    process.stdout.write("", () => process.exit(0)); // let the log line out before exiting (stdout is a pipe)
  });
  const stopChild = () => { try { child.kill("SIGTERM"); } catch (_) {} process.exit(0); };
  process.on("SIGTERM", stopChild);
  process.on("SIGINT", stopChild);
  try {
    await bc.send("Target.setDiscoverTargets", { discover: true });
    const { targetInfos } = await bc.send("Target.getTargets");
    for (const info of targetInfos) consider(info);
  } catch (e) {
    // The application closed (or refused the pipe) right at startup: the "exit" handler reports it, otherwise say so here.
    console.error("[inject] impossible de dialoguer avec l'application par le tube : " + e.message);
    process.exit(1);
  }
  await new Promise(() => {}); // the "exit" handler above ends the process
}

for (;;) {
  try {
    const targets = await listTargets();
    everConnected = true;
    failures = 0;
    for (const t of targets) {
      if (t.type !== "page" || !t.webSocketDebuggerUrl) continue;
      if (t.url.startsWith("devtools://") || attached.has(t.id)) continue;
      attach(t);
    }
  } catch (_) {
    failures++;
    if (everConnected && failures >= 3) {
      log("l'application est fermée, fin.");
      log("Si elle est encore ouverte, elle a redémarré sans l'option de débogage (typiquement après une");
      log("mise à jour d'Alchemy) : quittez-la (Cmd+Q) puis relancez ce script.");
      process.exit(0);
    }
    if (!everConnected && Date.now() - startedAt > 60_000) {
      console.error("[inject] Impossible de joindre l'application sur le port " + port + " (60 s).");
      process.exit(1);
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
}
