const cheerio = require("cheerio");

function scrapeHomepage(html) {
  const $ = cheerio.load(html);

  // ✅ Extract Recent Episodes
  const recentEpisodes = [];
  $("div.animation-2.items.full article.item.se.episodes").each((i, el) => {
    const poster = $(el).find(".poster img").attr("data-src") || null;
    const rawLabel = $(el).find(".buttonextra span").text().trim() || null;
    const censoredLabel =
      $(el).find(".buttoncensured span").text().trim() || null;
    let videoLink = $(el).find(".season_m a").attr("href") || null;

    // normalize link -> last part only
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

  // ✅ Extract TV Shows (id="dt-tvshows")
  const tvShows = [];
  $("#dt-tvshows article.item.tvshows").each((i, el) => {
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
    let link = $(el).find(".data h3 a").attr("href") || null;

    if (link) {
      link = link.split("/").filter(Boolean).pop();
    }

    tvShows.push({
      id,
      year,
      label: censored || uncensored || null,
      poster,
      title,
      link,
    });
  });

  // ✅ Extract Genre Sections (Uncensored, Harem, School-girls, etc.)
  const genres = {};
  $("div.list_genres.items").each((i, el) => {
    const blockId = $(el).attr("id") || `genre_${i}`;
    const series = [];

    $(el)
      .find("article.item.tvshows")
      .each((j, art) => {
        const id = $(art).attr("id") || null;
        const year = $(art).find(".buttonyear span").text().trim() || null;
        const censored =
          $(art).find(".buttoncensured span").text().trim() || null;
        const uncensored =
          $(art).find(".buttonuncensured span").text().trim() || null;
        const poster =
          $(art).find(".poster img").attr("data-src") ||
          $(art).find(".poster img").attr("src") ||
          null;
        const title = $(art).find(".data h3 a").text().trim() || null;
        let link = $(art).find(".data h3 a").attr("href") || null;

        if (link) {
          link = link.split("/").filter(Boolean).pop();
        }

        series.push({
          id,
          year,
          label: censored || uncensored || null,
          poster,
          title,
          link,
        });
      });

    genres[blockId] = series;
  });

  return {
    recentEpisodes, // structured "Recent Episodes"
    tvShows, // structured "TV Shows"
    genres, // structured Genre blocks (uncensored, harem, school-girls, etc.)
  };
}

module.exports = scrapeHomepage;
