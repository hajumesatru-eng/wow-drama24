import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const { id, video_url } = body;

    if (!id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Episode ID required"
        }),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("episodes")
      .update({
        video_url
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data
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
        error: err instanceof Error
          ? err.message
          : "Unknown error"
      }),
      { status: 500 }
    );
  }
};