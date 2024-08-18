import React, { useState } from "react";
import styles from "./Map.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";

function Map() {
  const navigate = useNavigate();
  const [position, setPosition] = useState([40, 0]);
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const { cities } = useCities();

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
