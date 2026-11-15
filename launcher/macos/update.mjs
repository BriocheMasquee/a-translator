// Chooses which A-Translator script the launcher injects: the copy embedded in the launcher, a copy
// cached by a previous launch, or the latest one published on GitHub (the @updateURL of the script).
//
// Safety rules, because the downloaded code runs inside the user's Alchemy session:
//   - HTTPS only, from raw.githubusercontent.com (tests may pass an http://127.0.0.1 URL explicitly);
//   - the file must look like the A-Translator userscript (header, @name, semantic @version), have a
//     plausible size, and parse as JavaScript (it is parsed, never run, before being accepted);
//   - it is only used if its version is strictly higher than the embedded one and the cached one:
//     a failure, a downgrade or garbage never replaces a working script;
//   - any problem (offline, 404, timeout…) silently falls back to the best local copy;
//   - opt-out: ATX_NO_UPDATE=1, or an empty file named "no-auto-update" in the cache folder.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";

// Where the downloaded copy of the script is kept: macOS "Application Support", Windows %APPDATA%, Linux XDG data folder.
export function defaultCacheDir(platform = process.platform, env = process.env, home = os.homedir()) {
  if (platform === "win32") return path.win32.join(env.APPDATA || path.win32.join(home, "AppData", "Roaming"), "Alchemy Launcher");
  if (platform === "darwin") return path.join(home, "Library", "Application Support", "Alchemy Launcher");
  return path.join(env.XDG_DATA_HOME || path.join(home, ".local", "share"), "alchemy-launcher");
}
export const DEFAULT_CACHE_DIR = defaultCacheDir();
const MIN_SIZE = 20_000;
const MAX_SIZE = 3_000_000;

export function versionOf(source) {
  return /@version\s+(\S+)/.exec(source)?.[1] ?? null;
}

// 2.10.0 > 2.9.0; "dev" or garbage counts as 0.
export function compareVersions(a, b) {
  const parts = (v) => String(v ?? "0").split(/[.-]/).map((x) => parseInt(x, 10) || 0);
  const pa = parts(a), pb = parts(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d > 0 ? 1 : -1;
  }
  return 0;
}

// Returns null if the text is acceptable, otherwise the reason it is refused.
export function validateScript(source) {
  if (typeof source !== "string") return "pas du texte";
  if (source.length < MIN_SIZE || source.length > MAX_SIZE) return `taille inattendue (${source.length} octets)`;
  if (!source.startsWith("// ==UserScript==")) return "en-tête userscript absent";
  if (!/^\/\/ @name\s+A-Translator\s*$/m.test(source)) return "@name différent de A-Translator";
  if (!/^\d+\.\d+\.\d+$/.test(versionOf(source) ?? "")) return "@version absente ou non conforme";
  try {
    new vm.Script(source, { filename: "a-translator.user.js" }); // parse only, nothing is executed
  } catch (e) {
    return "erreur de syntaxe : " + e.message;
  }
  return null;
}

export function updateUrlOf(source) {
  return /@updateURL\s+(\S+)/.exec(source)?.[1] ?? null;
}

function urlAllowed(url) {
  try {
    const u = new URL(url);
    if (u.protocol === "https:" && u.hostname === "raw.githubusercontent.com") return true;
    return u.protocol === "http:" && u.hostname === "127.0.0.1"; // local test server only
  } catch (_) {
    return false;
  }
}

/**
 * @param {object} o
 * @param {string} o.embeddedPath  script shipped inside the launcher
 * @param {string} [o.cacheDir]
 * @param {string} [o.url]         defaults to the @updateURL of the embedded script
 * @param {number} [o.timeoutMs]
 * @param {boolean} [o.disabled]
 * @param {(m: string) => void} [o.log]
 * @returns {Promise<{ source: string, version: string, from: "embarqué"|"cache"|"GitHub", updated: boolean }>}
 */
export async function pickScript({ embeddedPath, cacheDir = DEFAULT_CACHE_DIR, url, timeoutMs = 4000, disabled = false, log = () => {} }) {
  const embedded = fs.readFileSync(embeddedPath, "utf8");
  let best = { source: embedded, version: versionOf(embedded) ?? "0.0.0", from: "embarqué", updated: false };
  const cachePath = path.join(cacheDir, "a-translator.user.js");

  // A copy cached by an earlier launch is used when it is newer than the embedded one.
  try {
    const cached = fs.readFileSync(cachePath, "utf8");
    const why = validateScript(cached);
    if (why) log(`copie en cache ignorée : ${why}`);
    else if (compareVersions(versionOf(cached), best.version) > 0) best = { source: cached, version: versionOf(cached), from: "cache", updated: false };
  } catch (_) {}

  const optedOut = disabled || process.env.ATX_NO_UPDATE === "1" || fs.existsSync(path.join(cacheDir, "no-auto-update"));
  if (optedOut) {
    log("mise à jour automatique désactivée");
    return best;
  }

  const target = url ?? updateUrlOf(embedded);
  if (!target || !urlAllowed(target)) {
    log("adresse de mise à jour absente ou non autorisée : " + target);
    return best;
  }

  try {
    const res = await fetch(target, { signal: AbortSignal.timeout(timeoutMs), headers: { "cache-control": "no-cache" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const remote = await res.text();
    const why = validateScript(remote);
    if (why) {
      log(`script GitHub refusé : ${why}`);
      return best;
    }
    const rv = versionOf(remote);
    if (compareVersions(rv, best.version) > 0) {
      fs.mkdirSync(cacheDir, { recursive: true });
      const tmp = cachePath + ".tmp-" + process.pid;
      fs.writeFileSync(tmp, remote);
      fs.renameSync(tmp, cachePath);
      log(`script GitHub ${rv} plus récent que ${best.version} (${best.from}) : utilisé et mis en cache`);
      best = { source: remote, version: rv, from: "GitHub", updated: true };
    } else {
      log(`script GitHub ${rv} : pas plus récent que ${best.version} (${best.from})`);
    }
  } catch (e) {
    log(`vérification impossible (${e.name === "TimeoutError" ? "délai dépassé" : e.message}) : copie ${best.from} ${best.version} conservée`);
  }
  return best;
}
