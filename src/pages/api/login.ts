import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email, password } = await request.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return new Response(
      JSON.stringify({ error: error?.message || "Login gagal" }),
      { status: 401 }
    );
  }

  const isProd = import.meta.env.PROD;

  // 🔐 ACCESS TOKEN
  cookies.set("sb-access-token", data.session.access_token, {
    path: "/",
    httpOnly: true,
    secure: isProd, // penting: false di local, true di production
    sameSite: "strict",
    maxAge: 60 * 60 * 2, // 2 jam
  });

  // 🔐 REFRESH TOKEN (optional tapi bagus)
  cookies.set("sb-refresh-token", data.session.refresh_token, {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });

  return new Response(
    JSON.stringify({
      message: "Login sukses",
      user: data.user,
    }),
    { status: 200 }
  );
};