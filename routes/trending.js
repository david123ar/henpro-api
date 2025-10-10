const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeTrendingpage = require("../scrapers/trending");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Get ?page=N from query (default = 1)
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const url = page > 1 
      ? `https://watchhentai.net/trending/page/${page}/`
      : "https://watchhentai.net/trending";

    const html = await fetchHTML(url);
    const data = scrapeTrendingpage(html);

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
