import { createContext } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useReducer } from "react";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
  };
  function reducer(state, action) {
    switch (action.type) {
      case "SET_CITIES":
        return {
          ...state,
          cities: action.payload,
        };
      case "SET_IS_LOADING":
        return {
          ...state,
          isLoading: action.payload,
        };
      case "SET_CURRENT_CITY":
        return {
          ...state,
          currentCity: action.payload,
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity } = state;

  const BASE_URL = "http://localhost:8000/";

  useEffect(() => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    try {
      fetch(`${BASE_URL}cities`)
        .then((response) => response.json())
        .then((data) => {
          dispatch({ type: "SET_CITIES", payload: data });
        });
    } catch (error) {
      alert("There was an error loading the data. Please try again later.");
    } finally {
      dispatch({ type: "SET_IS_LOADING", payload: false });
    }
  }, []);

  async function getCity(id) {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    try {
      const response = await fetch(`${BASE_URL}cities/${id}`);
      const data = await response.json();
      dispatch({ type: "SET_CURRENT_CITY", payload: data });
    } catch (error) {
      alert("There was an error loading the data. Please try again later.");
    } finally {
      dispatch({ type: "SET_IS_LOADING", payload: false });
    }
  }
  async function createCity(newCity) {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    try {
      const response = await fetch(`${BASE_URL}cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await response.json();
      dispatch({ type: "SET_CITIES", payload: [...cities, data] });
      dispatch({ type: "SET_CURRENT_CITY", payload: data });
    } catch (error) {
      alert("There was an error loading the data. Please try again later.");
    } finally {
      dispatch({ type: "SET_IS_LOADING", payload: false });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    try {
      await fetch(`${BASE_URL}cities/${id}`, {
        method: "DELETE",
      });
      dispatch({
        type: "SET_CITIES",
        payload: cities.filter((city) => city.id !== id),
      });
      dispatch({ type: "SET_CURRENT_CITY", payload: {} });
    } catch (error) {
      alert("There was an error deleting the city. Please try again later.");
    } finally {
      dispatch({ type: "SET_IS_LOADING", payload: false });
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
