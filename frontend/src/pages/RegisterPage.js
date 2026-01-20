import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMsg("Passwords do not match");
      return;
    }

    axios
      .post(
        "http://localhost:5000/api/auth/register",
        { username, email, password },
        { withCredentials: true }
      )
      .then(() => navigate("/login"))
      .catch((err) => {
        setMsg(err.response?.data?.msg || "Registration failed");
      });
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-box" onSubmit={handleRegister}>
        <h2>REGISTER</h2>

        <label>USERNAME</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>EMAIL</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>CONFIRM PASSWORD</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {msg && <p className="auth-error">{msg}</p>}

        <button type="submit">REGISTER</button>

        <p className="auth-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
