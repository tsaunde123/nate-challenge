import React from "react";
import InputUrlForm from "./InputUrlForm";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

afterEach(cleanup);

const mockOnSubmit = jest.fn(({ url, sampleSize }) => {
  return Promise.resolve({ url, sampleSize });
});

describe("Scrape Url", () => {
  describe("with valid inputs", () => {
    it("form submitted correctly when the inputs are valid", async () => {
      const { getByTestId, getByRole } = render(
        <InputUrlForm onSubmit={mockOnSubmit} />
      );
      await act(async () => {
        const urlInput = getByTestId("urlInput");
        fireEvent.change(urlInput, {
          target: { value: "https://www.bbc.com" },
        });
        fireEvent.change(getByTestId("sampleSize"), {
          target: { value: 15 },
        });
      });
      await act(async () => {
        fireEvent.submit(getByRole("button"));
      });
      expect(mockOnSubmit).toBeCalledWith({
        url: "https://www.bbc.com",
        sampleSize: 15,
      });
    });
  });
  describe("with invalid url", () => {
    it("renders the url error message", async () => {
      const { getByRole, getByTestId } = render(
        <InputUrlForm onSubmit={mockOnSubmit} />
      );
      await act(async () => {
        const urlInput = getByTestId("urlInput");
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
      const { getByTestId, getByText, getByRole } = render(
        <InputUrlForm onSubmit={mockOnSubmit} />
      );
      await act(async () => {
        fireEvent.change(getByTestId("urlInput"), {
          target: { value: "https://www.validurl.com" },
        });
        fireEvent.change(getByTestId("sampleSize"), {
          target: { value: "eek" },
        });
        fireEvent.blur(getByTestId("sampleSize"));
      });
      await act(async () => {
        fireEvent.submit(getByRole("button"));
      });
      expect(getByTestId("sampleSizeError")).toBeVisible();
      expect(getByText("Please enter a positive a number")).toBeInTheDocument();
      expect(mockOnSubmit).not.toBeCalled();
    });
  });

  describe("with both invalid inputs", () => {
    it("calls the onSubmit function", async () => {
      const { getByTestId, getByRole } = render(
        <InputUrlForm onSubmit={mockOnSubmit} />
      );
      await act(async () => {
        fireEvent.change(getByTestId("urlInput"), {
          target: { value: "invalid" },
        });

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
