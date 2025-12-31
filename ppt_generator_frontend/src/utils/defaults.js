/**
 * Default structures for presentation builder state.
 */

export const STORAGE_KEY = "ppt_generator_state_v1";

/**
 * PUBLIC_INTERFACE
 * Returns a fresh initial state for the form.
 */
export function getInitialState() {
  return {
    content: {
      title: "",
      subtitle: "",
      agendaItems: [""],
      slides: [
        {
          id: cryptoRandomId(),
          title: "Overview",
          bullets: ["Key point 1", "Key point 2"],
          layout: "title-bullets",
        },
      ],
    },
    options: {
      theme: "ocean-professional",
      font: "Aptos",
      slideSize: "16:9",
      footerText: "",
      includeAgendaSlide: true,
      defaultLayout: "title-bullets",
    },
  };
}

/**
 * PUBLIC_INTERFACE
 * Sanitizes and validates raw state for PPT generation.
 * Returns { data, errors } where errors is an array of strings.
 */
export function sanitizePresentationState(state) {
  const errors = [];
  const content = state?.content ?? {};
  const options = state?.options ?? {};

  const title = String(content.title ?? "").trim();
  const subtitle = String(content.subtitle ?? "").trim();

  if (!title) errors.push("Presentation title is required.");

  const agendaItems =
    Array.isArray(content.agendaItems) ? content.agendaItems : [];
  const normalizedAgenda = agendaItems
    .map((x) => String(x ?? "").trim())
    .filter(Boolean);

  const slidesRaw = Array.isArray(content.slides) ? content.slides : [];
  const slides = slidesRaw
    .map((s) => ({
      id: s?.id ?? cryptoRandomId(),
      title: String(s?.title ?? "").trim(),
      bullets: (Array.isArray(s?.bullets) ? s.bullets : [])
        .map((b) => String(b ?? "").trim())
        .filter(Boolean),
      layout:
        String(s?.layout ?? "").trim() ||
        String(options.defaultLayout ?? "title-bullets"),
    }))
    .filter((s) => s.title || s.bullets.length > 0);

  if (slides.length === 0) errors.push("Add at least one non-empty content slide.");

  const cleanedSlides = slides.map((s, idx) => {
    const localErrors = [];
    if (!s.title) localErrors.push(`Slide ${idx + 1}: title is required.`);
    if (s.bullets.length === 0)
      localErrors.push(`Slide ${idx + 1}: add at least one bullet point.`);
    errors.push(...localErrors);
    return s;
  });

  const cleaned = {
    content: {
      title,
      subtitle,
      agendaItems: normalizedAgenda,
      slides: cleanedSlides,
    },
    options: {
      theme: String(options.theme ?? "ocean-professional"),
      font: String(options.font ?? "Aptos"),
      slideSize: String(options.slideSize ?? "16:9"),
      footerText: String(options.footerText ?? ""),
      includeAgendaSlide: Boolean(options.includeAgendaSlide),
      defaultLayout: String(options.defaultLayout ?? "title-bullets"),
    },
  };

  return { data: cleaned, errors };
}

function cryptoRandomId() {
  // Small helper without external deps. Works in modern browsers.
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}
