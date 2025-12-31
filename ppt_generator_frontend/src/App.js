import React, { useCallback, useMemo } from "react";
import "./App.css";

import { PresentationForm } from "./components/PresentationForm";
import { OptionsPanel } from "./components/OptionsPanel";
import { PreviewSummary } from "./components/PreviewSummary";
import { Toolbar } from "./components/Toolbar";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { usePptGenerator } from "./hooks/usePptGenerator";

import { getInitialState, STORAGE_KEY, sanitizePresentationState } from "./utils/defaults";
import { kebabCase } from "./utils/format";

// PUBLIC_INTERFACE
function App() {
  const [state, setState] = useLocalStorage(STORAGE_KEY, getInitialState, { debounceMs: 350 });
  const generator = usePptGenerator();

  const setContent = (content) => setState({ ...state, content });
  const setOptions = (options) => setState({ ...state, options });

  const { content, options } = state;

  const canGenerate = useMemo(() => {
    const { errors } = sanitizePresentationState(state);
    return errors.length === 0;
  }, [state]);

  const canDownload = Boolean(generator.generatedFile?.url);

  const statusText = useMemo(() => {
    if (generator.isGenerating) return "Working...";
    if (canDownload) return "Ready to download";
    return "Ready";
  }, [generator.isGenerating, canDownload]);

  // PUBLIC_INTERFACE
  const handleReset = useCallback(() => {
    generator.resetStatus();
    generator.clearGenerated();
    setState(getInitialState());
  }, [generator, setState]);

  // PUBLIC_INTERFACE
  const handleGenerate = useCallback(async () => {
    const nameBase = kebabCase(content.title) || "presentation";
    await generator.generate(state, { filename: `${nameBase}.pptx` });
  }, [generator, state, content.title]);

  // PUBLIC_INTERFACE
  const handleDownload = useCallback(() => {
    generator.download();
  }, [generator]);

  return (
    <div className="App">
      <div className="op-container">
        <header className="op-topbar">
          <h1 className="op-title">PPT Generator</h1>
          <p className="op-subtitle">
            Build a title slide, optional agenda slide, and content slides with bullets — then generate a .pptx entirely in
            the browser (with seamless backend fallback if configured).
          </p>
        </header>

        <main className="op-layout">
          <section style={{ display: "grid", gap: 18 }}>
            <PresentationForm value={content} onChange={setContent} defaultLayout={options.defaultLayout} />
          </section>

          <aside className="op-sticky" style={{ display: "grid", gap: 18, alignSelf: "start" }}>
            <OptionsPanel value={options} onChange={setOptions} />

            <div className="op-card">
              <div className="op-card-header">
                <h2 className="op-card-title">Preview summary</h2>
              </div>
              <div className="op-card-body">
                <PreviewSummary content={content} options={options} />
              </div>
            </div>

            <Toolbar
              isGenerating={generator.isGenerating}
              progressText={generator.progressText}
              error={generator.error}
              downloadError={generator.downloadError}
              generatedFile={generator.generatedFile}
              onGenerate={handleGenerate}
              onDownload={handleDownload}
              onReset={handleReset}
              canGenerate={canGenerate}
              statusText={statusText}
            />
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App;
