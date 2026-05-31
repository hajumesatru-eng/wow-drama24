import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const { drama_slug, tmdb_id } = body;

    // ambil info TV
    const tvRes = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdb_id}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.TMDB_BEARER_TOKEN}`,
          accept: "application/json"
        }
      }
    );

    const tvData = await tvRes.json();

    const totalSeasons = tvData.number_of_seasons || 1;

    const rows = [];

    for (let season = 1; season <= totalSeasons; season++) {

      const seasonRes = await fetch(
        `https://api.themoviedb.org/3/tv/${tmdb_id}/season/${season}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.TMDB_BEARER_TOKEN}`,
            accept: "application/json"
          }
        }
      );

      const seasonData = await seasonRes.json();

      for (const ep of seasonData.episodes || []) {

        const episode_number = ep.episode_number;

        rows.push({
          drama_slug,
          season_number: season,
          episode_number,
          video_url: `https://vidlink.pro/tv/${tmdb_id}/${season}/${episode_number}`
        });

      }
    }

    // anti duplicate
    const { data: existing } = await supabase
      .from("episodes")
      .select("season_number, episode_number")
      .eq("drama_slug", drama_slug);

    const filtered = rows.filter((row) => {
      return !existing?.some(
        (e) =>
          e.season_number === row.season_number &&
          e.episode_number === row.episode_number
      );
    });

    if (filtered.length > 0) {
      await supabase
        .from("episodes")
        .insert(filtered);
    }

    return new Response(
      JSON.stringify({
        success: true,
        inserted: filtered.length
      })
    );

  } catch (err) {

    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error
          ? err.message
          : "Unknown error"
      }),
      { status: 500 }
    );

  }
};