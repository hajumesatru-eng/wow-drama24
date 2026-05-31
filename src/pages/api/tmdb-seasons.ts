import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.TMDB_BEARER_TOKEN}`,
        accept: "application/json",
      },
    }
  );

  const data = await res.json();

  return new Response(JSON.stringify({
    id: data.id,
    seasons: data.seasons
  }));
};