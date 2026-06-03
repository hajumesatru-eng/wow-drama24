import { supabase } from "../lib/supabase.js";

const SITE = "https://wowdrama24.is-cool.dev";

function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const { data: dramas, error } = await supabase
    .from("dramas")
    .select("slug,title,poster")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response("Supabase Error", {
      status: 500
    });
  }

  const validDramas =
    dramas?.filter(
      (d) =>
        d.slug &&
        d.title &&
        d.poster &&
        d.poster.startsWith("http")
    ) || [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${validDramas
  .map(
    (d) => `
<url>
  <loc>${SITE}/drama/${escapeXml(d.slug)}/</loc>

  <image:image>
    <image:loc>${escapeXml(d.poster)}</image:loc>
    <image:title>${escapeXml(d.title)}</image:title>
  </image:image>

</url>`
  )
  .join("\n")}

</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}