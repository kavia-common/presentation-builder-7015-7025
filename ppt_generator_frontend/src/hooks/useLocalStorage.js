import { useEffect, useMemo, useRef, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";

/**
 * PUBLIC_INTERFACE
 * React hook to persist state to localStorage (debounced) and restore on load.
 */
export function useLocalStorage(key, initialValue, { debounceMs = 350 } = {}) {
  const initial = useMemo(() => {
    const stored = loadFromStorage(key);
    if (stored !== null && stored !== undefined) return stored;
    return typeof initialValue === "function" ? initialValue() : initialValue;
  }, [key, initialValue]);

  const [value, setValue] = useState(initial);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      saveToStorage(key, value);
    }, debounceMs);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [key, value, debounceMs]);

  return [value, setValue];
}
