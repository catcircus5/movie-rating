const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  tmdbId: { type: String, unique: true, index: true },
  title: String,
  originalLanguage: String,
  originalTitle: String,
  overview: String,
  genres: [Number],
  popularity: Number,
  releaseDate: Date,
  voteAverage: Number,
  voteCount: Number,
  streams: [String],
  poster: String
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
