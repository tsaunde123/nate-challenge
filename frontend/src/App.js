import React, { useEffect, useState } from "react";
import "./App.css";
import InputUrlForm from "./components/InputUrlForm";
import { scrapeUrl } from "./lib/api";
import { useHistory } from "src/lib/hooks";
import { ApiRoutes } from "./lib/constants";
import moment from "moment";

function WordOccurrences(wordOccurrences) {
  return (
    <div className="occurrences">
      {Object.keys(wordOccurrences).length > 0 &&
        Object.entries(wordOccurrences).map(([key, value], i) => {
          return (
            <p className="occurrence" key={key}>
              {key} - {value}
            </p>
          );
        })}
    </div>
  );
}

function DisplayResults({ results }) {
  const {
    word_occurrences: wordOccurrences,
    completion_time: completionTime,
    total_occurrences: totalOccurrences,
    error,
  } = results;

  const hasData = (obj) => Object.keys(obj || {}).length > 0;

  const readableCompletionTime = moment.duration(completionTime).humanize();
  return (
    <>
      {hasData(wordOccurrences) ? (
        <>
          <p className="metadata">{`Retrieved ${totalOccurrences} results in ${readableCompletionTime}.`}</p>
          <WordOccurrences {...wordOccurrences} />
        </>
      ) : (
        error && (
          <p className="error">
            Couldn't find any results for the url provided.
          </p>
        )
      )}
    </>
  );
}

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [results, setResults] = useState({});
  const [loading, isLoading] = useState(false);
  const { history, mutate } = useHistory();

  useEffect(() => {
    fetch(ApiRoutes.Time)
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  }, []);

  const onSubmit = async ({ url, sampleSize }) => {
    // const url = "https://www.bbc.co.uk/";
    // const url2 = "https://norvig.com/big.txt";
    isLoading(true);
    try {
      const data = await scrapeUrl({ url, sampleSize });
      setResults(data);

      mutate(); // mutate history with last searched url
      isLoading(false);
    } catch (e) {
      // TODO handle errors
      isLoading(false);
      alert("Request failed.");
      console.log(e);
      return;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Nate Challenge</p>
      </header>
      <div className="App-body">
        <p>The current time is {currentTime}.</p>
        <InputUrlForm onSubmit={onSubmit} history={history} />
        {loading ? (
          <p>Fetching results...</p>
        ) : (
          <DisplayResults results={results} />
        )}
      </div>
    </div>
  );
}

export default App;
