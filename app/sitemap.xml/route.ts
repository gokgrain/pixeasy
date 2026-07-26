const paths = ["", "/invert-image", "/grayscale-image", "/jpg-to-png", "/png-to-jpg", "/resize-image", "/about", "/privacy", "/terms"];

export function GET() {
  const urls = paths.map((path) => `<url><loc>https://www.pixeasytools.com${path || "/"}</loc><changefreq>${path === "" ? "weekly" : "monthly"}</changefreq><priority>${path === "" ? "1.0" : path.includes("image") || path.includes("-to-") ? "0.9" : "0.5"}</priority></url>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
