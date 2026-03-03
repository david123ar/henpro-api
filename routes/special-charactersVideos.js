const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeCharactersVideos = require("../scrapers/scrapeCharactersVideos");

const router = express.Router();

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const page = req.query.page || 1;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: "Characters slug is required"
      });
    }

    const url =
      page == 1
        ? `https://3dhentai.co/characters/${slug}/`
        : `https://3dhentai.co/characters/${slug}/page/${page}/`;

    const html = await fetchHTML(url);
    const data = scrapeCharactersVideos(html);

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