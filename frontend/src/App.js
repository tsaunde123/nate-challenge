import "./App.css";
import { useEffect, useState } from "react";
import InputUrlForm from "./components/InputUrlForm";

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [wordOccurrences, setWordOccurrences] = useState({});
  const [loading, isLoading] = useState(false);
  // const [url, setUrl] = useState("");
  useEffect(() => {
    fetch("http://localhost:8000/api/time")
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  }, []);

  // async function onClick() {
  //   const url = "https://www.bbc.co.uk/";
  //   const url2 = "https://norvig.com/big.txt";
  //   const requestOptions = {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ url: url }),
  //   };
  //   const response = await fetch(
  //     "http://localhost:8000/api/scrape",
  //     requestOptions
  //   );
  //   const data = await response.json();
  //   setWordOccurrences(data.word_occurrences);
  // }

  // const onSubmit = async (event) => {
  //   event.preventDefault();
  //   // const url = "https://www.bbc.co.uk/";
  //   // const url2 = "https://norvig.com/big.txt";
  //   const requestOptions = {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ url: url }),
  //   };
  //   const response = await fetch(
  //     "http://localhost:8000/api/scrape",
  //     requestOptions
  //   );
  //   const data = await response.json();
  //   setWordOccurrences(data.word_occurrences);
  // };
  // const changeHandler = (event) => {
  //   setUrl(event.target.value);
  // };

  console.log(loading);

  return (
    <div className="App">
      <header className="App-header">
        <p>Nate Challenge</p>
      </header>
      <div className="App-body">
        <p>The current time is {currentTime}.</p>
        {/* <button onClick={onClick}>Click for results!</button> */}
        {/* <form onSubmit={onSubmit}>
          <p>Enter a url:</p>
          <input type="text" className="input" onChange={changeHandler} />
          <input type="submit" />
        </form> */}
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
