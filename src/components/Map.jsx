import React, { useEffect, useState } from "react";
import styles from "./Map.module.css";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import useGeolocation from "../hooks/useGeolocation";
import Button from "./Button";
import useUrlPosition from "../hooks/useUrlPosition";

function Map() {
  const [position, setPosition] = useState([40, 0]);
  const { cities } = useCities();
  const { lat, lng } = useUrlPosition();
  const {
    isLoading: isLoadingGeolocation,
    position: positionGeolocation,
    getPosition,
  } = useGeolocation({ lat, lng });
  useEffect(() => {
    if (lat && lng) {
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (positionGeolocation.lat && positionGeolocation.lng) {
      setPosition([positionGeolocation.lat, positionGeolocation.lng]);
    }
  }, [positionGeolocation]);

  return (
    <div className={styles.mapContainer}>
      {!positionGeolocation.lat && !positionGeolocation.lng && (
        <Button type="position" onClick={getPosition}>
          {isLoadingGeolocation ? "Loading..." : "My position"}
        </Button>
      )}
      <MapContainer
        center={position}
        zoom={10}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          // console.log(city);
          return (
            <Marker
              key={city.id}
              position={[city.position.lat, city.position.lng]}
            >
              <Popup>
                {city.emoji} {city.cityName}
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={position} />
        <DetectClick />
      </MapContainer>
    </div>
  );
  function ChangeCenter({ position }) {
    useMap().setView([position[0], position[1]], 10);
    return null;
  }
  function DetectClick() {
    const navigate = useNavigate();
    useMapEvents({
      click: (e) => {
        navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`, {
          replace: true,
        });
      },
    });
    return null;
  }
}

export default Map;
