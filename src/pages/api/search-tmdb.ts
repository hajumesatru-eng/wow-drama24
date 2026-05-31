import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Query required"
      }),
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.TMDB_BEARER_TOKEN}`,
          accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "TMDB API error"
        }),
        { status: 500 }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        results: data?.results ?? []
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