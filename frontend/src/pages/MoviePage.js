import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function MoviePage() {
  const { tmdbId } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios.get(API + "/api/auth/me", { withCredentials: true })
      .then(r => setUser(r.data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!tmdbId) return;
    axios.get(`${API}/api/movies/${tmdbId}`)
      .then(r => setMovie(r.data))
      .catch(() => setMovie(null));
    loadComments();
  }, [tmdbId]);

  function loadComments() {
    axios.get(`${API}/api/reviews/tmdb/${tmdbId}`)
      .then(r => setComments(r.data || []))
      .catch(() => setComments([]));
  }

  // Post a new comment (requires movie._id)
  function submitComment() {
    if (!text.trim() || !movie) return;
    axios.post(`${API}/api/reviews/${movie._id}`, { text, rating }, { withCredentials: true })
      .then(() => {
        setText(""); setRating(5); loadComments();
      })
      .catch(err => {
        console.error(err);
        alert(err?.response?.data?.error || "Could not post. Login?");
      });
  }

  // Enter edit mode
  function startEdit(review) {
    setEditingId(review._id);
    setEditText(review.text);
    setEditRating(review.rating || 5);
  }

  // Cancel edit
  function cancelEdit() {
    setEditingId(null); setEditText(""); setEditRating(5);
  }

  // Save edit
  function saveEdit(reviewId) {
    axios.put(`${API}/api/reviews/${reviewId}`, { text: editText, rating: editRating }, { withCredentials: true })
      .then(() => {
        cancelEdit();
        loadComments();
      })
      .catch(err => {
        console.error(err);
        alert(err?.response?.data?.error || "Could not edit");
      });
  }

  // Delete comment
  function deleteComment(reviewId) {
    if (!window.confirm("Delete this comment?")) return;
    axios.delete(`${API}/api/reviews/${reviewId}`, { withCredentials: true })
      .then(() => loadComments())
      .catch(err => {
        console.error(err);
        alert(err?.response?.data?.error || "Could not delete");
      });
  }

  // Add to watchlist
  function addToWatchlist() {
    if (!movie) return;
    axios.post(`${API}/api/watchlist/add/${movie._id}`, {}, { withCredentials: true })
      .then(() => alert("Added to watchlist"))
      .catch(() => alert("Login first"));
  }

  if (!movie) return <div className="center">Loading...</div>;

  return (
    <div className="movie-page">
      <div className="poster" />
      <div className="info">
  <h1>{movie.title}</h1>

  {/* ⭐ OVERALL RATING */}
  {movie.avgRating ? (
    <p className="avg-rating">
      ⭐ {movie.avgRating} / 5  
      <span className="review-count">({movie.reviewCount} reviews)</span>
    </p>
  ) : (
    <p className="avg-rating">No rating yet</p>
  )}

  <p>{movie.overview}</p>

  <button className="watchlist-btn" onClick={addToWatchlist}>
    ⭐ Add to Watchlist
  </button>
</div>


      <div className="comments-section">
        <h2>Comments</h2>

        {comments.length === 0 && <p>No comments yet.</p>}

        {comments.map(c => (
          <div key={c._id} className="comment-box">
            <div className="comment-header">
              <strong>{c.author?.username || "Unknown"}</strong>
              <span>⭐ {c.rating || "—"}</span>
            </div>

            {editingId === c._id ? (
              <>
                <textarea value={editText} onChange={e => setEditText(e.target.value)} />
                <div>
                  <select value={editRating} onChange={e => setEditRating(Number(e.target.value))}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                  <button onClick={() => saveEdit(c._id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p>{c.text}</p>

                {/* show edit/delete only to author */}
                {user && user.id === String(c.author?._id || c.author) && (
                  <div className="comment-actions">
                    <button onClick={() => startEdit(c)}>✏ Edit</button>
                    <button onClick={() => deleteComment(c._id)}>🗑 Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {user ? (
          <div className="add-comment">
            <h3>Add a comment</h3>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write your review..." />
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
            </select>
            <button onClick={submitComment}>Post</button>
          </div>
        ) : (
          <p>Please log in to post a comment.</p>
        )}
      </div>
    </div>
  );
}
