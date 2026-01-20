import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Check login state
  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/me", {
      withCredentials: true,
    })
    .then((res) => {
      setLoggedIn(true);
      setUsername(res.data.username);
    })
    .catch(() => setLoggedIn(false));
  }, []);

  const logout = () => {
    axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true })
      .then(() => {
        setLoggedIn(false);
        navigate("/login");
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") navigate(`/search?q=${query}`);
  };

  return (
    <header className="topbar">
      <Link to="/" className="logo">★</Link>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <nav className="nav-links">
        <Link to="/">Movies</Link>

        {loggedIn && <Link to="/watchlist">Watchlist</Link>}
        {loggedIn && <Link to="/profile/me">Profile</Link>}

        {!loggedIn && <Link to="/login">Login</Link>}
        {!loggedIn && <Link to="/register">Register</Link>}

        {loggedIn && (
          <button onClick={logout} className="logout-btn">Logout</button>
        )}
      </nav>
    </header>
  );
}
