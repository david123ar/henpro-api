
async function fetchHTML(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
    }
  });
  if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
  return response.text();
}

module.exports = fetchHTML;
