import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

/**
 * Photos publiées de la galerie, lues avec la clé publique (règles RLS :
 * seules les photos publiées sont visibles). Liste vide en cas d'erreur,
 * l'accueil affiche alors les photos par défaut.
 */
export const listPublishedPhotos = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return [];

  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Les clés "sb_publishable_" ne sont pas des JWT : apikey uniquement.
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });

  const { data, error } = await client
    .from("gallery_photos")
    .select("id, storage_path, alt, position, published, width, height")
    .eq("published", true)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(24);
  if (error) {
    console.error("listPublishedPhotos failed", error.message);
    return [];
  }
  return data ?? [];
});
