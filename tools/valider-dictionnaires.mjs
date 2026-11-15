#!/usr/bin/env node
// Validates the A-Translator repository content (dictionaries, models, userscript) before/after a publication.
//
//   node tools/valider-dictionnaires.mjs [--root <repo dir>] [--base <git ref>]
//
// --base : compare with that git revision (e.g. HEAD~1, origin/main): a file whose content changed must have a
//          higher dictVersion (dictionaries) / @version (userscript).
// Exit code 1 if at least one ERROR (warnings never fail). Output uses GitHub annotations (::error / ::warning).
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const argv = process.argv.slice(2);
const opt = (name) => { const i = argv.indexOf(name); return i === -1 ? null : argv[i + 1]; };
const root = path.resolve(opt("--root") || ".");
const base = opt("--base");

let errors = 0, warnings = 0;
const gh = !!process.env.GITHUB_ACTIONS;
const err = (file, msg) => { errors++; console.log(gh ? `::error file=${file}::${msg}` : `ERREUR   ${file} : ${msg}`); };
const warn = (file, msg) => { warnings++; console.log(gh ? `::warning file=${file}::${msg}` : `avertis. ${file} : ${msg}`); };

const norm = (k) => k.trim().toLowerCase().replace(/’/g, "'");
const varsOf = (s) => (String(s).match(/\{[A-Za-z0-9_]+\}/g) || []).sort().join(",");
const cmpVer = (a, b) => {
  const p = (v) => String(v ?? "0").split(/[.-]/).map((x) => parseInt(x, 10) || 0);
  const pa = p(a), pb = p(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) { const d = (pa[i] || 0) - (pb[i] || 0); if (d) return d > 0 ? 1 : -1; }
  return 0;
};
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));
function readJson(rel) {
  try { return JSON.parse(read(rel)); } catch (e) { err(rel, "JSON invalide : " + e.message); return null; }
}
function gitShow(rel) {
  if (!base) return null;
  try { return execFileSync("git", ["-C", root, "show", `${base}:${rel}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 }); }
  catch (_) { return null; }
}

// ---- manifest
const manifestRel = "dictionaries/manifest.json";
const manifest = exists(manifestRel) ? readJson(manifestRel) : (err(manifestRel, "fichier absent"), null);
const dicts = new Map(); // id -> { rel, meta, entries }
if (manifest) {
  if (!Array.isArray(manifest.dictionaries)) err(manifestRel, "« dictionaries » doit être une liste");
  if (!manifest.updatedAt || Number.isNaN(Date.parse(manifest.updatedAt))) err(manifestRel, "updatedAt absent ou invalide");
  const ids = new Set();
  for (const d of manifest.dictionaries || []) {
    for (const f of ["id", "name", "lang", "type", "dictVersion", "url"]) if (!d[f]) err(manifestRel, `entrée « ${d.id || "?"} » : champ « ${f} » manquant`);
    if (ids.has(d.id)) err(manifestRel, `id en double : ${d.id}`); ids.add(d.id);
    if (!/^\d+(\.\d+)*$/.test(String(d.dictVersion))) err(manifestRel, `${d.id} : dictVersion « ${d.dictVersion} » non conforme`);
    const file = String(d.url || "").split("/").pop();
    const rel = `dictionaries/${file}`;
    if (!exists(rel)) { err(manifestRel, `${d.id} : le fichier ${rel} n'existe pas dans le dépôt`); continue; }
    const j = readJson(rel);
    if (!j) continue;
    dicts.set(d.id, { rel, meta: j.meta || {}, entries: j.entries || {}, listed: d });
  }
}

// ---- each dictionary
for (const [id, { rel, meta, entries, listed }] of dicts) {
  if (!entries || typeof entries !== "object" || Array.isArray(entries)) { err(rel, "« entries » doit être un objet"); continue; }
  if (meta.id !== id) err(rel, `meta.id « ${meta.id} » différent de l'id du manifeste « ${id} »`);
  if (String(meta.dictVersion) !== String(listed.dictVersion)) err(rel, `dictVersion du fichier (${meta.dictVersion}) différente de celle du manifeste (${listed.dictVersion})`);
  if (String(meta.lang || "").toLowerCase() !== String(listed.lang || "").toLowerCase()) err(rel, `meta.lang « ${meta.lang} » différent de celui du manifeste « ${listed.lang} »`);
  const seen = new Map();
  let empty = 0;
  const hasSelectors = new Set(Object.keys(entries).filter((k) => /\|[A-Za-z0-9_]+=[^|]+$/.test(k)).map((k) => k.replace(/\|[A-Za-z0-9_]+=[^|]+$/, "")));
  for (const [k, v] of Object.entries(entries)) {
    if (typeof v !== "string") { err(rel, `valeur non textuelle pour « ${k} »`); continue; }
    if (!v.trim()) { empty++; continue; }
    // A translation may drop a variable only for selector variants ("<pattern>|type=game") and for the plain pattern they belong to.
    const sel = /\|[A-Za-z0-9_]+=[^|]+$/.test(k) || hasSelectors.has(k);
    const kv = varsOf(k).split(",").filter(Boolean), vv = varsOf(v).split(",").filter(Boolean);
    if (sel ? vv.some((x) => !kv.includes(x)) : varsOf(k) !== varsOf(v)) err(rel, `variables différentes entre la clé « ${k} » et sa traduction « ${v} »`);
    // The straight/curly apostrophe twins are intentional (Alchemy writes either): only case / spacing variants are reported.
    const n = k.trim().toLowerCase();
    if (seen.has(n) && seen.get(n) !== k) warn(rel, `clés qui ne diffèrent que par la casse ou les espaces : « ${seen.get(n)} » et « ${k} »`);
    seen.set(n, k);
  }
  if (empty) err(rel, `${empty} valeur(s) vide(s) (un dictionnaire publié ne doit pas contenir de traduction vide)`);

  // version bump when the content changed since --base
  const before = gitShow(rel);
  if (before !== null && before !== read(rel)) {
    let old = null; try { old = JSON.parse(before); } catch (_) {}
    if (old && cmpVer(meta.dictVersion, old.meta?.dictVersion) <= 0)
      err(rel, `contenu modifié mais dictVersion non augmentée (${old.meta?.dictVersion} → ${meta.dictVersion}) : les utilisateurs ne recevraient pas la mise à jour`);
  }
}

// ---- coverage of the other core dictionaries compared with fr-core (warning only)
const fr = dicts.get("fr-core");
if (fr) {
  // Plural variants ("<pattern>|one"...) are optional: a language only has the forms it needs.
  const PLURAL_KEY = /\|(zero|one|two|few|many|other)$/;
  const frKeys = new Set(Object.keys(fr.entries).filter((k) => !PLURAL_KEY.test(k)).map(norm));
  for (const [id, d] of dicts) {
    if (d.listed.type !== "core" || id === "fr-core") continue;
    const have = new Set(Object.keys(d.entries).map(norm));
    const missing = [...frKeys].filter((k) => !have.has(k));
    if (missing.length) warn(d.rel, `${missing.length} clé(s) de fr-core absente(s) (ex. « ${missing.slice(0, 3).join("», « ")} »)`);
  }
  // models/XX-core.json must contain every key of fr-core, with empty values
  const modelRel = "models/XX-core.json";
  if (exists(modelRel)) {
    const m = readJson(modelRel);
    if (m) {
      const mk = new Set(Object.keys(m.entries || {}).map(norm));
      const missing = [...frKeys].filter((k) => !mk.has(k));
      if (missing.length) err(modelRel, `${missing.length} clé(s) de fr-core absente(s) du modèle (ex. « ${missing.slice(0, 3).join("», « ")} »)`);
      const filled = Object.values(m.entries || {}).filter((v) => String(v).trim()).length;
      if (filled) warn(modelRel, `${filled} valeur(s) renseignée(s) dans le modèle (il doit rester vide)`);
      if (cmpVer(m.meta?.dictVersion, fr.meta.dictVersion) < 0) warn(modelRel, `modèle en version ${m.meta?.dictVersion}, fr-core en ${fr.meta.dictVersion}`);
    }
  }
}

// ---- userscript
const usRel = "userscript/a-translator.user.js";
if (exists(usRel)) {
  const src = read(usRel);
  const ver = /@version\s+(\S+)/.exec(src)?.[1];
  if (!src.startsWith("// ==UserScript==")) err(usRel, "en-tête userscript absent");
  if (!/^\/\/ @name\s+A-Translator\s*$/m.test(src)) err(usRel, "« @name A-Translator » absent ou modifié (Tampermonkey créerait un second script)");
  if (!/^\d+\.\d+\.\d+$/.test(ver || "")) err(usRel, "@version absente ou non conforme (x.y.z)");
  try { new vm.Script(src, { filename: usRel }); } catch (e) { err(usRel, "erreur de syntaxe JavaScript : " + e.message); }
  const before = gitShow(usRel);
  if (before !== null && before !== src) {
    const ov = /@version\s+(\S+)/.exec(before)?.[1];
    if (ov && cmpVer(ver, ov) <= 0) err(usRel, `script modifié mais @version non augmentée (${ov} → ${ver})`);
  }
}

console.log(`\n${errors} erreur(s), ${warnings} avertissement(s)`);
process.exit(errors ? 1 : 0);
