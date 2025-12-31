/**
 * storage helpers - localStorage wrapper with safety.
 */

/**
 * PUBLIC_INTERFACE
 * Safely parse JSON from localStorage.
 */
export function loadFromStorage(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * Save JSON to localStorage safely.
 */
export function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private mode issues
  }
}
