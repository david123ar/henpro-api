const cheerio = require("cheerio");

function scrapeSingleVideo(html) {
  const $ = cheerio.load(html);

  // =========================
  // 🔹 Meta Data
  // =========================
  const title = $('meta[itemprop="name"]').attr("content") || null;
  const description =
    $('meta[itemprop="description"]').attr("content") || null;
  const durationISO =
    $('meta[itemprop="duration"]').attr("content") || null;
  const thumbnail =
    $('meta[itemprop="thumbnailUrl"]').attr("content") || null;
  const embedURL =
    $('meta[itemprop="embedURL"]').attr("content") || null;
  const uploadDate =
    $('meta[itemprop="uploadDate"]').attr("content") || null;

  // =========================
  // 🔹 Iframe
  // =========================
  const iframeSrc =
    $(".responsive-player iframe").attr("src") || null;

  // =========================
  // 🔹 Extract video filename
  // =========================
  let videoFile = null;
  if (embedURL) {
    const match = embedURL.match(/video=([^&]+)/);
    if (match) videoFile = match[1];
  }

  // =========================
  // 🔹 Custom Video URL
  // =========================
  const customVideoURL = videoFile
    ? `https://3dhq1.org/video/3d/${videoFile}`
    : null;

  // =========================
  // 🔹 Characters
  // =========================
  const characters = [];
  $("#video-actors a").each((i, el) => {
    characters.push({
      name: $(el).text().trim(),
      link: $(el).attr("href")
    });
  });

  // =========================
  // 🔹 Artist
  // =========================
  let artist = null;
  let artistLink = null;
  const artistElement = $("#video-cats a").first();
  if (artistElement.length) {
    artist = artistElement.text().trim();
    artistLink = artistElement.attr("href");
  }

  // =========================
  // 🔹 Tags
  // =========================
  const tags = [];
  $("#video-tags a").each((i, el) => {
    tags.push({
      name: $(el).text().trim(),
      link: $(el).attr("href")
    });
  });

  // =========================
  // 🔹 Related Videos
  // =========================
  const related = [];
  $(".related-videos .video-block").each((i, el) => {
    related.push({
      title: $(el).find(".title").text().trim(),
      link: $(el).find("a.thumb").attr("href"),
      thumbnail: $(el).find("img").attr("src"),
      duration: $(el).find(".duration").text().trim(),
      views: $(el).find(".views-number").text().trim(),
      rating: $(el).find(".rating").text().trim()
    });
  });

  return {
    title,
    description,
    durationISO,
    thumbnail,
    embedURL,
    iframeSrc,
    videoFile,
    customVideoURL,
    uploadDate,
    characters,
    artist,
    artistLink,
    tags,
    related
  };
}

module.exports = scrapeSingleVideo;