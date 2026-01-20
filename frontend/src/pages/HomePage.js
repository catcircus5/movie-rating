import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../shared/MovieCard';
import { Link } from 'react-router-dom';

export default function Home(){
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);

  const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(()=> {
    axios.get(API + '/api/movies?limit=12')
      .then(r=> setMovies(r.data.movies || r.data || []))
      .catch(()=> setMovies([]));
  },[]);

  useEffect(()=> {
    axios.get(API + '/api/users/watchlist', { withCredentials: true })
      .then(r=> setWatchlist(r.data || []))
      .catch(()=> setWatchlist([]));
  },[]);

  useEffect(()=> {
    axios.get(API + '/api/reviews/latest?limit=10')
      .then(r=> setLatestReviews(r.data || []))
      .catch(()=> setLatestReviews([]));
  },[]);

  return (
    <div className="home">
      <section className="row featured">
        <h3>Featured</h3>
        <div className="carousel">
          {movies.map(m => <MovieCard key={m.tmdbId || m._id} movie={m} />)}
        </div>
      </section>

      <section className="row watchlist">
        <h3>From your watchlist</h3>
        <div className="carousel">
          {watchlist.length ? watchlist.map(m => <MovieCard key={'w'+m.tmdbId} movie={m} />) : <p>Your watchlist is empty.</p>}
        </div>
      </section>

      <section className="row latest-reviews">
        <h3>Recent Comments</h3>
        <div className="reviews-grid">
          {latestReviews.length === 0 && <p>No recent comments.</p>}
          {latestReviews.map(r => (
            <div key={r._id} className="recent-review">
              <Link to={`/movie/${r.movie?.tmdbId || ''}`}><strong>{r.movie?.title || 'Unknown movie'}</strong></Link>
              <div><small>by {r.author?.username || '—'}</small></div>
              <div>⭐ {r.rating}</div>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
