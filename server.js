const express = require("express");
const cors = require("cors");

// import routes
const homepageRoute = require("./routes/homepage");
const seriesRoute = require("./routes/series");
const trendingRoute = require("./routes/trending");
const episodeRoute = require("./routes/episodes");
const searchRoute = require("./routes/search");
const genreRoute = require("./routes/genre");
const yearRoute = require("./routes/year");
const watchRoute = require("./routes/watch");
const infoRoute = require("./routes/info");

const app = express();
const PORT = 3322;

app.use(cors());
app.use(express.json());

// mount routes
app.use("/api/homepage", homepageRoute);
app.use("/api/series", seriesRoute);
app.use("/api/trending", trendingRoute);
app.use("/api/episodes", episodeRoute);
app.use("/api/search", searchRoute);
app.use("/api/genre", genreRoute);
app.use("/api/year", yearRoute);
app.use("/api/watch", watchRoute);
app.use("/api/info", infoRoute);

app.listen(PORT, () =>
  console.log(`Scraper API running on http://localhost:${PORT}`)
);
