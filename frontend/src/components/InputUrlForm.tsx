import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import * as yup from "yup";
import "./InputUrlForm.css";

interface IFormInputsProps {
  url: string;
  sampleSize: number;
}

interface IFormSubmissionProps {
  url: string;
  sampleSize: number;
}

const schema = yup.object().shape({
  url: yup
    .string()
    .url("Please enter a valid url: e.g. https://www.bbc.com")
    .required("This field is required"),
  sampleSize: yup
    .number()
    .positive()
    .integer()
    .required("This field is required")
    .typeError("Please enter a positive a number"),
});

export default function InputUrlForm({
  onSubmit: submitForm,
}: {
  onSubmit: ({ url, sampleSize }: IFormSubmissionProps) => {};
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<IFormInputsProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: IFormInputsProps) => {
    if (!isDirty) return;
    submitForm({ ...formData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="urlContainer">
        <label className="label">Enter a url:</label>
        <input data-testid="urlInput" className="url" {...register("url")} />
        <ErrorMessage
          errors={errors}
          name="url"
          render={({ message }) => (
            <p className="error" data-testid="urlError">
              {message}
            </p>
          )}
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
          render={({ message }) => (
            <p className="error" data-testid="sampleSizeError">
              {message}
            </p>
          )}
        />
      </div>

      <input type="submit" className="submit" />
    </form>
  );
}
