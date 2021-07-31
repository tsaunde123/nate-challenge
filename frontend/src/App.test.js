import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

/**
 * @jest-environment jsdom
 */

test("renders Nate Challenge title", () => {
  render(<App />);
  const linkElement = screen.getByText(/Nate Challenge/i);
  expect(linkElement).toBeInTheDocument();
});
