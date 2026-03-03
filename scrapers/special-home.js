const cheerio = require("cheerio");

module.exports = function scrapeSpecialHome(html) {
  const $ = cheerio.load(html);

  const videos = [];

  $(".video-block").each((i, el) => {
    const element = $(el);

    const link = element.find("a.thumb").attr("href") || null;
    const thumbnail =
      element.find("img.video-img").attr("data-src") ||
      element.find("img.video-img").attr("src") ||
      null;

    const duration = element.find(".duration").text().trim() || null;

    const title =
      element.find("a.infos").attr("title") ||
      element.find("a.infos").text().trim() ||
      null;

    const views = element.find(".views-number").text().trim() || null;

    const rating = element.find(".rating").text().trim() || null;

    videos.push({
      title,
      link,
      thumbnail,
      duration,
      views,
      rating
    });
  });

  // -------- Pagination --------
  let totalPages = 1;
  let currentPage = 1;
  let nextPage = null;

  $(".pagination .page-item").each((i, el) => {
    const item = $(el);

    if (item.hasClass("active")) {
      currentPage = Number(item.text().trim());
    }

    const pageLink = item.find("a.page-link").attr("href");
    if (pageLink) {
      const match = pageLink.match(/page\/(\d+)/);
      if (match) {
        const pageNum = Number(match[1]);
        if (pageNum > totalPages) totalPages = pageNum;
      }
    }

    if (item.find("a.next").length) {
      nextPage = item.find("a.next").attr("href");
    }
  });

  return {
    videos,
    pagination: {
      currentPage,
      totalPages,
      nextPage
    }
  };
};