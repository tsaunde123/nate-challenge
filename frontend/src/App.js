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

function DisplayResults(props) {
  const { wordOccurrences, metadata } = props;

  const hasData = (obj) => Object.keys(obj || {}).length > 0;

  const completionTime = moment.duration(metadata.completionTime).humanize();
  return (
    <>
      {hasData(wordOccurrences) ? (
        <>
          <p className="metadata">{`Retrieved ${metadata.totalOccurrences} results in ${completionTime}.`}</p>
          <WordOccurrences {...wordOccurrences} />
        </>
      ) : (
        metadata.error && (
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
  const [wordOccurrences, setWordOccurrences] = useState({});
  const [metadata, setMetadata] = useState({});
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
      setMetadata({
        completionTime: data.completion_time,
        totalOccurrences: data.total_occurrences,
        error: data.error,
      });
      setWordOccurrences(data.word_occurrences);

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
          <DisplayResults
            wordOccurrences={wordOccurrences}
            metadata={metadata}
          />
        )}
      </div>
    </div>
  );
}

export default App;
