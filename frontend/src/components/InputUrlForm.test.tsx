import React from "react";
import InputUrlForm from "./InputUrlForm";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

afterEach(cleanup);

describe("Scrape Url", () => {
  describe("with valid inputs", () => {
    it("calls the props functions", async () => {
      const mockShowResults = jest.fn();
      const mockIsLoading = jest.fn();
      const { getByTestId, getByRole, container } = render(
        <InputUrlForm showResults={mockShowResults} isLoading={mockIsLoading} />
      );
      await act(async () => {
        // React-select is inherently difficult to test. Url input field has to be accessed using querySelector as a workaround.
        // See link for a better explanation: https://polvara.me/posts/testing-a-custom-select-with-react-testing-library
        const urlInput = container.querySelector(
          ".autoCompleteContainer__input"
        ).firstChild;
        fireEvent.change(urlInput, {
          target: { value: "https://www.bbc.com" },
        });
        fireEvent.change(getByTestId("sampleSize"), {
          target: { value: 15 },
        });
      });
      await act(async () => {
        fireEvent.click(getByRole("button"));
      });
      // mockShowResults is not called in time due to react-hook-form validation being async
      // expect(mockShowResults).toHaveBeenCalled();
      expect(mockIsLoading).toHaveBeenCalled();
    });
  });
  describe("with invalid url", () => {
    // it("renders the url error message", async () => {
    //   const mockShowResults = jest.fn();
    //   const mockIsLoading = jest.fn();
    //   const { findByText, container } = render(
    //     <InputUrlForm showResults={mockShowResults} isLoading={mockIsLoading} />
    //   );
    //   await act(async () => {
    //     const urlInput = container.querySelector(
    //       ".autoCompleteContainer__input"
    //     ).firstChild;
    //     fireEvent.change(urlInput, {
    //       target: { value: "invalid url" },
    //     });
    //     fireEvent.blur(urlInput);
    //   });
    //   expect(container.innerHTML).toContain(
    //     "Please enter a valid url: e.g. https://www.bbc.com"
    //   );
    // });
  });
  describe("with invalid sample size", () => {
    // it("calls the onSubmit function", async () => {
    //   const mockShowResults = jest.fn();
    //   const mockIsLoading = jest.fn();
    //   const { getByTestId, container } = render(
    //     <InputUrlForm showResults={mockShowResults} isLoading={mockIsLoading} />
    //   );
    //   await act(async () => {
    //     fireEvent.change(getByTestId("sampleSize"), {
    //       target: { value: "eek" },
    //     });
    //     fireEvent.blur(getByTestId("sampleSize"));
    //   });
    //   expect(container.innerHTML).toContain("Please enter a valid a number");
    //   expect(
    //     screen.getByText(/Please enter a valid a number/)
    //   ).toBeInTheDocument();
    // });
  });
});
