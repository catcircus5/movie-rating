import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../shared/MovieCard";

export default function WatchlistPage() {
  const [movies, setMovies] = useState([]);
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${API}/api/watchlist`, { withCredentials: true })
      .then((res) => setMovies(res.data));
  }, []);

  return (
    <div className="page-container centered-box">
      <h2 className="title">Your Watchlist</h2>

      <div className="grid-container">
        {movies.length === 0 && <p>Your watchlist is empty.</p>}
        {movies.map((m) => (
          <MovieCard key={m._id} movie={m} />
        ))}
      </div>
    </div>
  );
}
