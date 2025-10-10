const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeSeriespage = require("../scrapers/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Get ?page=N from query (default = 1)
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const genre = req.query.genre;
    const url =
      page > 1
        ? `https://watchhentai.net/genre/${genre}/page/${page}/`
        : `https://watchhentai.net/genre/${genre}`;

    const html = await fetchHTML(url);
    const data = scrapeSeriespage(html);

    res.json({
      success: true,
      currentPage: data.pagination.currentPage,
      totalPages: data.pagination.totalPages,
      totalSeries: data.series.length,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
