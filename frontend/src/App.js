import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtectedRoutes";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WatchlistPage from "./pages/watchlistPage";
import UserPage from "./pages/UserPage";
import MoviePage from "./pages/MoviePage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

        <Route path="/movie/:tmdbId" element={<ProtectedRoute><MoviePage /></ProtectedRoute>} />

        <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />

        <Route path="/profile/me" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />

        <Route path="/search" element={<SearchPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}
