import "./App.css";
import { useEffect, useState } from "react";
import InputUrlForm from "./components/InputUrlForm";
import useSWR from "swr";
import fetcher from "./lib/fetch";
import { ApiRoutes } from "./lib/api";
import { useAutocomplete, Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    label: {
      display: "block",
    },
    input: {
      width: 200,
    },
    listbox: {
      width: 200,
      margin: 0,
      padding: 0,
      zIndex: 1,
      position: "absolute",
      listStyle: "none",
      backgroundColor: theme.palette.background.paper,
      overflow: "auto",
      maxHeight: 200,
      border: "1px solid rgba(0,0,0,.25)",
      '& li[data-focus="true"]': {
        backgroundColor: "#4a8df6",
        color: "white",
        cursor: "pointer",
      },
      "& li:active": {
        backgroundColor: "#2977f5",
        color: "white",
      },
    },
  })
);

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [wordOccurrences, setWordOccurrences] = useState({});
  const [loading, isLoading] = useState(false);

  // const [url, setUrl] = useState("");
  useEffect(() => {
    fetch(ApiRoutes.Time)
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  }, []);

  const classes = useStyles();
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: [
      { title: "The Shawshank Redemption", year: 1994 },
      { title: "The Godfather", year: 1972 },
    ],
    getOptionLabel: (option) => option.title,
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>Nate Challenge</p>
      </header>
      <div className="App-body">
        <p>The current time is {currentTime}.</p>
        <InputUrlForm showResults={setWordOccurrences} isLoading={isLoading} />
        {/* <div>
          <div {...getRootProps()}>
            <label className={classes.label} {...getInputLabelProps()}>
              useAutocomplete
            </label>
            <input className={classes.input} {...getInputProps()} />
          </div>
          {groupedOptions.length > 0 ? (
            <ul className={classes.listbox} {...getListboxProps()}>
              {groupedOptions.map((option, index) => (
                <li {...getOptionProps({ option, index })}>{option.title}</li>
              ))}
            </ul>
          ) : null}
        </div> */}
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
