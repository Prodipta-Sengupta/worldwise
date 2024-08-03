import React from "react";
import styles from "./CityItem.module.css";
import { formatDate } from "../utils.js";

function CityItem({ city }) {
  const { emoji, cityName, date } = city;
  return (
    <li className={styles.cityItem}>
      <span className={styles.emoji}>{emoji}</span>
      <span className={styles.name}>{cityName}</span>
      <span className={styles.date}>{formatDate(date)}</span>
      <button className={styles.deleteBtn}>&times;</button>
    </li>
  );
}

export default CityItem;
