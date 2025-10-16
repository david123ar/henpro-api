const cheerio = require("cheerio");
const { URL } = require("url");

// Helper to extract slug from any link
function extractSlug(link) {
  if (!link) return null;
  link = link.replace(/\/+$/, ""); // remove trailing slash
  return link.split("/").pop(); // get the last part
}

// Helper to get direct MP4 URL from iframe
function extractDirectVideoUrl(iframeSrc) {
  if (!iframeSrc) return null;
  try {
    const urlObj = new URL(iframeSrc);

    // Decode source
    const sourceParam = urlObj.searchParams.get("source");
    if (!sourceParam) return null;
    const decoded = decodeURIComponent(sourceParam);

    // Extract quality list (e.g., "480p,720p,1080p")
    const qualityParam = urlObj.searchParams.get("quality");
    let highestQuality = null;

    if (qualityParam) {
      const qualities = qualityParam
        .split(",")
        .map((q) => parseInt(q.replace("p", ""), 10))
        .filter((q) => !isNaN(q))
        .sort((a, b) => b - a); // descending

      if (qualities.length > 0) {
        highestQuality = `${qualities[0]}p`;
      }
    }

    // Build formatted URL using the highest quality available
    let formattedUrl = decoded;
    if (highestQuality) {
      // replace .mp4 with _{quality}.mp4 (like _1080p.mp4)
      formattedUrl = decoded.replace(/\.mp4$/, `_${highestQuality}.mp4`);
    }

    return formattedUrl;
  } catch (err) {
    return null;
  }
}

function scrapeWatchPage(html, url) {
  const $ = cheerio.load(html);

  const slug = extractSlug(url);

  const title =
    $('meta[itemprop="name"]').attr("content") ||
    $("#info h1").text().trim() ||
    null;

  const iframeSrc =
    $("#search_iframe").attr("src") ||
    $("iframe.metaframe").attr("src") ||
    null;

  // 🎬 Extract the highest-quality MP4 link
  const videoUrl = extractDirectVideoUrl(iframeSrc);

  const downloadLink = $(".download-video").attr("href") || null;

  const poster = $("#info .poster a img").attr("src") || null;

  const backdrop = $('meta[itemprop="thumbnailUrl"]').attr("content");

  const uploadDate = $('meta[itemprop="uploadDate"]').attr("content") || null;
  const duration = $('meta[itemprop="duration"]').attr("content") || null;

  let views = null;
  const viewMeta = $('meta[itemprop="userInteractionCount"]').attr("content");
  if (viewMeta) views = viewMeta.replace(/\D+/g, "");

  const description =
    $('meta[itemprop="description"]').attr("content") ||
    $("#info h3").text().trim() ||
    null;

  const genres = [];
  $("#info .sgeneros a").each((i, el) => {
    const name = $(el).text().trim();
    const link = $(el).attr("href");
    const id = extractSlug(link);
    if (name) genres.push({ name, link, id });
  });

  const seriesLink = $("#info .poster a").attr("href") || null;
  const seriesId = extractSlug(seriesLink);
  const synopsis = $("#info .synopsis p").text().trim() || null;

  const episodes = [];
  $("#seasons ul.episodios li").each((i, el) => {
    const title = $(el).find(".episodiotitle a").text().trim() || null;
    const link = $(el).find(".episodiotitle a").attr("href") || null;
    const id = extractSlug(link);
    const date = $(el).find(".date").text().trim() || null;
    const thumb =
      $(el).find("img").attr("data-src") ||
      $(el).find("img").attr("src") ||
      null;

    episodes.push({ title, link, id, date, thumb });
  });

  const related = [];
  $("#dt-episodes article.item.se.episodios").each((i, el) => {
    const title = $(el).find(".data h3").text().trim() || null;
    const series = $(el).find(".serie").text().trim() || null;
    const poster =
      $(el).find("img").attr("data-src") ||
      $(el).find("img").attr("src") ||
      null;
    const link = $(el).find(".season_m a").attr("href") || null;
    const id = extractSlug(link);
    const label =
      $(el).find(".buttonextra span").text().trim() ||
      $(el).find(".buttoncensured span").text().trim() ||
      null;
    const uploadTime =
      $(el).find(".videotext div:first-child").text().trim() || null;

    related.push({ title, series, link, id, poster, label, uploadTime });
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
    title,
    videoUrl, // ✅ Highest quality MP4 link (auto-selected)
    iframeSrc, // Original iframe URL
    downloadLink,
    poster,
    backdrop,
    uploadDate,
    duration,
    views,
    description,
    genres,
    seriesLink,
    seriesId,
    synopsis,
    episodes,
    related,
    sidebar: {
      popular,
      newest,
      genre_list,
      years,
    },
  };
}

module.exports = scrapeWatchPage;
