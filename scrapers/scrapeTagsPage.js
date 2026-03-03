const cheerio = require("cheerio");

function scrapeTagsPage(html) {
  const $ = cheerio.load(html);

  const tags = [];

  $(".video-block-cat").each((i, el) => {
    const title = $(el).find(".title").text().trim();
    const link = $(el).find("a.thumb").attr("href");
    const thumbnail =
      $(el).find("img").attr("src") ||
      $(el).find("img").attr("data-src");

    const countText = $(el)
      .find(".video-datas")
      .text()
      .trim();

    const countMatch = countText.match(/\d+/);
    const totalVideos = countMatch ? Number(countMatch[0]) : 0;

    const slug = link ? link.split("/tag/")[1]?.replace("/", "") : null;

    tags.push({
      title,
      slug,
      link,
      thumbnail,
      totalVideos
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
    tags,
    pagination: {
      totalPages
    }
  };
}

module.exports = scrapeTagsPage;