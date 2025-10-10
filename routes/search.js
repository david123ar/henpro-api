const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeSearchPage = require("../scrapers/search");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a search query (?q=...)" });
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `https://watchhentai.net/?s=${encodedQuery}`;

    const html = await fetchHTML(url);
    const data = scrapeSearchPage(html);

    res.json({ success: true, total: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
