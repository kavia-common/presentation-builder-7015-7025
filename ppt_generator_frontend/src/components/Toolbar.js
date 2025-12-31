import React from "react";

/**
 * PUBLIC_INTERFACE
 * Right panel CTA: progress, errors, reset and generate actions.
 */
export function Toolbar({
  isGenerating,
  progressText,
  error,
  onGenerate,
  onReset,
  canGenerate,
}) {
  return (
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
          <span>{isGenerating ? "Working..." : "Ready"}</span>
        </span>
      </div>

      <div className="op-card-body">
        {error ? (
          <div className="op-error" role="alert" style={{ marginBottom: 12 }}>
            {error}
          </div>
        ) : null}

        {progressText ? (
          <div className="op-success" style={{ marginBottom: 12 }}>
            {progressText}
          </div>
        ) : null}

        <div className="op-row" style={{ marginBottom: 12 }}>
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
            {isGenerating ? "Generating..." : "Generate & Download PPT"}
          </button>
        </div>

        <div className="op-help">
          Tip: If no backend is configured (REACT_APP_API_BASE / REACT_APP_BACKEND_URL), generation happens locally.
        </div>
      </div>
    </div>
  );
}
