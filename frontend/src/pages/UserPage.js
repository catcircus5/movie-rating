import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../shared/MovieCard";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [comments, setComments] = useState([]);
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${API}/api/auth/me`, { withCredentials: true })
      .then((r) => setUser(r.data))
      .catch(() => setUser(null));

    axios
      .get(`${API}/api/watchlist`, { withCredentials: true })
      .then((r) => setWatchlist(r.data));

    axios
      .get(`${API}/api/reviews/user`, { withCredentials: true })
      .then((r) => setComments(r.data));
  }, []);

  if (!user) return <div className="centered-box"><p>Please log in.</p></div>;

  return (
    <div className="page-container centered-box">
      <h2 className="title">{user.username}'s Profile</h2>

      <h3 className="subtitle">Your Watchlist</h3>
      <div className="grid-container">
        {watchlist.length === 0 && <p>No movies added yet.</p>}
        {watchlist.map((m) => <MovieCard key={m._id} movie={m} />)}
      </div>

      <h3 className="subtitle">Your Comments</h3>
      <div className="comment-list">
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((c) => (
          <div key={c._id} className="comment-box">
            <p><strong>{c.movie?.title}</strong></p>
            <p>⭐ {c.rating}</p>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
