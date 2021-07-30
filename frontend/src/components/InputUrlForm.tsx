import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./InputUrlForm.css";
import { ApiRoutes } from "src/lib/api";
import { useAutocomplete, Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import useSWR from "swr";
import fetcher from "src/lib/fetch";

interface IFormInputs {
  url: string;
  sampleSize: number;
}

const schema = yup.object().shape({
  url: yup.string().url().required(),
  sampleSize: yup.number().positive().integer().required(),
});

function ErrorMessage({ message }: { message: string }) {
  return <p className="error">{message}</p>;
}

const ControlledAutocomplete = ({
  options = [],
  renderInput,
  getOptionLabel,
  onChange: ignored,
  control,
  defaultValue,
  name,
  renderOption,
}) => {
  return (
    <>
      {/* <Controller
        render={({ ...props }) => (
          <Autocomplete
            options={options}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption}
            renderInput={renderInput}
            // onChange={(e, data) => onChange(data)}
            {...props}
          />
        )}
        // onChange={([, data]) => data}
        defaultValue={defaultValue}
        name={name}
        control={control}
      /> */}
      <Controller
        render={({ field: { onChange }, ...props }) => (
          <Autocomplete
            {...props}
            options={options}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption}
            renderInput={renderInput}
            onChange={(_, data) => onChange(data)}
          />
        )}
        defaultValue={defaultValue}
        name={name}
        control={control}
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

  const { data: pastSearches, error } = useSWR(ApiRoutes.Searches, fetcher);

  useEffect(() => {
    isLoading(isSubmitting);
  }, [isLoading, isSubmitting]);

  const onSubmit = async (formData: IFormInputs) => {
    if (!isDirty) return;
    // const url = "https://www.bbc.co.uk/";
    // const url2 = "https://norvig.com/big.txt";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: formData.url,
        sample_size: formData.sampleSize,
      }),
    };
    const response = await fetch(ApiRoutes.Scraper, requestOptions);
    const data = await response.json();
    showResults(data.word_occurrences);
    // TODO handle errors
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="inputsContainer">
        <div className="urlContainer">
          <Controller
            render={({ field: { onChange }, ...props }) => (
              <Autocomplete
                {...props}
                options={pastSearches?.urls}
                getOptionLabel={(option: string) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a url"
                    variant="outlined"
                  />
                )}
                onChange={(_, data) => onChange(data)}
              />
            )}
            name="url"
            control={control}
          />
          <ErrorMessage message={errors.url?.message} />
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
