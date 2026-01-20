import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/me", {
      withCredentials: true,
    })
    .then(() => {
      setLoggedIn(true);
      setLoading(false);
    })
    .catch(() => {
      setLoggedIn(false);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ color: "white" }}>Checking login...</div>;

  return loggedIn ? children : <Navigate to="/login" />;
}
