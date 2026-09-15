import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client, using the project's SECRET key (bypasses RLS).
 * NEVER import this into client components — the secret key must stay server-side.
 * Lazily initialised so a missing env var doesn't crash `next build` (the API route
 * that uses it is force-dynamic and only runs at request time).
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured (SUPABASE_URL / SUPABASE_SECRET_KEY missing)");
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
