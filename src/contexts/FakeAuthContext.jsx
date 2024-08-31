import { createContext, useContext } from "react";
import { useReducer } from "react";
const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
};
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
}
function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated, user } = state;
  function login(emial, password) {
    if (emial === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({
        type: "LOGIN",
        payload: FAKE_USER,
      });
    }
  }
  function logout() {
    dispatch({ type: "LOGOUT" });
  }
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
