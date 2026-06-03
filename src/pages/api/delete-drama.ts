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

    const { error } = await supabase
      .from("dramas")
      .delete()
      .eq("id", id);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Drama berhasil dihapus" }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
  
};
