import React from "react";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";

function CountriesList({ cities, isLoading }) {
  if (isLoading) {
    return <Spinner></Spinner>;
  }
  if (!cities.length)
    return (
      <Message message={"Add your first city by clicking on the map"}></Message>
    );

  const countries = cities.reduce((acc, city) => {
    if (!acc.map((el) => el.country).includes(city.country)) {
      return [
        ...acc,
        {
          country: city.country,
          id: city.id,
          emoji: city.emoji,
        },
      ];
    } else {
      return acc;
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id}></CountryItem>
      ))}
    </ul>
  );
}

export default CountriesList;
