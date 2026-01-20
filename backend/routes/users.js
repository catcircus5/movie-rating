const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// RETURN FULL PROFILE OF LOGGED-IN USER
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.session.userId)
    .populate("watchlist");

  res.json({
    user,
    watchlist: user.watchlist
  });
});

router.get("/watchlist", async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ msg: "Not logged in" });

  const user = await User.findById(req.session.userId)
    .populate("watchlist"); 

  res.json(user.watchlist || []);
});

// PUBLIC PROFILE
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("watchlist");

  res.json(user);
});



module.exports = router;
