const Movie = require('../models/Movie');
const Review = require('../models/Review');

exports.getMovies = async (req, res) => {
  const { q, page=1, limit=24 } = req.query;
  const filter = q ? { $or: [
    { title: new RegExp(q,'i') }, { overview: new RegExp(q,'i') }
  ] } : {};
  const skip = (page-1) * limit;
  const total = await Movie.countDocuments(filter);
  const movies = await Movie.find(filter).sort({ popularity:-1 }).skip(skip).limit(Number(limit));
  res.json({ total, page: Number(page), movies });
};


exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: req.params.tmdbId });

    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    // Fetch reviews for this movie
    const reviews = await Review.find({ movie: movie._id });

    // Compute rating
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
        : null;

    res.json({
      ...movie.toObject(),
      avgRating,
      reviewCount: reviews.length,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.createMovie = async (req, res) => {
  const movie = new Movie(req.body);
  await movie.save();
  res.status(201).json(movie);
};
exports.updateMovie = async (req, res) => {
  const m = await Movie.findOneAndUpdate({ tmdbId: req.params.tmdbId }, req.body, { new:true, upsert:false });
  if (!m) return res.status(404).json({ msg:'Not found' });
  res.json(m);
};
exports.deleteMovie = async (req, res) => {
  await Movie.deleteOne({ tmdbId: req.params.tmdbId });
  res.json({ ok:true });
};
exports.searchMovies = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const movies = await Movie.find({
      title: { $regex: q, $options: "i" }
    }).limit(20);

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

