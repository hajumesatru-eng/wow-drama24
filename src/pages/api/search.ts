import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();

  if (!q) {
    return new Response(
      JSON.stringify([]),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  const { data, error } = await supabase
    .from("dramas")
    .select(`
      slug,
      title,
      title_th,
      poster
    `)
    .or(`title.ilike.%${q}%,title_th.ilike.%${q}%`)
    .limit(8);

  if (error) {
    return new Response(
      JSON.stringify([]),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  return new Response(
    JSON.stringify(data || []),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};