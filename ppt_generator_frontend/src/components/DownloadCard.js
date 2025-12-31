import React, { useCallback, useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * DownloadCard surfaces the generated PPT output and provides a reliable download UX:
 *  - "Ready to download" panel
 *  - filename, approximate size, generation time
 *  - download button (disabled until a blob URL exists)
 *  - copyable link (blob URL) for fallback/manual usage
 *  - regenerate and retry flows
 */
export function DownloadCard({
  file,
  isGenerating,
  progressText,
  downloadError,
  onDownload,
  onRegenerate,
}) {
  const [copied, setCopied] = useState(false);

  const canDownload = Boolean(file?.url) && !isGenerating;

  const approxSize = useMemo(() => {
    if (!file?.sizeBytes || Number.isNaN(file.sizeBytes)) return "";
    const bytes = file.sizeBytes;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round((bytes / 1024) * 10) / 10} KB`;
    return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
  }, [file?.sizeBytes]);

  const timeText = useMemo(() => {
    const ts = file?.generatedAt;
    if (!ts) return "";
    const deltaMs = Date.now() - ts;

    if (deltaMs < 15_000) return "just now";
    const minutes = Math.floor(deltaMs / 60_000);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(deltaMs / 3_600_000);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(deltaMs / 86_400_000);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }, [file?.generatedAt]);

  const handleCopyLink = useCallback(async () => {
    if (!file?.url) return;
    try {
      await navigator.clipboard.writeText(file.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard can fail in non-secure contexts; do nothing and let the user select it manually.
      setCopied(false);
    }
  }, [file?.url]);

  const fileNameShort = useMemo(() => {
    const name = String(file?.filename || "presentation.pptx");
    return name;
  }, [file?.filename]);

  return (
    <div className="op-card op-download-card" aria-live="polite">
      <div className="op-card-header op-card-header--grad">
        <div className="op-download-header">
          <div className="op-download-title-row">
            <span className="op-icon-check" aria-hidden="true">
              ✓
            </span>
            <h2 className="op-card-title" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              Ready to download
            </h2>
            <span className="op-pill op-pill-success" aria-label="Status: Ready">
              Ready
            </span>
          </div>
          <div className="op-download-subtitle">Your presentation is generated and ready.</div>
        </div>

        {file?.url ? <span className="op-chip">Available</span> : <span className="op-chip">Not ready</span>}
      </div>

      <div className="op-card-body">
        {file?.url ? (
          <div className="op-ready-panel" role="region" aria-label="Ready to download">
            <div className="op-ready-top">
              <div className="op-ready-meta" aria-label="File metadata">
                <span
                  className="op-ready-filename"
                  title={fileNameShort}
                  aria-label={`Filename: ${fileNameShort}`}
                >
                  {fileNameShort}
                </span>

                {approxSize ? (
                  <span className="op-muted" aria-label={`Size: ${approxSize}`}>
                    <span className="op-meta-label">Size:</span> {approxSize}
                  </span>
                ) : null}

                {timeText ? (
                  <span className="op-muted" aria-label={`Generated: ${timeText}`}>
                    <span className="op-meta-label">Generated:</span> {timeText}
                  </span>
                ) : null}
              </div>

              <div className="op-ready-actions">
                <button
                  type="button"
                  className="op-btn op-btn-outline-primary"
                  onClick={onRegenerate}
                  disabled={isGenerating}
                  aria-label="Regenerate presentation"
                  title="Generate a fresh PPTX with the current inputs"
                >
                  Regenerate
                </button>

                <button
                  type="button"
                  className="op-btn op-btn-primary-solid"
                  onClick={onDownload}
                  disabled={!canDownload}
                  aria-disabled={!canDownload}
                  aria-label="Download PPT"
                >
                  Download PPT
                </button>
              </div>
            </div>

            <div className="op-ready-link-row" style={{ marginTop: 12 }}>
              <label className="op-label" htmlFor="ppt-download-link" style={{ marginBottom: 2 }}>
                Link (fallback)
              </label>
              <div className="op-ready-link-controls">
                <input
                  id="ppt-download-link"
                  className="op-input op-ready-link"
                  readOnly
                  value={file.url}
                  onFocus={(e) => e.target.select()}
                  aria-label="Generated file link (fallback)"
                />
                <button
                  type="button"
                  className="op-btn op-btn-ghost"
                  onClick={handleCopyLink}
                  disabled={!file?.url}
                  aria-label="Copy fallback link to clipboard"
                  title="Copy link to clipboard"
                >
                  {copied ? "Copied" : "Copy"}
                </button>

                <a
                  className="op-btn op-btn-ghost"
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open generated file link in a new tab"
                  title="Open the file URL in a new tab (fallback)"
                >
                  Open link
                </a>
              </div>
              <div className="op-help">
                If your browser blocks automatic downloads, use <strong>Open link</strong> or copy this link.
              </div>
            </div>

            {progressText ? (
              <div className="op-success" style={{ marginTop: 12 }}>
                {progressText}
              </div>
            ) : null}

            {downloadError ? (
              <div className="op-error" role="alert" style={{ marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span>{downloadError}</span>
                  <button
                    type="button"
                    className="op-btn op-btn-ghost"
                    onClick={onDownload}
                    disabled={!canDownload}
                    aria-label="Retry download"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="op-help">
            No generated file yet. Click <strong>Generate PPT</strong> to prepare a download.
          </div>
        )}
      </div>
    </div>
  );
}
