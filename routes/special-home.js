const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeSpecialHome = require("../scrapers/special-home");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;

    const url =
      page == 1
        ? `https://3dhentai.co/`
        : `https://3dhentai.co/page/${page}`;

    const html = await fetchHTML(url);
    const data = scrapeSpecialHome(html);

    res.json({
      success: true,
      page: Number(page),
      totalPages: data.pagination.totalPages,
      totalItems: data.videos.length,
      data: data.videos,
      pagination: data.pagination
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;