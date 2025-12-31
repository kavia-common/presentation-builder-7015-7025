import { useCallback, useMemo, useState } from "react";
import { checkBackendReachable, tryGenerateViaBackend } from "../utils/backend";
import { generatePptx } from "../utils/pptx";
import { sanitizePresentationState } from "../utils/defaults";

/**
 * PUBLIC_INTERFACE
 * Manages PPT generation flow, including backend fallback and progress status.
 */
export function usePptGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");

  const resetStatus = useCallback(() => {
    setError("");
    setProgressText("");
  }, []);

  const generate = useCallback(async (rawState) => {
    resetStatus();

    const { data, errors } = sanitizePresentationState(rawState);
    if (errors.length > 0) {
      setError(errors[0]);
      return { ok: false, error: errors[0] };
    }

    setIsGenerating(true);

    try {
      setProgressText("Checking backend availability...");
      const reachable = await checkBackendReachable();

      if (reachable.ok) {
        setProgressText("Generating via backend...");
        try {
          const blob = await tryGenerateViaBackend(data);
          setProgressText("Ready to download.");
          return { ok: true, blob, used: "backend" };
        } catch (e) {
          // Fall through to local generation seamlessly.
          setProgressText("Backend unavailable. Falling back to local generation...");
        }
      } else {
        setProgressText("Generating locally...");
      }

      const blob = await generatePptx(data);
      setProgressText("Ready to download.");
      return { ok: true, blob, used: "local" };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to generate PPTX.";
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setIsGenerating(false);
      window.setTimeout(() => setProgressText(""), 1200);
    }
  }, [resetStatus]);

  const api = useMemo(
    () => ({
      isGenerating,
      progressText,
      error,
      generate,
      resetStatus,
    }),
    [isGenerating, progressText, error, generate, resetStatus]
  );

  return api;
}
