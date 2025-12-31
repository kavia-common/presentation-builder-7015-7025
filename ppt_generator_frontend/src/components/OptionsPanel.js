import React from "react";

/**
 * PUBLIC_INTERFACE
 * Options panel for theme, font, slide size, layout defaults and footer.
 */
export function OptionsPanel({ value, onChange }) {
  const options = value;
  const update = (patch) => onChange({ ...options, ...patch });

  return (
    <div className="op-card">
      <div className="op-card-header">
        <h2 className="op-card-title">Options</h2>
        <span className="op-chip">Ocean Professional</span>
      </div>

      <div className="op-card-body">
        <div className="op-field">
          <label className="op-label">Theme</label>
          <select
            className="op-select"
            value={options.theme}
            onChange={(e) => update({ theme: e.target.value })}
          >
            <option value="ocean-professional">Ocean Professional (Blue + Amber)</option>
          </select>
          <div className="op-help">Primary: #2563EB • Accent: #F59E0B • Background: #f9fafb</div>
        </div>

        <div className="op-grid-2">
          <div className="op-field">
            <label className="op-label">Font</label>
            <select
              className="op-select"
              value={options.font}
              onChange={(e) => update({ font: e.target.value })}
            >
              <option value="Aptos">Aptos</option>
              <option value="Calibri">Calibri</option>
              <option value="Arial">Arial</option>
              <option value="Inter">Inter</option>
            </select>
          </div>

          <div className="op-field">
            <label className="op-label">Slide size</label>
            <select
              className="op-select"
              value={options.slideSize}
              onChange={(e) => update({ slideSize: e.target.value })}
            >
              <option value="16:9">16:9 (Widescreen)</option>
              <option value="4:3">4:3 (Standard)</option>
            </select>
          </div>
        </div>

        <div className="op-grid-2">
          <div className="op-field">
            <label className="op-label">Default layout</label>
            <select
              className="op-select"
              value={options.defaultLayout}
              onChange={(e) => update({ defaultLayout: e.target.value })}
            >
              <option value="title-bullets">Title + Bullets</option>
              <option value="title-only">Title only</option>
            </select>
          </div>

          <div className="op-field">
            <label className="op-label">Agenda slide</label>
            <select
              className="op-select"
              value={options.includeAgendaSlide ? "yes" : "no"}
              onChange={(e) => update({ includeAgendaSlide: e.target.value === "yes" })}
            >
              <option value="yes">Include (if agenda items exist)</option>
              <option value="no">Exclude</option>
            </select>
          </div>
        </div>

        <div className="op-field">
          <label className="op-label">Footer text (optional)</label>
          <input
            className="op-input"
            value={options.footerText}
            onChange={(e) => update({ footerText: e.target.value })}
            placeholder="e.g., Confidential • ACME Corp"
          />
        </div>

        <div className="op-help">
          Note: The current generator supports title + bullet layouts. Images/charts can be added later.
        </div>
      </div>
    </div>
  );
}
