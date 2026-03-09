const cheerio = require("cheerio");

function scrapeSearchPage(html) {
  const $ = cheerio.load(html);

  const videos = [];

  $(".video-block").each((i, el) => {
    const title = $(el).find(".title").text().trim();

    const pageUrl = $(el).find("a.thumb").attr("href");

    const thumbnail =
      $(el).find("img.video-img").attr("src") ||
      $(el).find("img.video-img").attr("data-src");

    const duration = $(el).find(".duration").text().trim();

    const views = $(el).find(".views-number").text().trim();

    videos.push({
      title,
      url: pageUrl,
      thumbnail,
      duration,
      views
    });
  });

  /* -------- TOTAL RESULTS -------- */

  let totalResults = 0;

  const headerText = $(".widget-title").text();
  const match = headerText.match(/(\d+)/);

  if (match) totalResults = Number(match[1]);

  /* -------- PAGINATION -------- */

  const pages = [];

  let currentPage = 1;
  let totalPages = 1;
  let nextPage = null;
  let prevPage = null;

  $(".pagination .page-item").each((i, el) => {
    const pageText = $(el).text().trim();
    const link = $(el).find("a").attr("href");

    if ($(el).hasClass("active")) {
      currentPage = Number(pageText);

      pages.push({
        page: currentPage,
        current: true
      });
    }

    if ($(el).find("a.page-link").length && !isNaN(pageText)) {
      const pageNum = Number(pageText);

      pages.push({
        page: pageNum,
        url: link,
        current: false
      });

      if (pageNum > totalPages) totalPages = pageNum;
    }

    if ($(el).find("a.next").length) {
      nextPage = link;
    }
  });

  prevPage = currentPage > 1 ? currentPage - 1 : null;

  return {
    totalResults,
    pagination: {
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      pages
    },
    videos
  };
}

module.exports = scrapeSearchPage;