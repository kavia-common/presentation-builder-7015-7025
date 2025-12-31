import React, { useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * Compact preview summary of counts and selected options.
 */
export function PreviewSummary({ content, options }) {
  const summary = useMemo(() => {
    const agendaCount = (content.agendaItems || []).map((x) => String(x || "").trim()).filter(Boolean)
      .length;

    const slideCount = (content.slides || []).length;
    const nonEmptySlides = (content.slides || []).filter((s) => {
      const t = String(s?.title || "").trim();
      const bullets = (s?.bullets || []).map((b) => String(b || "").trim()).filter(Boolean);
      return t || bullets.length > 0;
    }).length;

    return {
      agendaCount,
      slideCount,
      nonEmptySlides,
    };
  }, [content]);

  return (
    <div className="op-preview">
      <div className="op-preview-item">
        <span className="op-muted">Slides</span>
        <strong>
          {summary.nonEmptySlides}/{summary.slideCount}
        </strong>
      </div>
      <div className="op-preview-item">
        <span className="op-muted">Agenda items</span>
        <strong>{summary.agendaCount}</strong>
      </div>
      <div className="op-preview-item">
        <span className="op-muted">Theme</span>
        <strong>Ocean Professional</strong>
      </div>
      <div className="op-preview-item">
        <span className="op-muted">Font</span>
        <strong>{options.font}</strong>
      </div>
      <div className="op-preview-item">
        <span className="op-muted">Slide size</span>
        <strong>{options.slideSize}</strong>
      </div>
    </div>
  );
}
