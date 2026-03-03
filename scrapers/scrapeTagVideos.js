const cheerio = require("cheerio");

function scrapeTagVideos(html) {
  const $ = cheerio.load(html);

  const videos = [];

  $(".video-with-trailer").each((i, el) => {
    videos.push({
      title: $(el).find(".title").text().trim(),
      link: $(el).find("a.thumb").attr("href"),
      thumbnail:
        $(el).find("img").attr("src") ||
        $(el).find("img").attr("data-src"),
      duration: $(el).find(".duration").text().trim(),
      views: $(el).find(".views-number").text().trim(),
      rating: $(el).find(".rating").text().replace(/"/g, "").trim()
    });
  });

  // ======================
  // Pagination
  // ======================
  let totalPages = 1;

  $(".pagination .page-link").each((i, el) => {
    const pageNum = parseInt($(el).text().trim());
    if (!isNaN(pageNum) && pageNum > totalPages) {
      totalPages = pageNum;
    }
  });

  return {
    videos,
    pagination: {
      totalPages,
      totalItems: videos.length
    }
  };
}

module.exports = scrapeTagVideos;