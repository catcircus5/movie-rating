const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const auth = require("../middleware/auth");

// GET WATCHLIST
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate("watchlist");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.watchlist);
  } catch (err) {
    console.error("Watchlist GET error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ADD MOVIE TO WATCHLIST
router.post("/add/:movieId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const movieId = new mongoose.Types.ObjectId(req.params.movieId);

    if (!user.watchlist.some(id => id.equals(movieId))) {
      user.watchlist.push(movieId);
      await user.save();
    }

    res.json({ msg: "Added to watchlist" });
  } catch (err) {
    console.error("Watchlist ADD error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// REMOVE MOVIE FROM WATCHLIST
router.delete("/remove/:movieId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const movieId = req.params.movieId;

    user.watchlist = user.watchlist.filter(
      (id) => id.toString() !== movieId
    );

    await user.save();

    res.json({ msg: "Removed from watchlist" });
  } catch (err) {
    console.error("Watchlist REMOVE error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
