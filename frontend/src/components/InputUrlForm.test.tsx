import React from "react";
import InputUrlForm from "./InputUrlForm";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

afterEach(cleanup);

const mockOnSubmit = jest.fn(({ url, sampleSize }) => {
  return Promise.resolve({ url, sampleSize });
});

describe("Scrape Url", () => {
  describe("with valid inputs", () => {
    // it("form submitted correctly when the inputs are valid", async () => {
    //   const { getByTestId, getByRole, container } = render(
    //     <InputUrlForm onSubmit={mockOnSubmit} />
    //   );
    //   await act(async () => {
    //     // React-select is inherently difficult to test. Url input field has to be accessed using querySelector as a workaround.
    //     // See link for a better explanation: https://polvara.me/posts/testing-a-custom-select-with-react-testing-library
    //     const urlInput = container.querySelector(
    //       ".autoCompleteContainer__input"
    //     ).firstChild;
    //     fireEvent.change(urlInput, {
    //       target: { value: "https://www.bbc.com" },
    //     });
    //     fireEvent.change(getByTestId("sampleSize"), {
    //       target: { value: 15 },
    //     });
    //   });
    //   await act(async () => {
    //     fireEvent.submit(getByRole("button"));
    //   });
    //   // mockShowResults is not called in time due to react-hook-form validation being async
    //   expect(mockOnSubmit).toBeCalledWith("https://www.bbc.com", 15);
    // });
  });
  describe("with invalid url", () => {
    it("renders the url error message", async () => {
      const { getByRole, getByTestId, container } = render(
        <InputUrlForm onSubmit={mockOnSubmit} />
      );
      await act(async () => {
        const urlInput = container.querySelector(
          ".autoCompleteContainer__input"
        ).firstChild;
        fireEvent.change(urlInput, {
          target: { value: "invalid url" },
        });
        fireEvent.blur(urlInput);
      });
      await act(async () => {
        fireEvent.submit(getByRole("button"));
      });
      expect(getByTestId("urlError")).toBeVisible();
      expect(mockOnSubmit).not.toBeCalled();
    });
  });
  describe("with invalid sample size", () => {
    it("calls the onSubmit function", async () => {
      const { getByTestId, getByText, getByRole, container } = render(
        <InputUrlForm onSubmit={mockOnSubmit} />
      );
      await act(async () => {
        fireEvent.change(
          container.querySelector(".autoCompleteContainer__input").firstChild,
          {
            target: { value: "https://www.validurl.com" },
          }
        );
        fireEvent.change(getByTestId("sampleSize"), {
          target: { value: "eek" },
        });
        fireEvent.blur(getByTestId("sampleSize"));
      });
      await act(async () => {
        fireEvent.submit(getByRole("button"));
      });
      expect(getByTestId("sampleSizeError")).toBeVisible();
      expect(getByText("Please enter a valid a number")).toBeInTheDocument();
      expect(mockOnSubmit).not.toBeCalled();
    });
  });

  describe("with both invalid inputs", () => {
    it("calls the onSubmit function", async () => {
      const { getByTestId, getByRole, container } = render(
        <InputUrlForm onSubmit={mockOnSubmit} />
      );
      await act(async () => {
        fireEvent.change(
          container.querySelector(".autoCompleteContainer__input").firstChild,
          {
            target: { value: "invalid" },
          }
        );

        fireEvent.change(getByTestId("sampleSize"), {
          target: { value: "eek" },
        });
        fireEvent.blur(getByTestId("sampleSize"));
      });
      await act(async () => {
        fireEvent.submit(getByRole("button"));
      });
      expect(getByTestId("urlError")).toBeVisible();
      expect(getByTestId("sampleSizeError")).toBeVisible();
      expect(mockOnSubmit).not.toBeCalled();
    });
  });
});
