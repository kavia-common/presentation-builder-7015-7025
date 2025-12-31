import React from "react";
import { DownloadCard } from "./DownloadCard";

/**
 * PUBLIC_INTERFACE
 * Right panel CTA: progress, errors, reset and generate actions + a dedicated download panel.
 */
export function Toolbar({
  isGenerating,
  progressText,
  error,
  downloadError,
  generatedFile,
  onGenerate,
  onDownload,
  onReset,
  canGenerate,
  statusText,
}) {
  const chipText = isGenerating ? "Working..." : statusText || "Ready";

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="op-card">
        <div className="op-card-header">
          <h2 className="op-card-title">Generate</h2>
          <span className="op-chip">
            <span
              aria-hidden="true"
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: isGenerating ? "var(--op-secondary)" : "rgba(17,24,39,0.25)",
                display: "inline-block",
              }}
            />
            <span>{chipText}</span>
          </span>
        </div>

        <div className="op-card-body">
          {error ? (
            <div className="op-error" role="alert" style={{ marginBottom: 12 }}>
              {error}
            </div>
          ) : null}

          <div className="op-row">
            <button type="button" className="op-btn op-btn-secondary" onClick={onReset} disabled={isGenerating}>
              Reset
            </button>

            <button
              type="button"
              className="op-btn op-btn-primary"
              onClick={onGenerate}
              disabled={!canGenerate || isGenerating}
              style={{ flex: 1 }}
            >
              {isGenerating ? "Generating..." : "Generate PPT"}
            </button>
          </div>

          <div className="op-help" style={{ marginTop: 12 }}>
            Tip: If no backend is configured (REACT_APP_API_BASE / REACT_APP_BACKEND_URL), generation happens locally.
          </div>
        </div>
      </div>

      <DownloadCard
        file={generatedFile}
        isGenerating={isGenerating}
        progressText={progressText}
        downloadError={downloadError}
        onDownload={onDownload}
        onRegenerate={onGenerate}
      />
    </div>
  );
}
