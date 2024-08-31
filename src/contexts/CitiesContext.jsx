import { createContext } from "react";
import { useState, useEffect } from "react";
import { useContext } from "react";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  const BASE_URL = "http://localhost:8000/";

  useEffect(() => {
    setIsLoading(true);
    try {
      fetch(`${BASE_URL}cities`)
        .then((response) => response.json())
        .then((data) => {
          setCities(data);
        });
    } catch (error) {
      alert("There was an error loading the data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function getCity(id) {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}cities/${id}`);
      const data = await response.json();
      setCurrentCity(data);
    } catch (error) {
      alert("There was an error loading the data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }
  async function createCity(newCity) {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await response.json();
      setCities([...cities, data]);
    } catch (error) {
      alert("There was an error loading the data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    setIsLoading(true);
    try {
      await fetch(`${BASE_URL}cities/${id}`, {
        method: "DELETE",
      });
      setCities(cities.filter((city) => city.id !== id));
    } catch (error) {
      alert("There was an error deleting the city. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
