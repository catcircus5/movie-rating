import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MovieCard from "../shared/MovieCard";

export default function SearchPage() {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q");
  const [movies, setMovies] = useState([]);
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!query) return;

    axios
      .get(`${API}/api/movies/search?q=${query}`)
      .then((res) => setMovies(res.data))
      .catch(() => setMovies([]));
  }, [query]);

  return (
    <div className="page-container centered-box">
      <h2 className="title">Search Results</h2>
      <p className="subtitle">Showing results for: <strong>{query}</strong></p>

      <div className="grid-container">
        {movies.length === 0 && <p>No movies found.</p>}
        {movies.map((m) => (
          <MovieCard key={m._id} movie={m} />
        ))}
      </div>
    </div>
  );
}
