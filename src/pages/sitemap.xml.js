import dramas from "../data/dramas.json";

const SITE = "https://wow-drama24.pages.dev";

export async function GET() {
  const items = dramas.slice(0, 50);

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Wow-Drama24</title>
  <link>${SITE}</link>
  <description>Latest Drama Updates</description>

  ${items
    .map(
      (d) => `
    <item>
      <title>${d.title}</title>
      <link>${SITE}/drama/${d.slug}</link>
      <description>${d.overview || d.title}</description>
    </item>
  `
    )
    .join("")}

</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
