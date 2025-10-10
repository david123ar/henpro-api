const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeWatchPage = require("../scrapers/watch");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const id = req.query.id;

    const url = `https://watchhentai.net/videos/${id}`;

    const html = await fetchHTML(url);
    const data = scrapeWatchPage(html);

    res.json({ success: true, total: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
