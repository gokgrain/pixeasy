export function GET() {
  return new Response("User-agent: *\nAllow: /\n\nSitemap: https://www.pixeasytools.com/sitemap.xml\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
