import dramas from "../data/dramas.json";

const SITE = "https://wow-drama24.page.dev";

function escapeXml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.google.com/schemas/sitemap-image/1.1">

${dramas
  .map((d) => {
    return `
  <url>
    <loc>${SITE}/drama/${d.slug}</loc>
    <image:image>
      <image:loc>${d.poster}</image:loc>
      <image:title>${escapeXml(d.title)}</image:title>
    </image:image>
  </url>`;
  })
  .join("")}

</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}