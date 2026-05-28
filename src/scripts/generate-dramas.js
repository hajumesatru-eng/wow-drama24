import fs from "fs";
import axios from "axios";
import path from "path";

const API_KEY = "cda8a5bf545e003b6b438326945b8415";

const dramas = [
  "Pursuit of Jade",
  "A Splendid Match",
  "The Heir",
  "Fate Chooses You",
  "Zhan Zhao Adventures",
  "Love Like the Galaxy",
  "The Princess Royal"
];

// CATEGORY MAP (FIXED)
function mapCategory(country) {
  switch (country) {
    case "KR": return "series-korea";
    case "CN": return "doo-free-24";
    case "JP": return "japan-series";
    case "TH": return "the-series-th";
    default: return "the-series-all";
  }
}

async function fetchDrama(title) {
  try {
    const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;

    const res = await axios.get(searchUrl);
    const item = res.data.results?.[0];

    if (!item) return null;

    const detailRes = await axios.get(
      `https://api.themoviedb.org/3/tv/${item.id}?api_key=${API_KEY}`
    );

    const detail = detailRes.data;

    const country = detail.origin_country?.[0] || "UN";
    const category = mapCategory(country);

    const episodesCount = detail.number_of_episodes || 12;

    const episodes = Array.from({ length: episodesCount }, (_, i) => {
      const ep = i + 1;

      return {
        number: ep,
        title: `Episode ${ep}`,
        url: `https://vidlink.pro/tv/${item.id}/${ep}`
      };
    });

    return {
      title: item.name || title,
      title_th: item.original_name || title,

      tmdb_id: item.id,
      year: Number(detail.first_air_date?.split("-")[0]) || new Date().getFullYear(),

      category,

      slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${item.id}`,

      poster: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "https://via.placeholder.com/500x750",

      backdrop: item.backdrop_path
        ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
        : "https://via.placeholder.com/1280x720",

      overview: item.overview || "No description",

      episodes,

      servers: {
        backup: `https://vidlink.pro/tv/${item.id}/`
      }
    };

  } catch (err) {
    console.log("ERROR:", title);
    return null;
  }
}

async function run() {
  const results = [];

  for (const title of dramas) {
    const data = await fetchDrama(title);
    if (data) results.push(data);

    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync(
    path.resolve("src/data/dramas.json"),
    JSON.stringify(results, null, 2),
    "utf-8"
  );

  console.log("DONE: CLEAN PIPELINE READY");
}

run();