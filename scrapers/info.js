const cheerio = require("cheerio");

// Helper function to extract slug from URL
function extractSlug(url) {
  if (!url) return null;
  url = url.replace(/\/+$/, ""); // Remove trailing slash
  const parts = url.split("/");
  return parts[parts.length - 1];
}

function scrapeInfoPage(html) {
  const $ = cheerio.load(html);

  // 🎬 Basic Information
  const title =
    $(".data h1").text().trim() ||
    $('meta[itemprop="name"]').attr("content") ||
    null;

  const poster =
    $(".poster img").attr("data-src") ||
    $('meta[itemprop="image"]').attr("content") ||
    null;

  const censorship =
    $(".poster .buttonuncensured span").text().trim() || "cen"

  const date =
    $(".extra .date").text().trim() ||
    $('meta[itemprop="dateCreated"]').attr("content") ||
    null;

  const synopsis =
    $(".wp-content p").text().trim() ||
    $('meta[itemprop="description"]').attr("content") ||
    null;

  // 🎭 Genres
  const genres = [];
  $(".sgeneros a").each((i, el) => {
    const name = $(el).text().trim();
    const link = $(el).attr("href");
    const slug = extractSlug(link);
    if (name) genres.push({ name, link, slug });
  });

  // 🖼️ Gallery
  const gallery = [];
  $("#dt_galery a").each((i, el) => {
    const img = $(el).attr("href")?.replace("\n", "") || $(el).attr("data-src");
    if (img) gallery.push(img);
  });

  // 📺 Episodes
  const episodes = [];
  $("#episodes ul.episodios li").each((i, el) => {
    const epTitle = $(el).find(".episodiotitle a").text().trim() || null;
    const epLink = $(el).find(".episodiotitle a").attr("href") || null;
    const epSlug = extractSlug(epLink);
    const epDate = $(el).find(".episodiotitle .date").text().trim() || null;
    const epImage =
      $(el).find(".imagen img").attr("data-src") ||
      $(el).find(".imagen img").attr("src") ||
      null;

    episodes.push({
      title: epTitle,
      link: epLink,
      slug: epSlug,
      date: epDate,
      image: epImage,
    });
  });

  // 🧾 About Section
  const about = {};
  $(".custom_fields").each((i, el) => {
    const key = $(el).find(".variante").text().trim();
    const value = $(el).find(".valor").text().trim();
    if (key) about[key] = value;
  });

  // 🔁 Related Series
  const related = [];
  $(".srelacionados article a").each((i, el) => {
    const slug = $(el).attr("href") || null;
    const link = extractSlug(slug);
    const poster =
      $(el).find("img").attr("data-src") ||
      $(el).find("img").attr("src") ||
      null;
    const title = $(el).find("img").attr("alt") || null;
    if (link) related.push({ title, link, slug, poster });
  });

  // ✅ Return Final Object
  return {
    title,
    poster,
    censorship,
    date,
    synopsis,
    genres,
    gallery,
    episodes,
    about,
    related,
  };
}

module.exports = scrapeInfoPage;
