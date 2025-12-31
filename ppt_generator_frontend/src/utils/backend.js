/**
 * Thin backend-call abstraction.
 * If REACT_APP_BACKEND_URL / REACT_APP_API_BASE isn't set or is unreachable, callers should fall back.
 */

function getApiBase() {
  // CRA exposes env at build time; avoid hardcoding.
  return (
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    ""
  ).trim();
}

/**
 * PUBLIC_INTERFACE
 * Performs a quick reachability check. Returns { ok, baseUrl }.
 */
export async function checkBackendReachable({ timeoutMs = 1200 } = {}) {
  const baseUrl = getApiBase();
  if (!baseUrl) return { ok: false, baseUrl: "" };

  const url = `${baseUrl.replace(/\/+$/, "")}/health`;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "Accept": "application/json" },
    });
    return { ok: res.ok, baseUrl };
  } catch {
    return { ok: false, baseUrl };
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * PUBLIC_INTERFACE
 * Attempt server generation. Expected to return a Blob if supported.
 * This app has no guaranteed backend; this is best-effort.
 */
export async function tryGenerateViaBackend(presentationData, { timeoutMs = 20000 } = {}) {
  const baseUrl = getApiBase();
  if (!baseUrl) throw new Error("Backend URL not configured.");

  const url = `${baseUrl.replace(/\/+$/, "")}/ppt/generate`;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(presentationData),
    });

    if (!res.ok) {
      throw new Error(`Backend responded with ${res.status}`);
    }

    const blob = await res.blob();
    if (!blob || blob.size === 0) throw new Error("Backend returned an empty file.");
    return blob;
  } finally {
    window.clearTimeout(timer);
  }
}
