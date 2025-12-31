/**
 * Temporary PPT cache stored for the current browser session.
 *
 * We persist only metadata and an objectURL (not the Blob bytes) in sessionStorage.
 * This ensures:
 *  - Download remains possible across route reloads in the same session
 *  - We can revoke/recreate object URLs for memory safety
 *
 * NOTE: Object URLs are only valid within the same browser session context.
 */

const CACHE_KEY = "ppt_generator_generated_ppt_v1";

/**
 * PUBLIC_INTERFACE
 * Loads the cached PPT download info from sessionStorage.
 * @returns {{ url: string, filename: string } | null}
 */
export function loadPptCache() {
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.url !== "string" || typeof parsed.filename !== "string") return null;
    return { url: parsed.url, filename: parsed.filename };
  } catch {
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * Saves the PPT download info to sessionStorage.
 * @param {{ url: string, filename: string }} value
 */
export function savePptCache(value) {
  try {
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(value));
  } catch {
    // Ignore sessionStorage failures (private mode / quotas).
  }
}

/**
 * PUBLIC_INTERFACE
 * Clears the PPT cache from sessionStorage.
 */
export function clearPptCache() {
  try {
    window.sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}

/**
 * PUBLIC_INTERFACE
 * Safely revoke an object URL if it looks like a blob URL.
 * @param {string} url
 */
export function revokeObjectUrlSafe(url) {
  try {
    if (typeof url === "string" && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  } catch {
    // ignore
  }
}
