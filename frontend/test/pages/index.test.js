import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../../pages/index";

describe("Home page", () => {
  it("should render the navbar", () => {
    render(<Home />);

    const heading = screen.getByText(/Nate: Challenge/i);
    const search = screen.getByText(/Search/i);
    const history = screen.getByText(/History/i);

    expect(heading).toBeInTheDocument();
    expect(search).toBeInTheDocument();
    expect(history).toBeInTheDocument();
  });
  it("should render the url input", () => {
    render(<Home />);

    const input = screen.getByPlaceholderText(/URL/i);

    expect(input).toBeInTheDocument();
  });
});
