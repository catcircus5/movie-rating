const fs = require("fs");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");

// CHANGE THIS if your sql file is elsewhere
const SQL_FILE = __dirname + "/../data/TMDbTrendingMovies.sql";

// Connect to MongoDB
async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017/moviedb");
  console.log("MongoDB connected");
}

// Extract SQL INSERT lines
function parseSqlFile() {
  const sql = fs.readFileSync(SQL_FILE, "utf8");

  // Match lines like:
  // INSERT INTO movies (...) VALUES (...);
  const matches = sql.match(/INSERT INTO.*?VALUES\s*\((.*?)\);/gis);

  if (!matches) {
    console.log("No INSERT statements found.");
    return [];
  }

  const movies = matches.map(line => {
    const inside = line.match(/\((.*)\)/s)[1];

    // Split values by comma but preserve commas inside quotes
    let parts = inside.split(/,(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/).map(s => s.trim());

    // Example SQL order (you must confirm your SQL matches this):
    // (tmdbId, title, overview, poster, releaseDate)

    const [tmdbId, title, overview, poster, releaseDate] = parts.map(v =>
      v.replace(/^'(.*)'$/, "$1") // remove surrounding quotes
    );

    return {
      tmdbId,
      title,
      overview,
      poster,
      releaseDate
    };
  });

  return movies;
}

// Import into MongoDB
async function importMovies() {
  await connectDB();

  const movies = parseSqlFile();
  console.log("Parsed", movies.length, "movies");

  for (let m of movies) {
    await Movie.create({
      tmdbId: m.tmdbId,
      title: m.title,
      overview: m.overview,
      poster_path: m.poster,
      release_date: m.releaseDate,
    });
  }

  console.log("Import complete.");
  process.exit();
}

importMovies();
