const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ username, email, password: hashed });

  res.json({ msg: "Registered" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ msg: "Wrong password" });

  req.session.userId = user._id;

  res.json({
    msg: "Logged in",
    username: user.username,
    id: user._id
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ msg: "Logged out" });
});

// CHECK SESSION
router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Not logged in" });
  }

  const user = await User.findById(req.session.userId);

  res.json({
    id: user._id,
    username: user.username
  });
});

module.exports = router;
