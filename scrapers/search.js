const cheerio = require("cheerio");

function scrapeSearchPage(html) {
  const $ = cheerio.load(html);

  const results = [];

  $("div.result-item article").each((i, el) => {
    const link = $(el).find("a").attr("href") || null;
    const title = $(el).find(".details .title a").text().trim() || null;
    const year = $(el).find(".meta .year").text().trim() || null;
    const description = $(el).find(".contenido p").text().trim() || null;
    const genre = $(el).find(".tvshows").text().trim() || null;
    const poster =
      $(el).find(".thumbnail img").attr("src") ||
      $(el).find(".thumbnail img").attr("data-src") ||
      null;

    // normalize link to get last segment if needed
    let id = null;
    if (link) {
      id = link.split("/").filter(Boolean).pop(); // e.g., 'saint-dorei-gakuen-2-id-01'
    }

    results.push({
      id,
      title,
      year,
      description,
      genre,
      poster,
      link,
    });
  });

  return results;
}

module.exports = scrapeSearchPage;
