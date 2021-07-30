import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./InputUrlForm.css";
import { ApiRoutes } from "src/lib/api";

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

export default function InputUrlForm({
  showResults,
  isLoading,
}: {
  showResults: (data: any) => {};
  isLoading: (isLoading: boolean) => {};
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });
  // const [wordOccurrences, setWordOccurrences] = useState({});
  // const onSubmit = (data: IFormInputs) => console.log(data);

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
          <label className="label">Enter a url:</label>
          <input className="url" {...register("url")} />
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
