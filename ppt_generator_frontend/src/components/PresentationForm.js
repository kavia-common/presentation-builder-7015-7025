import React from "react";

/**
 * PUBLIC_INTERFACE
 * Main content input form: title/subtitle, agenda items, and content slides.
 */
export function PresentationForm({ value, onChange, defaultLayout }) {
  const content = value;

  const update = (patch) => onChange({ ...content, ...patch });

  const updateAgendaItem = (idx, newValue) => {
    const next = [...content.agendaItems];
    next[idx] = newValue;
    update({ agendaItems: next });
  };

  const addAgendaItem = () => update({ agendaItems: [...content.agendaItems, ""] });

  const removeAgendaItem = (idx) => {
    const next = content.agendaItems.filter((_, i) => i !== idx);
    update({ agendaItems: next.length ? next : [""] });
  };

  const addSlide = () => {
    update({
      slides: [
        ...content.slides,
        {
          id: cryptoRandomId(),
          title: "",
          bullets: [""],
          layout: defaultLayout,
        },
      ],
    });
  };

  const removeSlide = (id) => {
    const next = content.slides.filter((s) => s.id !== id);
    update({ slides: next.length ? next : [] });
  };

  const updateSlide = (id, patch) => {
    update({
      slides: content.slides.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  };

  const addBullet = (id) => {
    const slide = content.slides.find((s) => s.id === id);
    const nextBullets = [...(slide?.bullets ?? []), ""];
    updateSlide(id, { bullets: nextBullets });
  };

  const updateBullet = (id, idx, newValue) => {
    const slide = content.slides.find((s) => s.id === id);
    const next = [...(slide?.bullets ?? [])];
    next[idx] = newValue;
    updateSlide(id, { bullets: next });
  };

  const removeBullet = (id, idx) => {
    const slide = content.slides.find((s) => s.id === id);
    const next = (slide?.bullets ?? []).filter((_, i) => i !== idx);
    updateSlide(id, { bullets: next.length ? next : [""] });
  };

  return (
    <div className="op-card">
      <div className="op-card-header">
        <h2 className="op-card-title">Content</h2>
        <span className="op-chip">
          <strong>{content.slides.length}</strong> slides
        </span>
      </div>

      <div className="op-card-body">
        <div className="op-grid-2">
          <div className="op-field">
            <label className="op-label" htmlFor="ppt-title">
              Presentation title <span style={{ color: "var(--op-error)" }}>*</span>
            </label>
            <input
              id="ppt-title"
              className="op-input"
              value={content.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="e.g., Q4 Business Review"
              autoComplete="off"
            />
          </div>

          <div className="op-field">
            <label className="op-label" htmlFor="ppt-subtitle">
              Subtitle (optional)
            </label>
            <input
              id="ppt-subtitle"
              className="op-input"
              value={content.subtitle}
              onChange={(e) => update({ subtitle: e.target.value })}
              placeholder="e.g., Strategy, KPIs, and next steps"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="op-divider" />

        <div className="op-field">
          <div className="op-row" style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 650, fontSize: 13 }}>Agenda items</div>
              <div className="op-help">Used for an optional Agenda slide.</div>
            </div>

            <button type="button" className="op-btn op-btn-secondary" onClick={addAgendaItem}>
              + Add agenda item
            </button>
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            {content.agendaItems.map((item, idx) => (
              <div key={`agenda-${idx}`} className="op-row" style={{ alignItems: "center" }}>
                <input
                  className="op-input"
                  value={item}
                  onChange={(e) => updateAgendaItem(idx, e.target.value)}
                  placeholder={`Agenda item ${idx + 1}`}
                />
                <button
                  type="button"
                  className="op-btn op-btn-ghost"
                  onClick={() => removeAgendaItem(idx)}
                  aria-label={`Remove agenda item ${idx + 1}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="op-divider" />

        <div className="op-row" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 650, fontSize: 13 }}>Slides</div>
            <div className="op-help">Each slide needs a title and at least one bullet.</div>
          </div>

          <button type="button" className="op-btn op-btn-secondary" onClick={addSlide}>
            + Add slide
          </button>
        </div>

        <div style={{ display: "grid", gap: 14, marginTop: 12 }}>
          {content.slides.map((slide, index) => (
            <div key={slide.id} className="op-slide-card">
              <div className="op-slide-card-header">
                <div className="op-row" style={{ gap: 10 }}>
                  <h3 className="op-slide-card-title">
                    Slide {index + 1}
                  </h3>
                  <span className="op-badge">{slide.layout || defaultLayout}</span>
                </div>

                <div className="op-row">
                  <button
                    type="button"
                    className="op-btn op-btn-danger"
                    onClick={() => removeSlide(slide.id)}
                    disabled={content.slides.length === 1}
                    title={content.slides.length === 1 ? "At least 1 slide recommended" : "Remove slide"}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="op-card-body">
                <div className="op-grid-2">
                  <div className="op-field">
                    <label className="op-label">Slide title</label>
                    <input
                      className="op-input"
                      value={slide.title}
                      onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                      placeholder="e.g., Key Metrics"
                    />
                  </div>

                  <div className="op-field">
                    <label className="op-label">Layout style</label>
                    <select
                      className="op-select"
                      value={slide.layout || defaultLayout}
                      onChange={(e) => updateSlide(slide.id, { layout: e.target.value })}
                    >
                      <option value="title-bullets">Title + Bullets</option>
                      <option value="title-only">Title only (no bullets)</option>
                    </select>
                    <div className="op-help">
                      Only <strong>Title + Bullets</strong> is rendered in PPT for now; title-only will ignore bullets.
                    </div>
                  </div>
                </div>

                <div className="op-field" style={{ marginTop: 6 }}>
                  <div className="op-row" style={{ justifyContent: "space-between" }}>
                    <label className="op-label" style={{ margin: 0 }}>
                      Bullet points
                    </label>
                    <button
                      type="button"
                      className="op-btn op-btn-ghost"
                      onClick={() => addBullet(slide.id)}
                    >
                      + Add bullet
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                    {(slide.bullets ?? []).map((b, idx) => (
                      <div key={`${slide.id}-b-${idx}`} className="op-row">
                        <input
                          className="op-input"
                          value={b}
                          onChange={(e) => updateBullet(slide.id, idx, e.target.value)}
                          placeholder={`Bullet ${idx + 1}`}
                        />
                        <button
                          type="button"
                          className="op-btn op-btn-ghost"
                          onClick={() => removeBullet(slide.id, idx)}
                          aria-label={`Remove bullet ${idx + 1} from slide ${index + 1}`}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="op-help op-muted">
                  Tip: Keep bullets short—PPT slides read best with 3–6 bullets.
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="op-help" style={{ marginTop: 12 }}>
          Validation will prevent empty slides at download time.
        </div>
      </div>
    </div>
  );
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}
