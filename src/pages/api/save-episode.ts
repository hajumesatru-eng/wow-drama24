import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const tmdb_id = Number(body.tmdb_id);
    const drama_slug = body.drama_slug;

    if (!tmdb_id || !drama_slug) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "tmdb_id and drama_slug are required",
        }),
        { status: 400 }
      );
    }

    // 🔥 1. ambil detail TV show
    const tvRes = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdb_id}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.TMDB_BEARER_TOKEN}`,
        },
      }
    );

    const tvData = await tvRes.json();

    if (!tvData || !tvData.seasons) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid TMDB response",
        }),
        { status: 500 }
      );
    }

    const allEpisodes = [];

    // 🔥 2. loop seasons
    for (const season of tvData.seasons) {
      if (season.season_number === 0) continue; // skip specials

      const seasonRes = await fetch(
        `https://api.themoviedb.org/3/tv/${tmdb_id}/season/${season.season_number}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.TMDB_BEARER_TOKEN}`,
          },
        }
      );

      const seasonData = await seasonRes.json();

      if (!seasonData || !seasonData.episodes) continue;

      // 🔥 3. loop episodes
      for (const ep of seasonData.episodes) {
        allEpisodes.push({
  drama_slug,

  season_number: season.season_number,

  episode_number: ep.episode_number,

  video_url:
    `https://vidlink.pro/tv/${tmdb_id}/${season.season_number}/${ep.episode_number}`,
});
      }
    }

    if (allEpisodes.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No episodes found",
        }),
        { status: 404 }
      );
    }

    // 🔥 4. HAPUS DUPLICATE EPISODE (IMPORTANT FIX)
    const { error: deleteError } = await supabase
      .from("episodes")
      .delete()
      .eq("drama_slug", drama_slug);

    if (deleteError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: deleteError.message,
        }),
        { status: 400 }
      );
    }

    // 🔥 5. INSERT EPISODES
    const { error } = await supabase
      .from("episodes")
      .insert(allEpisodes);

    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: allEpisodes.length,
      })
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
};