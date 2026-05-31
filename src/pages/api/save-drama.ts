import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body.title) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Title is required"
        }),
        { status: 400 }
      );
    }

    // 🔥 CLEAN GENRE
    const genre = Array.isArray(body.genre)
      ? body.genre
      : typeof body.genre === "string"
        ? body.genre.split(",").map((g: string) => g.trim())
        : [];

    // 🔥 CEK DUPLICATE TMDB ID
    if (body.tmdb_id) {
      const { data: existing } = await supabase
        .from("dramas")
        .select("id")
        .eq("tmdb_id", body.tmdb_id)
        .single();

      if (existing && !body.id) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Drama already exists (TMDB duplicate)"
          }),
          { status: 409 }
        );
      }
    }

    // 🔥 DATA PAYLOAD
    const payload = {
      slug: body.slug,
      title: body.title,
      title_th: body.title_th || null,
      year: body.year || null,
      poster: body.poster || null,
      backdrop: body.backdrop || null,
      overview: body.overview || null,
      overview_th: body.overview_th || null,
      genre,
      category: body.category || "tmdb",
      status: body.status || "ongoing",
      tmdb_id: body.tmdb_id || null,
      original_language: body.original_language || null
    };

    let result;

    // 🔥 UPDATE MODE
    if (body.id) {
      const { data, error } = await supabase
        .from("dramas")
        .update(payload)
        .eq("id", body.id)
        .select();

      if (error) throw error;
      result = data;
    }

    // 🔥 INSERT MODE
    else {
      const { data, error } = await supabase
        .from("dramas")
        .insert([payload])
        .select();

      if (error) throw error;
      result = data;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error"
      }),
      { status: 500 }
    );
  }
};