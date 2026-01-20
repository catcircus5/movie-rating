const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },

  
  tmdbId: { type: Number },

  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  rating: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
