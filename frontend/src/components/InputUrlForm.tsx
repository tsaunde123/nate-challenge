import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./InputUrlForm.css";
import { ApiRoutes } from "src/lib/api";
import CreatableSelect from "react-select/creatable";
import { useHistory } from "src/lib/hooks";
import ErrorMessage from "./ErrorMessage";

interface IFormInputs {
  url: { label: string; value: string };
  sampleSize: number;
}

// The url type is an object rather than a string because the input field returns an object based on the user's
// input rather than a string, which would otherwise cause validation errors.
const schema = yup.object().shape({
  // url: yup.string().url().required(),
  url: yup
    .object()
    .shape({
      label: yup.string().url().required(),
      value: yup.string().url().required(),
    })
    .required("This field is required"),
  sampleSize: yup.number().positive().integer().required(),
});

const ControlledAutocomplete = ({
  options = [],
  control,
  defaultValue,
  name,
  placeholder,
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, field, ...props }) => {
          return (
            <CreatableSelect
              isClearable
              {...field}
              onChange={onChange}
              options={options}
              placeholder={placeholder}
            />
          );
        }}
        defaultValue={defaultValue}
      />
    </>
  );
};

export default function InputUrlForm({
  showResults,
  isLoading,
}: {
  showResults: (data: any) => {};
  isLoading: (isLoading: boolean) => {};
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const { history, error, mutate } = useHistory();

  useEffect(() => {
    isLoading(isSubmitting);
  }, [isLoading, isSubmitting]);

  const flattenValue = (option: { value: string; label: string }) =>
    option.value;

  const onSubmit = async (formData: IFormInputs) => {
    if (!isDirty) return;
    // const url = "https://www.bbc.co.uk/";
    // const url2 = "https://norvig.com/big.txt";
    const url: string = flattenValue(formData.url as any);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: url,
        sample_size: formData.sampleSize,
      }),
    };
    try {
      const response = await fetch(ApiRoutes.Scraper, requestOptions);
      const data = await response.json();
      showResults(data.word_occurrences);
      mutate();
    } catch {
      // TODO handle errors
      alert("Request failed.");
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="inputsContainer">
        <div className="urlContainer">
          <ControlledAutocomplete
            control={control}
            name="url"
            options={history.map((val) => {
              return { value: val, label: val };
            })}
            placeholder="Select or enter a url..."
            defaultValue={null}
          />
          <ErrorMessage message={errors.url?.value?.message} />
        </div>
        <div className="sampleSizeContainer">
          <label className="label">Sample size:</label>
          <input
            className="sampleSize"
            {...register("sampleSize")}
            defaultValue={10}
          />
          <ErrorMessage message={errors.sampleSize?.message} />
        </div>
      </div>

      <input type="submit" />
    </form>
  );
}
