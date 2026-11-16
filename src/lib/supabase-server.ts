import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zgylvcwzwfqmligweato.supabase.co";
const defaultAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpneWx2Y3d6d2ZxbWxpZ3dlYXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NjUxOTEsImV4cCI6MjEwMDE0MTE5MX0.H2wW5Y2y3rUnJFqH7I65oZ4eiUqfcDiOAYVuzZTg5G0";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultAnonKey;

// Server-side Supabase client for storage and admin tasks
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseKey
);
