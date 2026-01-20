require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDb = require("./config/db");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.use(
  session({
    secret: "supersecret123",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

connectDb(process.env.MONGO_URI || "mongodb://localhost:27017/moviedb");

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/watchlist", require("./routes/watchlist"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/movies", require("./routes/movies"));
app.use("/api/reviews", require("./routes/reviews"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
