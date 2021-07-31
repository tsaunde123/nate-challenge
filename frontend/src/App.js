import React, { useEffect, useState } from "react";
import "./App.css";
import InputUrlForm from "./components/InputUrlForm";
import { ApiRoutes } from "./lib/api";

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [wordOccurrences, setWordOccurrences] = useState({});
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    fetch(ApiRoutes.Time)
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  }, []);

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
