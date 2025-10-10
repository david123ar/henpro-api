const express = require("express");
const fetchHTML = require("../utils/fetchHTML");
const scrapeHomepage = require("../scrapers/homepage");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url = "https://watchhentai.net"; // homepage
    const html = await fetchHTML(url);
    const data = scrapeHomepage(html);
    res.json({ success: true, total: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
