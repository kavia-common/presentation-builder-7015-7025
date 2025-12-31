import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

jest.mock("../hooks/usePptGenerator", () => {
  return {
    usePptGenerator: () => ({
      isGenerating: false,
      progressText: "",
      error: "",
      downloadError: "",
      generatedFile: {
        url: "blob:https://example.test/123",
        filename: "my-deck.pptx",
        sizeBytes: 1200,
        generatedAt: Date.now(),
      },
      hasGenerated: true,
      generate: jest.fn(),
      download: jest.fn(),
      resetStatus: jest.fn(),
      clearGenerated: jest.fn(),
    }),
  };
});

test("shows 'Ready to download' panel and enables Download after generation", () => {
  render(<App />);

  expect(screen.getByRole("region", { name: /Ready to download/i })).toBeInTheDocument();
  expect(screen.getByText(/my-deck\.pptx/i)).toBeInTheDocument();

  const downloadBtn = screen.getByRole("button", { name: /Download PPT/i });
  expect(downloadBtn).toBeEnabled();
});
