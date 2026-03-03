const cheerio = require("cheerio");

function scrapeWatchPage(html, url) {
  const $ = cheerio.load(html);

  // ⭐ Poster
  const poster =
    $("center img").attr("data-src") ||
    $("center img").attr("src") ||
    null;

  // ⭐ Title
  const title = $("center img").attr("title") || null;

  // ⭐ Extract ALL onclick URLs
  const downloadQualities = {}; // { "720p": url, "480p": url }
  let watchUrl = null;

  $(".continuar button").each((i, el) => {
    const onclick = $(el).attr("onclick") || "";

    // Extract URL from inside any quotes
    const match = onclick.match(/=\s*['"]([^'"]+)['"]/);
    if (!match) return;

    const extracted = match[1];

    // ⭐ Download qualities (720p, 480p, etc.)
    if (extracted.includes("xupload.org/download")) {
      // Detect quality ( _720p , _480p )
      const qualityMatch = extracted.match(/_(\d+p)\.mp4/);
      const quality = qualityMatch ? qualityMatch[1] : "unknown";

      downloadQualities[quality] = extracted;
    }

    // ⭐ Watch page
    if (extracted.includes("/videos/")) {
      watchUrl = extracted;
    }
  });

  // ⭐ Episode extraction
  // example: my-mother-1_720p.mp4 → 1
  let episode = null;
  const anyDownload = Object.values(downloadQualities)[0];
  if (anyDownload) {
    const epMatch = anyDownload.match(/-(\d+)_/);
    if (epMatch) episode = epMatch[1];
  }

  // ⭐ Series slug extraction
  let seriesSlug = null;
  if (anyDownload) {
    const parts = anyDownload.split("/");
    seriesSlug = parts[parts.length - 2] || null;
  }

  // 🌟 SIDEBAR EXTRACTION (works only when sidebar exists)
  const popular = [];
  $("#popular article.w_item_b, #popular article.item").each((i, el) => {
    popular.push({
      id: $(el).attr("id") || null,
      title: $(el).find("h3").text().trim() || null,
      year: $(el).find(".year").text().trim() || null,
      link: ($(el).find("a").attr("href") || "")
        .replace("https://watchhentai.net/series/", "")
        .replace(/\/$/, "") || null,
      poster:
        $(el).find("img").attr("data-src") ||
        $(el).find("img").attr("src") ||
        null,
    });
  });

  const newest = [];
  $("#new article.w_item_b, #new article.item").each((i, el) => {
    newest.push({
      id: $(el).attr("id") || null,
      title: $(el).find("h3").text().trim() || null,
      year: $(el).find(".year").text().trim() || null,
      link: ($(el).find("a").attr("href") || "")
        .replace("https://watchhentai.net/series/", "")
        .replace(/\/$/, "") || null,
      poster:
        $(el).find("img").attr("data-src") ||
        $(el).find("img").attr("src") ||
        null,
    });
  });

  const genre_list = [];
  $("nav.genres ul.genres li").each((i, el) => {
    const link = $(el).find("a").attr("href") || null;
    genre_list.push({
      name: $(el).find("a").text().trim(),
      link,
      count: $(el).find("i").text().trim() || null,
      slug: link
        ? link.replace("https://watchhentai.net/genre/", "").replace("/", "")
        : null,
    });
  });

  const years = [];
  $("nav.releases ul.releases li").each((i, el) => {
    const link = $(el).find("a").attr("href") || null;
    years.push({
      year: $(el).find("a").text().trim(),
      link,
      slug: link
        ? link.replace("https://watchhentai.net/release/", "").replace("/", "")
        : null,
    });
  });

  return {
    poster,
    title,
    downloads: downloadQualities,   // ⭐ ALL qualities
    watchUrl,
    episode,
    seriesSlug,
    sidebar: {
      popular,
      newest,
      genre_list,
      years,
    },
  };
}

module.exports = scrapeWatchPage;
