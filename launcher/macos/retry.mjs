// Evaluates the injection payload in a page, and tries again a few times when the page was not on the
// Alchemy origin yet (typical right after launch: the target already announces the URL while its document
// is still about:blank). The payload is idempotent ("déjà injecté"), so repeating it is harmless.

export const OTHER_ORIGIN = "ignoré (autre origine)";

/**
 * @param {object} o
 * @param {(expression: string) => Promise<any>} o.evaluate  returns the payload's string result (throws on failure)
 * @param {string} o.targetUrl  URL announced by the target
 * @param {string} o.origin     expected origin
 * @param {(m: string) => void} [o.log]
 * @param {number[]} [o.delays] waits (ms) before each new attempt
 * @param {(ms: number) => Promise<void>} [o.sleep]
 * @param {() => boolean} [o.isClosed] stop retrying when the page is gone
 * @returns {Promise<string>} last result
 */
export async function evaluateWithRetry({ evaluate, targetUrl, origin, log = () => {}, delays = [400, 1200, 2500, 5000], sleep = (ms) => new Promise((r) => setTimeout(r, ms)), isClosed = () => false }) {
  let value = await evaluate();
  if (value !== OTHER_ORIGIN || !String(targetUrl || "").startsWith(origin)) return value;
  for (let i = 0; i < delays.length; i++) {
    await sleep(delays[i]);
    if (isClosed()) return value;
    try { value = await evaluate(); } catch (_) { return value; }
    if (value !== OTHER_ORIGIN) {
      log(`nouvel essai ${i + 1} : ${value}`);
      return value;
    }
  }
  log(`la page n'est pas passée sur ${origin} après ${delays.length} essais : l'injection se fera à son chargement`);
  return value;
}
