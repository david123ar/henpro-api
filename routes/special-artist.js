const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeArtistPage = require("../scrapers/scrapeArtistPage");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;

    const url =
      page == 1
        ? "https://3dhentai.co/artist/"
        : `https://3dhentai.co/artist/page/${page}/`;

    const html = await fetchHTML(url);
    const data = scrapeArtistPage(html);

    res.json({
      success: true,
      page: Number(page),
      totalPages: data.pagination.totalPages,
      totalItems: data.artist.length,
      data: data.artist
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;