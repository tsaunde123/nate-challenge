import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Home from "../../pages/index";

describe("Home page", () => {
  it("should render the navbar items", () => {
    const { getByText } = render(<Home />);

    const heading = getByText(/Nate: Challenge/i);
    const search = getByText(/Search/i);
    const history = getByText(/History/i);

    expect(heading).toBeInTheDocument();
    expect(search).toBeInTheDocument();
    expect(history).toBeInTheDocument();
  });
  it("should render the url input", () => {
    const { getByPlaceholderText } = render(<Home />);

    const input = getByPlaceholderText(/URL/i);

    expect(input).toBeInTheDocument();
  });
});
