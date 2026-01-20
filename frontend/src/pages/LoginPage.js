import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password },
      { withCredentials: true }
    )
    .then(() => navigate("/"))
    .catch((err) => {
      setMsg(err.response?.data?.msg || "Login failed");
    });
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-box" onSubmit={handleLogin}>
        <h2>WELCOME!</h2>

        <label>EMAIL</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label>PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {msg && <p className="auth-error">{msg}</p>}

        <button type="submit">LOGIN</button>

        <p className="auth-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}
