const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeTagVideos = require("../scrapers/scrapeTagVideos");

const router = express.Router();

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const page = req.query.page || 1;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: "Tag slug is required"
      });
    }

    const url =
      page == 1
        ? `https://3dhentai.co/tag/${slug}/`
        : `https://3dhentai.co/tag/${slug}/page/${page}/`;

    const html = await fetchHTML(url);
    const data = scrapeTagVideos(html);

    res.json({
      success: true,
      slug,
      page: Number(page),
      totalPages: data.pagination.totalPages,
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