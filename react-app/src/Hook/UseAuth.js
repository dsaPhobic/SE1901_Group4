// hooks/useAuth.js
import { useState, useEffect } from "react";
import { getMe, login, logout, register } from "../Services/AuthApi";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setUser(null);
        } else {
          console.error("Failed to fetch user:", err);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function handleLogin(data) {
    return login(data)
      .then((res) => {
        setUser(res.data);
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  }

  function handleRegister(data) {
    return register(data)
      .then((res) => {
        setUser(res.data);
        return res.data;
      })
      .catch((err) => {
        throw err;
      });
  }

  function handleLogout() {
    return logout()
      .then(() => {
        setUser(null);
      })
      .catch((err) => {
        throw err;
      });
  }

  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
}
