import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { checkBackendReachable, tryGenerateViaBackend } from "../utils/backend";
import { generatePptx } from "../utils/pptx";
import { sanitizePresentationState } from "../utils/defaults";
import { loadPptCache, savePptCache, clearPptCache, revokeObjectUrlSafe } from "../utils/pptCache";

/**
 * PUBLIC_INTERFACE
 * Manages PPT generation flow, including backend fallback and progress status.
 *
 * This hook separates:
 *  - generate(): produces the PPT Blob, stores a reusable object URL + filename in state and sessionStorage
 *  - download(): triggers a reliable download of the previously generated PPT
 *
 * The cached object URL supports route reloads within the same browser session.
 */
export function usePptGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");

  // Stored output (object URL + filename) for download.
  const [generatedFile, setGeneratedFile] = useState(() => loadPptCache());

  // Keep track of the current in-memory URL so we can revoke on regenerate/reset/unmount.
  const activeUrlRef = useRef(generatedFile?.url || "");

  const resetStatus = useCallback(() => {
    setError("");
    setProgressText("");
  }, []);

  const clearGenerated = useCallback(() => {
    const currentUrl = activeUrlRef.current;
    if (currentUrl) revokeObjectUrlSafe(currentUrl);
    activeUrlRef.current = "";
    setGeneratedFile(null);
    clearPptCache();
  }, []);

  // On unmount, revoke the active URL to avoid leaks.
  useEffect(() => {
    return () => {
      const currentUrl = activeUrlRef.current;
      if (currentUrl) revokeObjectUrlSafe(currentUrl);
    };
  }, []);

  const generate = useCallback(
    async (rawState, { filename = "presentation.pptx" } = {}) => {
      resetStatus();
      setError("");

      const { data, errors } = sanitizePresentationState(rawState);
      if (errors.length > 0) {
        setError(errors[0]);
        // Do not clear previously generated file on validation errors; user might still want it.
        return { ok: false, error: errors[0] };
      }

      setIsGenerating(true);

      try {
        // If we are generating a new file successfully, we should revoke and replace the old URL.
        // We do this only once we have a new blob in hand, to keep "Download" functional if generation fails.
        setProgressText("Checking backend availability...");
        const reachable = await checkBackendReachable();

        let blob;

        if (reachable.ok) {
          setProgressText("Generating via backend...");
          try {
            blob = await tryGenerateViaBackend(data);
          } catch {
            // Fall through to local generation seamlessly.
            setProgressText("Backend unavailable. Falling back to local generation...");
            blob = await generatePptx(data);
          }
        } else {
          setProgressText("Generating locally...");
          blob = await generatePptx(data);
        }

        if (!blob || blob.size === 0) {
          throw new Error("Generated file is empty.");
        }

        // Replace existing URL safely.
        const oldUrl = activeUrlRef.current;
        if (oldUrl) revokeObjectUrlSafe(oldUrl);

        const url = URL.createObjectURL(blob);
        const next = { url, filename };

        activeUrlRef.current = url;
        setGeneratedFile(next);
        savePptCache(next);

        setProgressText("Ready to download.");
        return { ok: true, blob, used: reachable.ok ? "backend" : "local", url, filename };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to generate PPTX.";
        setError(msg);
        return { ok: false, error: msg };
      } finally {
        setIsGenerating(false);
      }
    },
    [resetStatus]
  );

  const download = useCallback(() => {
    resetStatus();

    const file = generatedFile || loadPptCache();
    if (!file?.url) {
      const msg = "No generated PPT available. Click “Generate PPT” first.";
      setError(msg);
      return { ok: false, error: msg };
    }

    try {
      // Reliable download via programmatic anchor click.
      // (FileSaver is fine too, but this works well with object URLs and avoids extra work.)
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.filename || "presentation.pptx";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setProgressText("Download started.");
      window.setTimeout(() => setProgressText(""), 1200);

      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to start download.";
      setError(msg);
      return { ok: false, error: msg };
    }
  }, [generatedFile, resetStatus]);

  const api = useMemo(
    () => ({
      isGenerating,
      progressText,
      error,
      generatedFile,
      hasGenerated: Boolean(generatedFile?.url),
      generate,
      download,
      resetStatus,
      clearGenerated,
    }),
    [isGenerating, progressText, error, generatedFile, generate, download, resetStatus, clearGenerated]
  );

  return api;
}
