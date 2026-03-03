const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeTagsPage = require("../scrapers/scrapeTagsPage");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;

    const url =
      page == 1
        ? "https://3dhentai.co/tags/"
        : `https://3dhentai.co/tags/page/${page}/`;

    const html = await fetchHTML(url);
    const data = scrapeTagsPage(html);

    res.json({
      success: true,
      page: Number(page),
      totalPages: data.pagination.totalPages,
      totalItems: data.tags.length,
      data: data.tags
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;