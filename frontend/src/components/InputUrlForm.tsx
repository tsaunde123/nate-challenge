import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./InputUrlForm.css";
import { ApiRoutes } from "src/lib/api";
import { Autocomplete } from "@material-ui/lab";
import CreatableSelect from "react-select/creatable";
import { useHistory } from "src/lib/hooks";

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
          {/* <Controller
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
          /> */}
          <Controller
            control={control}
            name="url"
            render={({ field: { onChange, value }, field, ...props }) => {
              return (
                <CreatableSelect
                  isClearable
                  {...field}
                  onChange={onChange}
                  options={history.map((val) => {
                    return { value: val, label: val };
                  })}
                />
              );
            }}
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
