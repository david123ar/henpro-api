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
const downloadRoute = require("./routes/download");
const specialHomeRoute = require("./routes/special-home");
const specialWatchRoute = require("./routes/special-watch");
const specialTagRoute = require("./routes/special-tag");
const specialTagVideosRoute = require("./routes/special-tagVideos");
const specialArtistRoute = require("./routes/special-artist.js");
const specialArtistVideosRoute = require("./routes/special-artistVideos");
const specialCharactersRoute = require("./routes/special-characters");
const specialCharactersVideosRoute = require("./routes/special-charactersVideos");
const specialSearchRoute = require("./routes/special-search");

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
app.use("/api/download", downloadRoute);
app.use("/api/special-home", specialHomeRoute);
app.use("/api/special-watch", specialWatchRoute);
app.use("/api/special-tag", specialTagRoute);
app.use("/api/special-tagVideos", specialTagVideosRoute);
app.use("/api/special-artist", specialArtistRoute);
app.use("/api/special-artistVideos", specialArtistVideosRoute);
app.use("/api/special-characters", specialCharactersRoute);
app.use("/api/special-charactersVideos", specialCharactersVideosRoute);
app.use("/api/special-search", specialSearchRoute);

app.listen(PORT, () =>
  console.log(`Scraper API running on http://localhost:${PORT}`),
);
