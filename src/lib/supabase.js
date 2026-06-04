import { createClient } from "@supabase/supabase-js";

// Vercel Serverless Function menggunakan process.env
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("DEBUG: Supabase URL atau Key kosong!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);