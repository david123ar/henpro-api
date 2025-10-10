const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeVideospage = require("../scrapers/episodes");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Get ?page=N from query (default = 1)
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const url = page > 1 
      ? `https://watchhentai.net/videos/page/${page}/`
      : "https://watchhentai.net/videos";

    const html = await fetchHTML(url);
    const data = scrapeVideospage(html);

    res.json({
      success: true,
      currentPage: data.pagination.currentPage,
      totalPages: data.pagination.totalPages,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
