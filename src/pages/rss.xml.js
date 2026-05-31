import { supabase } from "../lib/supabase.js";

const SITE = "https://wow-drama24.pages.dev";

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
    .select(`
      title,
      slug,
      overview,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return new Response("RSS Error", {
      status: 500,
    });
  }

  const items = dramas || [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>

<title>Wow-Drama24</title>

<link>${SITE}</link>

<description>Latest Drama Updates</description>

<language>th-TH</language>

<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>

${items
  .map((drama) => {
    const title = escapeXml(drama.title || "");
    const description = escapeXml(
      drama.overview || drama.title || ""
    );

    const link = `${SITE}/drama/${drama.slug}`;

    const pubDate = drama.created_at
      ? new Date(drama.created_at).toUTCString()
      : new Date().toUTCString();

    return `
<item>
<title>${title}</title>
<link>${link}</link>
<guid>${link}</guid>
<description>${description}</description>
<pubDate>${pubDate}</pubDate>
</item>`;
  })
  .join("\n")}

</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=UTF-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}