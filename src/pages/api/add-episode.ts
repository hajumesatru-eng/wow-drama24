import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID wajib diisi" }),
        { status: 400 }
      );
    }

    // ambil data dulu
    const { data: drama } = await supabase
      .from("dramas")
      .select("episodes")
      .eq("id", id)
      .single();

    if (!drama) {
      return new Response(
        JSON.stringify({ error: "Drama tidak ditemukan" }),
        { status: 404 }
      );
    }

    // tambah 1 episode
    const newEpisode = (drama.episodes || 0) + 1;

    const { data, error } = await supabase
      .from("dramas")
      .update({ episodes: newEpisode })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Episode berhasil ditambah",
        data,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
};