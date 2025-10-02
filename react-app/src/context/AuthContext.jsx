import React, { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../Services/AuthApi"; // API lấy user

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getMe();
        setUser(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          console.log("User not logged in");
          setUser(null);
        } else {
          console.error("Failed to fetch user:", err);
        }
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}