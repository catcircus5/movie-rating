import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const add = () => {
    axios.post(
      `http://localhost:5000/api/watchlist/add/${movie._id}`,
      {},
      { withCredentials: true }
    );
  };

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.tmdbId}`}>
        <img src={movie.poster} alt={movie.title} />
      </Link>

      <h4>{movie.title}</h4>
    </div>
   
  );
}
