const cheerio = require("cheerio");

function scrapeVideospage(html) {
  const $ = cheerio.load(html);

  // ✅ Extract episodes (recent uploads list)
  const recentEpisodes = [];
  $("div.animation-2.items article.item.se.episodes").each((i, el) => {
    const poster =
      $(el).find(".poster img").attr("data-src") ||
      $(el).find(".poster img").attr("src") ||
      null;

    const rawLabel = $(el).find(".buttonextra span").text().trim() || null;
    const censoredLabel =
      $(el).find(".buttoncensured span").text().trim() || null;

    let videoLink = $(el).find(".season_m a").attr("href") || null;
    if (videoLink) {
      videoLink = videoLink.split("/").filter(Boolean).pop();
    }

    const seriesName = $(el).find(".serie").text().trim() || null;
    const episodeTitle = $(el).find("h3").text().trim() || null;
    const uploadTime =
      $(el).find(".videotext div:first-child").text().trim() || null;

    recentEpisodes.push({
      poster,
      rawLabel,
      censoredLabel,
      link: videoLink,
      seriesName,
      episodeTitle,
      uploadTime,
    });
  });

  // ✅ Extract series items (search / main list)
  const series = [];
  $("article.item.tvshows").each((i, el) => {
    const id = $(el).attr("id") || null;
    const year = $(el).find(".buttonyear span").text().trim() || null;
    const censored = $(el).find(".buttoncensured span").text().trim() || null;
    const uncensored = $(el).find(".buttonuncensured span").text().trim() || null;

    const poster =
      $(el).find(".poster img").attr("data-src") ||
      $(el).find(".poster img").attr("src") ||
      null;

    const title = $(el).find(".data h3 a").text().trim() || null;
    const linkRaw = $(el).find(".data h3 a").attr("href") || null;
    const link = linkRaw
      ? linkRaw.replace("https://watchhentai.net/series/", "").replace(/\/$/, "")
      : null;

    series.push({
      id,
      year,
      label: censored || uncensored || null,
      poster,
      title,
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
      ? linkRaw.replace("https://watchhentai.net/series/", "").replace(/\/$/, "")
      : null;
    const poster =
      $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || null;

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
      ? linkRaw.replace("https://watchhentai.net/series/", "").replace(/\/$/, "")
      : null;
    const poster =
      $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || null;

    newest.push({ id, title, year, link, poster });
  });

  // ✅ Sidebar: genres
  const genres = [];
  $("nav.genres ul.genres li").each((i, el) => {
    const name = $(el).find("a").text().trim();
    const link = $(el).find("a").attr("href") || null;
    const count = $(el).find("i").text().trim() || null;
    const slug = link ? link.replace("https://watchhentai.net/genre/", "").replace("/", "") : null;

    genres.push({ name, slug, link, count });
  });

  // ✅ Sidebar: release years
  const years = [];
  $("nav.releases ul.releases li").each((i, el) => {
    const year = $(el).find("a").text().trim();
    const link = $(el).find("a").attr("href") || null;
    const slug = link ? link.replace("https://watchhentai.net/release/", "").replace("/", "") : null;

    years.push({ year, slug, link });
  });

  // ✅ Total count (if present in header)
  let totalSeriesText =
    $("header:contains('Recently added') span").text().trim() || "0";
  const totalSeries = parseInt(totalSeriesText.replace(/,/g, ""), 10);

  // ✅ Pagination info
  const paginationText = $(".pagination span").first().text().trim();
  const totalPagesMatch = paginationText.match(/Page \d+ of (\d+)/i);
  const totalPages = totalPagesMatch
    ? parseInt(totalPagesMatch[1], 10)
    : totalSeries && series.length
    ? Math.ceil(totalSeries / series.length)
    : null;

  const currentPageMatch = paginationText.match(/Page (\d+)/i);
  const currentPage = currentPageMatch ? parseInt(currentPageMatch[1], 10) : 1;

  return {
    recentEpisodes,
    series,
    sidebar: {
      popular,
      newest,
      genres,
      years,
    },
    pagination: {
      currentPage,
      totalPages,
      totalSeries,
    },
  };
}

module.exports = scrapeVideospage;
