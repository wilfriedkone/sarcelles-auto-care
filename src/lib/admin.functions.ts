import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type RequestStatus = "nouvelle" | "contactee" | "traitee" | "archivee";

export const listQuoteRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("quote_requests")
      .select(
        "id, reference, full_name, phone, email, service, vehicle, preferred_contact, message, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("listQuoteRequests failed", error);
      return { ok: false as const, requests: [] };
    }
    return { ok: true as const, requests: data ?? [] };
  });

export const updateQuoteStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; status: RequestStatus }) => {
    const allowed: RequestStatus[] = [
      "nouvelle",
      "contactee",
      "traitee",
      "archivee",
    ];
    if (!allowed.includes(data.status)) throw new Error("Statut invalide");
    if (!/^[0-9a-f-]{36}$/i.test(data.id)) throw new Error("Identifiant invalide");
    return data;
  })
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("quote_requests")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) {
      console.error("updateQuoteStatus failed", error);
      return { ok: false as const };
    }
    return { ok: true as const };
  });
