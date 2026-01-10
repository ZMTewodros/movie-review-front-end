import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded User:", decoded);
      setUser(decoded); // { id, name, role }
    }
  }, [token]);

 // Locate this in your AuthProvider function
const login = (token) => {
  const decoded = jwtDecode(token); // Decode the token to get user info
  setToken(token);
  setUser(decoded);
  
  localStorage.setItem("token", token);
  // ADD THIS LINE:
  localStorage.setItem("user", JSON.stringify(decoded)); 
}; 

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
