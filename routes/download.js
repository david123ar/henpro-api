const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeWatchPage = require("../scrapers/download");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const id = req.query.id;

    const url = `https://watchhentai.net/download/${id}`;

    const html = await fetchHTML(url);
    const data = scrapeWatchPage(html);

    res.json({ success: true, total: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
