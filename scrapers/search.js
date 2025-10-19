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

  // ✅ Popular sidebar
  const popular = [];
  $("#popular article.w_item_b, #popular article.item").each((i, el) => {
    const id = $(el).attr("id") || null;
    const title = $(el).find("h3").text().trim() || null;
    const year = $(el).find(".year").text().trim() || null;
    const linkRaw = $(el).find("a").attr("href") || null;
    const link = linkRaw
      ? linkRaw
          .replace("https://watchhentai.net/series/", "")
          .replace(/\/$/, "")
      : null;
    const poster =
      $(el).find("img").attr("data-src") ||
      $(el).find("img").attr("src") ||
      null;

    popular.push({ id, title, year, link, poster });
  });

  // ✅ New sidebar
  const newest = [];
  $("#new article.w_item_b, #new article.item").each((i, el) => {
    const id = $(el).attr("id") || null;
    const title = $(el).find("h3").text().trim() || null;
    const year = $(el).find(".year").text().trim() || null;
    const linkRaw = $(el).find("a").attr("href") || null;
    const link = linkRaw
      ? linkRaw
          .replace("https://watchhentai.net/series/", "")
          .replace(/\/$/, "")
      : null;
    const poster =
      $(el).find("img").attr("data-src") ||
      $(el).find("img").attr("src") ||
      null;

    newest.push({ id, title, year, link, poster });
  });

  // ✅ Sidebar: genres
  const genre_list = [];
  $("nav.genres ul.genres li").each((i, el) => {
    const name = $(el).find("a").text().trim();
    const link = $(el).find("a").attr("href") || null;
    const count = $(el).find("i").text().trim() || null;
    const slug = link
      ? link.replace("https://watchhentai.net/genre/", "").replace("/", "")
      : null;

    genre_list.push({ name, slug, link, count });
  });

  // ✅ Sidebar: release years
  const years = [];
  $("nav.releases ul.releases li").each((i, el) => {
    const year = $(el).find("a").text().trim();
    const link = $(el).find("a").attr("href") || null;
    const slug = link
      ? link.replace("https://watchhentai.net/release/", "").replace("/", "")
      : null;

    years.push({ year, slug, link });
  });

  return {
    results,
    sidebar: {
      popular,
      newest,
      genre_list,
      years,
    },
  };
}

module.exports = scrapeSearchPage;
