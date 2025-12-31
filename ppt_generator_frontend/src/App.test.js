import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders PPT Generator header", () => {
  render(<App />);
  expect(screen.getByText(/PPT Generator/i)).toBeInTheDocument();
});

test("shows separate Generate and Download actions", () => {
  render(<App />);
  expect(screen.getByRole("button", { name: /Generate PPT/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Download PPT/i })).toBeInTheDocument();
});
