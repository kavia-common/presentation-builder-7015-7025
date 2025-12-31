import PptxGenJS from "pptxgenjs";

/**
 * PUBLIC_INTERFACE
 * Generate a PPTX from structured presentation data.
 * @param {{content:{title:string,subtitle?:string,agendaItems:string[],slides:Array<{title:string,bullets:string[],layout?:string}>}, options:{theme:string,font:string,slideSize:string,footerText?:string,includeAgendaSlide?:boolean}}} presentationData
 * @returns {Promise<Blob>} PPTX blob ready for download
 */
export async function generatePptx(presentationData) {
  const pptx = new PptxGenJS();

  const { content, options } = presentationData;

  // Layout
  pptx.layout = options.slideSize === "4:3" ? "LAYOUT_4X3" : "LAYOUT_WIDE";

  // Metadata
  pptx.author = "PPT Generator";
  pptx.company = "Ocean Professional";
  pptx.subject = "Generated PPTX";

  // Theme: use common fonts (safe) and rely on colors for branding.
  const fontFace = mapFont(options.font);
  pptx.theme = {
    headFontFace: fontFace,
    bodyFontFace: fontFace,
    lang: "en-US",
  };

  const colors = getOceanPalette();

  // Title slide
  addTitleSlide(pptx, {
    title: content.title,
    subtitle: content.subtitle,
    footerText: options.footerText,
    colors,
    fontFace,
  });

  // Agenda slide (optional, only if items exist)
  if (options.includeAgendaSlide && content.agendaItems && content.agendaItems.length > 0) {
    addBulletsSlide(pptx, {
      title: "Agenda",
      bullets: content.agendaItems,
      footerText: options.footerText,
      colors,
      fontFace,
    });
  }

  // Content slides
  for (const slide of content.slides) {
    addBulletsSlide(pptx, {
      title: slide.title,
      bullets: slide.bullets,
      footerText: options.footerText,
      colors,
      fontFace,
    });
  }

  // Browser export to Blob
  const blob = await pptx.write("blob");
  return blob;
}

function getOceanPalette() {
  return {
    primary: "2563EB",
    secondary: "F59E0B",
    error: "EF4444",
    text: "111827",
    muted: "6B7280",
    bg: "F9FAFB",
    surface: "FFFFFF",
  };
}

function mapFont(font) {
  // Keep to common fonts that are likely available; PPT viewers will substitute as needed.
  const f = String(font || "").toLowerCase();
  if (f.includes("calibri")) return "Calibri";
  if (f.includes("arial")) return "Arial";
  if (f.includes("inter")) return "Inter";
  if (f.includes("aptos")) return "Aptos";
  return "Calibri";
}

function addTitleSlide(pptx, { title, subtitle, footerText, colors, fontFace }) {
  const s = pptx.addSlide();

  // Background
  s.background = { color: colors.bg };

  // Accent bar
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.35,
    fill: { color: colors.primary, transparency: 8 },
    line: { color: colors.primary, transparency: 100 },
  });

  // Title
  s.addText(title, {
    x: 0.75,
    y: 1.6,
    w: 11.85,
    h: 1.0,
    fontFace,
    fontSize: 40,
    bold: true,
    color: colors.text,
  });

  if (subtitle) {
    s.addText(subtitle, {
      x: 0.78,
      y: 2.65,
      w: 11.8,
      h: 0.7,
      fontFace,
      fontSize: 18,
      color: colors.muted,
    });
  }

  // Accent dot
  s.addShape(pptx.ShapeType.ellipse, {
    x: 0.78,
    y: 3.62,
    w: 0.14,
    h: 0.14,
    fill: { color: colors.secondary },
    line: { color: colors.secondary },
  });

  s.addText("Generated with Ocean Professional theme", {
    x: 1.0,
    y: 3.55,
    w: 11.3,
    h: 0.4,
    fontFace,
    fontSize: 12,
    color: colors.muted,
  });

  addFooter(s, pptx, { footerText, colors, fontFace });
}

function addBulletsSlide(pptx, { title, bullets, footerText, colors, fontFace }) {
  const s = pptx.addSlide();
  s.background = { color: colors.surface };

  // Header band with subtle color
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.9,
    fill: { color: colors.bg },
    line: { color: colors.bg },
  });

  // Header accent
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.12,
    h: 0.9,
    fill: { color: colors.primary },
    line: { color: colors.primary },
  });

  s.addText(title, {
    x: 0.55,
    y: 0.18,
    w: 12.6,
    h: 0.6,
    fontFace,
    fontSize: 24,
    bold: true,
    color: colors.text,
  });

  const bulletTextRuns = (bullets || []).map((b) => ({
    text: b,
    options: { bullet: { indent: 18 }, hanging: 6 },
  }));

  s.addText(bulletTextRuns, {
    x: 0.85,
    y: 1.35,
    w: 12.0,
    h: 5.2,
    fontFace,
    fontSize: 18,
    color: colors.text,
    valign: "top",
    paraSpaceAfter: 8,
  });

  addFooter(s, pptx, { footerText, colors, fontFace });
}

function addFooter(slide, pptx, { footerText, colors, fontFace }) {
  if (!footerText) return;

  // Footer separator
  slide.addShape(pptx.ShapeType.line, {
    x: 0.65,
    y: 7.05,
    w: 12.0,
    h: 0,
    line: { color: "E5E7EB", width: 1 },
  });

  slide.addText(footerText, {
    x: 0.7,
    y: 7.12,
    w: 11.9,
    h: 0.35,
    fontFace,
    fontSize: 11,
    color: colors.muted,
  });
}
