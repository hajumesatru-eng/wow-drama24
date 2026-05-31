import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sjztqmpupmpkpfgverny.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqenRxbXB1cG1wa3BmZ3Zlcm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTc5MzcsImV4cCI6MjA5NTY5MzkzN30.gdlKdKXnbZu93RSbOivkTimy-ULHmbv6pofq-HmT_wA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);