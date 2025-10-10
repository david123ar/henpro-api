const cheerio = require("cheerio");

function scrapeTrendingpage(html) {
  const $ = cheerio.load(html);

  // ✅ Extract genres
  // const genres = [];
  // $(".by-genre ul li a").each((i, el) => {
  //   genres.push({
  //     name: $(el).text().trim(),
  //     slug:
  //       $(el).attr("href")?.replace("/series/", "").replace("/", "") || null,
  //     link: $(el).attr("href") || null,
  //   });
  // });

  // // ✅ Extract years
  // const years = [];
  // $(".by-year ul li a").each((i, el) => {
  //   years.push({
  //     year: $(el).text().trim(),
  //     slug:
  //       $(el).attr("href")?.replace("/series/", "").replace("/", "") || null,
  //     link: $(el).attr("href") || null,
  //   });
  // });

  // ✅ Extract series items
  const series = [];
  $("article.item.tvshows").each((i, el) => {
    const id = $(el).attr("id") || null;
    const year = $(el).find(".buttonyear span").text().trim() || null;
    const censored = $(el).find(".buttoncensured span").text().trim() || null;
    const uncensored =
      $(el).find(".buttonuncensured span").text().trim() || null;
    const poster =
      $(el).find(".poster img").attr("data-src") ||
      $(el).find(".poster img").attr("src") ||
      null;
    const title = $(el).find(".data h3 a").text().trim() || null;
    const linkRaw = $(el).find(".data h3 a").attr("href") || null;
    const link = linkRaw
      ? linkRaw
          .replace("https://watchhentai.net/series/", "")
          .replace(/\/$/, "")
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
  const genres = [];
  $("nav.genres ul.genres li").each((i, el) => {
    const name = $(el).find("a").text().trim();
    const link = $(el).find("a").attr("href") || null;
    const count = $(el).find("i").text().trim() || null;
    const slug = link
      ? link.replace("https://watchhentai.net/genre/", "").replace("/", "")
      : null;

    genres.push({ name, slug, link, count });
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

  // ✅ Extract total series count
  //   const totalSeriesText =
  //     $("header:contains('Recently added') span").text().trim() || null; // e.g., 'Recently added 1,396'
  //   const totalSeriesMatch = totalSeriesText.match(/Recently added ([\d,]+)/i);
  let totalSeriesText =
    $("header:contains('Recently added') span").text().trim() || "0";

  // Remove commas and convert to integer
  const totalSeries = parseInt(totalSeriesText.replace(/,/g, ""), 10);

  // ✅ Extract pagination info
  const paginationText = $(".pagination span").first().text().trim(); // e.g., 'Page 1 of 47'
  const totalPagesMatch = paginationText.match(/Page \d+ of (\d+)/i);
  const totalPages = totalPagesMatch
    ? parseInt(totalPagesMatch[1], 10)
    : totalSeries && series.length
    ? Math.ceil(totalSeries / series.length)
    : null;

  const currentPageMatch = paginationText.match(/Page (\d+)/i);
  const currentPage = currentPageMatch ? parseInt(currentPageMatch[1], 10) : 1;

  return {
    genres,
    years,
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

module.exports = scrapeTrendingpage;
