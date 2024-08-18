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
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
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
