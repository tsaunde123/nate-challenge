import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import * as yup from "yup";
import "./InputUrlForm.css";

import ControlledAutocomplete from "./ControlledAutocomplete";

interface IFormInputsProps {
  url: { label: string; value: string };
  sampleSize: number;
}

interface IFormSubmissionProps {
  url: string;
  sampleSize: number;
}

// The url type is an object rather than a string because the input field returns an object based on the user's
// input rather than a string, which would otherwise cause validation errors.
const schema = yup.object().shape({
  url: yup
    .object()
    .shape({
      label: yup.string().url().required(),
      value: yup.string().url().required(),
    })
    .required("This field is required")
    .typeError("Please enter a valid url: e.g. https://www.bbc.com"),
  sampleSize: yup
    .number()
    .positive()
    .integer()
    .required("This field is required")
    .typeError("Please enter a valid a number"),
});

export default function InputUrlForm({
  onSubmit: submitForm,
  history = [],
}: {
  onSubmit: ({ url, sampleSize }: IFormSubmissionProps) => {};
  history: any;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<IFormInputsProps>({
    resolver: yupResolver(schema),
  });

  const flattenValue = (option: { value: string; label: string }) =>
    option.value;

  const onSubmit = async (formData: IFormInputsProps) => {
    if (!isDirty) return;
    const url: string = flattenValue(formData.url as any);
    const sampleSize: number = formData.sampleSize;
    submitForm({ url, sampleSize });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="inputsContainer">
        <div className="urlContainer">
          <ControlledAutocomplete
            className="urlInput"
            control={control}
            name="url"
            options={history.map((val) => {
              return { value: val, label: val };
            })}
            placeholder="Select or enter a url..."
          />
          <ErrorMessage
            errors={errors}
            name="url"
            render={({ message }) => <p className="error">{message}</p>}
          />
        </div>
        <div className="sampleSizeContainer">
          <label className="label">Sample size:</label>
          <input
            data-testid="sampleSize"
            className="sampleSize"
            {...register("sampleSize")}
            defaultValue={10}
          />
          <ErrorMessage
            errors={errors}
            name="sampleSize"
            render={({ message }) =>
              errors.sampleSize && <p className="error">{message}</p>
            }
          />
        </div>
      </div>

      <input type="submit" className="submit" />
    </form>
  );
}
