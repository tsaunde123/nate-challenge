import "./App.css";
import { useEffect, useState } from "react";
import InputUrlForm from "./components/InputUrlForm";
import useSWR from "swr";
import fetcher from "./lib/fetch";
import { ApiRoutes } from "./lib/api";

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [wordOccurrences, setWordOccurrences] = useState({});
  const [loading, isLoading] = useState(false);

  const { data: pastSearches, error } = useSWR(ApiRoutes.Searches, fetcher);
  // const [url, setUrl] = useState("");
  useEffect(() => {
    fetch(ApiRoutes.Time)
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  }, []);

  console.log(pastSearches);

  return (
    <div className="App">
      <header className="App-header">
        <p>Nate Challenge</p>
      </header>
      <div className="App-body">
        <p>The current time is {currentTime}.</p>
        <InputUrlForm showResults={setWordOccurrences} isLoading={isLoading} />
        {loading ? (
          <p>Fetching results...</p>
        ) : (
          <div className="occurrence">
            {Object.keys(wordOccurrences).length > 0 &&
              Object.entries(wordOccurrences).map(([key, value], i) => {
                return (
                  <p className="occurrence" key={key}>
                    {key} - {value}
                  </p>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
