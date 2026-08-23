import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

import { quoteSchema, MAX as MAXLEN, type QuoteInput } from "./quote-schema";
import {
  buildReference,
  collapse,
  hashIp,
  normalizeEmail,
  normalizePhone,
  notifyByEmail,
  verifyTurnstile,
} from "./quote.server";

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((data: QuoteInput & { turnstileToken?: string }) => data)
  .handler(async ({ data }) => {
    const parsed = quoteSchema.safeParse(data);
    if (!parsed.success) {
      return {
        ok: false as const,
        error: "Certaines informations sont invalides ou incomplètes.",
      };
    }
    const values = parsed.data;

    // Anti-spam : honeypot + délai minimum de remplissage
    if (values.company) return { ok: true as const, reference: buildReference() };
    if (values.startedAt > 0 && Date.now() - values.startedAt < 3000) {
      return {
        ok: false as const,
        error: "Envoi trop rapide. Merci de réessayer dans quelques secondes.",
      };
    }

    const turnstile = await verifyTurnstile(data.turnstileToken);
    if (turnstile.configured && !turnstile.ok) {
      return {
        ok: false as const,
        error: "La vérification anti-robot a échoué. Merci de réessayer.",
      };
    }

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    let ipHash: string | null = null;
    try {
      const ip = getRequestIP({ xForwardedFor: true });
      if (ip) ipHash = await hashIp(ip);
    } catch {
      ipHash = null;
    }

    // Limitation simple : 3 demandes / 15 min par origine
    if (ipHash) {
      const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { count } = await supabaseAdmin
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .eq("source_ip_hash", ipHash)
        .gte("created_at", since);
      if ((count ?? 0) >= 3) {
        return {
          ok: false as const,
          error:
            "Trop de demandes envoyées récemment. Merci de nous appeler directement.",
        };
      }
    }

    const reference = buildReference();
    const record = {
      reference,
      full_name: collapse(values.fullName, MAXLEN.name),
      phone: values.phone ? normalizePhone(values.phone) : null,
      email: values.email ? normalizeEmail(values.email) : null,
      service: values.service ? collapse(values.service, MAXLEN.service) : null,
      vehicle: values.vehicle ? collapse(values.vehicle, MAXLEN.vehicle) : null,
      preferred_contact: values.preferredContact,
      message: values.message.slice(0, MAXLEN.message),
      consent: true,
      source_ip_hash: ipHash,
    };

    const { error } = await supabaseAdmin.from("quote_requests").insert(record);
    if (error) {
      console.error("quote_requests insert failed", error);
      return {
        ok: false as const,
        error: "L'envoi a échoué. Merci de réessayer ou de nous appeler.",
      };
    }

    await notifyByEmail({
      reference,
      fullName: record.full_name,
      phone: record.phone ?? "",
      email: record.email ?? "",
      service: record.service ?? "",
      vehicle: record.vehicle ?? "",
      message: record.message,
    });

    return { ok: true as const, reference };
  });
