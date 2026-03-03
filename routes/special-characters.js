const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeCharactersPage = require("../scrapers/scrapeCharactersPage");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;

    const url =
      page == 1
        ? "https://3dhentai.co/characters/"
        : `https://3dhentai.co/characters/page/${page}/`;

    const html = await fetchHTML(url);
    const data = scrapeCharactersPage(html);

    res.json({
      success: true,
      page: Number(page),
      totalPages: data.pagination.totalPages,
      totalItems: data.characters.length,
      data: data.characters
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;