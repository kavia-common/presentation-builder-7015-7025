import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders PPT Generator header", () => {
  render(<App />);
  expect(screen.getByText(/PPT Generator/i)).toBeInTheDocument();
});

test("shows download panel and download is disabled before generation", () => {
  render(<App />);

  // DownloadCard exists but is not ready yet.
  expect(screen.queryByRole("region", { name: /Ready to download/i })).not.toBeInTheDocument();

  // Download button exists but disabled until generation produces a blob URL.
  const downloadBtn = screen.getByRole("button", { name: /Download PPT/i });
  expect(downloadBtn).toBeDisabled();

  // Generate remains available.
  expect(screen.getByRole("button", { name: /Generate PPT/i })).toBeInTheDocument();
});
