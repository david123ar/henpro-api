const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeSearchPage = require("../scrapers/scrapeSearchPage");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = req.query.q;
    const page = req.query.page || 1;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Missing search query"
      });
    }

    const url =
      page == 1
        ? `https://3dhentai.co/?s=${encodeURIComponent(query)}`
        : `https://3dhentai.co/page/${page}/?s=${encodeURIComponent(query)}`;

    const html = await fetchHTML(url);

    const data = scrapeSearchPage(html);

    res.json({
      success: true,
      query,
      page: Number(page),
      totalResults: data.totalResults,
      totalPages: data.pagination.totalPages,
      pagination: data.pagination,
      totalItems: data.videos.length,
      data: data.videos
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;