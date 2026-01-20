const router = require("express").Router();
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Movie = require("../models/Movie");
const auth = require("../middleware/auth");

// helper: check if current user is author
async function isAuthor(reviewId, userId) {
  const r = await Review.findById(reviewId);
  if (!r) return false;
  return r.author.toString() === userId.toString();
}

// GET reviews by Movie ObjectId
router.get("/movie/:movieId", async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate("author", "username");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET reviews by TMDB id (find movie then reviews)
router.get("/tmdb/:tmdbId", async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: Number(req.params.tmdbId) });
    if (!movie) return res.json([]); // no movie means no reviews
    const reviews = await Review.find({ movie: movie._id })
      .populate("author", "username");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET latest reviews (global) - limit optional (default 10)
router.get("/latest", async (req, res) => {
  try {
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author", "username")
      .populate("movie", "title tmdbId poster"); // populates movie ref
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET reviews by user
router.get("/user/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("movie", "title tmdbId poster")
      .populate("author", "username");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST create review: accepts either movie._id in url (ObjectId) or body with tmdbId
// For consistency we use POST /api/reviews/:movieId where movieId is the Movie _id
router.post("/:movieId", auth, async (req, res) => {
  try {
    const { text, rating } = req.body;
    const movieId = req.params.movieId;

    // ensure movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(400).json({ error: "Movie not found" });

    const review = await Review.create({
      movie: movie._id,
      tmdbId: movie.tmdbId,
      author: req.session.userId,
      text,
      rating: Number(rating) || 5
    });

    await review.populate("author", "username");
    res.json(review);
  } catch (err) {
    console.error("POST /reviews/:movieId error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update review by reviewId (only author)
router.put("/:reviewId", auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    if (!await isAuthor(reviewId, req.session.userId)) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const { text, rating } = req.body;
    const updated = await Review.findByIdAndUpdate(
      reviewId,
      { text, rating },
      { new: true }
    ).populate("author", "username");

    res.json(updated);
  } catch (err) {
    console.error("PUT /reviews/:reviewId error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE review (author or admin — admin middleware optional)
router.delete("/:reviewId", auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    if (!await isAuthor(reviewId, req.session.userId)) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error("DELETE /reviews/:reviewId error", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
