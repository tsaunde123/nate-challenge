import React, { useEffect, useState } from "react";
import "./App.css";
import InputUrlForm from "./components/InputUrlForm";
import { ApiRoutes, scrapeUrl } from "./lib/api";
import { useHistory } from "src/lib/hooks";

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

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [wordOccurrences, setWordOccurrences] = useState({});
  const [loading, isLoading] = useState(false);
  const { history, mutate } = useHistory();

  useEffect(() => {
    fetch(ApiRoutes.Time)
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  }, []);

  useEffect(() => {
    if (Object.keys(wordOccurrences.length > 0)) {
      isLoading(false);
    }
  }, [wordOccurrences]);

  const onSubmit = async ({ url, sampleSize }) => {
    // const url = "https://www.bbc.co.uk/";
    // const url2 = "https://norvig.com/big.txt";
    isLoading(true);
    try {
      const data = await scrapeUrl({ url, sampleSize });
      setWordOccurrences(data.word_occurrences);
      mutate(); // mutate history with last searched url
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
          <WordOccurrences {...wordOccurrences} />
        )}
      </div>
    </div>
  );
}

export default App;
