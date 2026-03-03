const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeSpecialWatch = require("../scrapers/special-watch");

const router = express.Router();

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: "Video slug is required"
      });
    }

    const url = `https://3dhentai.co/${slug}/`;

    const html = await fetchHTML(url);
    const data = scrapeSpecialWatch(html);

    res.json({
      success: true,
      slug,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;