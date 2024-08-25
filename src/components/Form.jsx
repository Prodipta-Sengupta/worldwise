// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import useUrlPosition from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { lat, lng } = useUrlPosition();
  const [isLoading, setIsLoading] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState(null);
  useEffect(() => {
    if (!lat || !lng) return;
    try {
      setIsLoading(true);
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
      )
        .then((response) => response.json())
        .then((data) => {
          try {
            if (!data.countryCode) {
              throw new Error(
                "City not not found. Click somewhere on the map to get a city name."
              );
            } else {
              setGeoCodingError(null);
            }
            setCityName(data.city || data.locality || "");
            setCountry(data.countryName);
            setEmoji(convertToEmoji(data.countryCode));
          } catch (error) {
            setGeoCodingError(error.message);
          }
        });
    } catch (error) {
      setGeoCodingError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng]);
  if (!lat || !lng)
    return (
      <Message message="Click somewhere on the map to get a city name."></Message>
    );
  if (isLoading) return <Spinner></Spinner>;
  if (geoCodingError) return <Message message={geoCodingError}></Message>;
  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {<span className={styles.flag}>{emoji}</span>}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton></BackButton>
      </div>
    </form>
  );
}

export default Form;
