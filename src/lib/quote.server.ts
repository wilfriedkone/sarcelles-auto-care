/**
 * Helpers serveur pour les demandes de devis.
 * Ce fichier ne doit jamais être importé depuis un composant.
 */

export function normalizePhone(value: string): string {
  const cleaned = value.replace(/[^\d+]/g, "");
  return cleaned.slice(0, 20);
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase().slice(0, 160);
}

export function collapse(value: string, max: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Référence publique non séquentielle, ex. DSK-7K2M-9QX4 */
export function buildReference(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]);
  return `DSK-${chars.slice(0, 4).join("")}-${chars.slice(4).join("")}`;
}

export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`dsk95:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Vérification Turnstile — active uniquement si la clé secrète est configurée. */
export async function verifyTurnstile(token: string | undefined) {
  const secret = process.env["TURNSTILE_SECRET_KEY"];
  if (!secret) return { configured: false, ok: true };
  if (!token) return { configured: true, ok: false };
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token }),
      },
    );
    const json = (await res.json()) as { success?: boolean };
    return { configured: true, ok: json.success === true };
  } catch {
    return { configured: true, ok: false };
  }
}

/** Notification e-mail optionnelle via Resend (activée si RESEND_API_KEY existe). */
export async function notifyByEmail(params: {
  reference: string;
  fullName: string;
  phone: string;
  email: string;
  service: string;
  vehicle: string;
  message: string;
}) {
  const apiKey = process.env["RESEND_API_KEY"];
  const to = process.env["ADMIN_NOTIFICATION_EMAIL"];
  const lovableKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey || !to || !lovableKey) return { sent: false };

  try {
    const res = await fetch(
      "https://connector-gateway.lovable.dev/resend/emails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": apiKey,
        },
        body: JSON.stringify({
          from: "DSK AUTO 95 <onboarding@resend.dev>",
          to: [to],
          subject: `Nouvelle demande ${params.reference}`,
          html: `<h2>Nouvelle demande — ${params.reference}</h2>
<ul>
<li><strong>Nom :</strong> ${escapeHtml(params.fullName)}</li>
<li><strong>Téléphone :</strong> ${escapeHtml(params.phone || "—")}</li>
<li><strong>E-mail :</strong> ${escapeHtml(params.email || "—")}</li>
<li><strong>Service :</strong> ${escapeHtml(params.service || "—")}</li>
<li><strong>Véhicule :</strong> ${escapeHtml(params.vehicle || "—")}</li>
</ul>
<p>${escapeHtml(params.message).replace(/\n/g, "<br/>")}</p>`,
        }),
      },
    );
    if (!res.ok) {
      console.error(
        `Resend gateway error [${res.status}]: ${await res.text()}`,
      );
      return { sent: false };
    }
    return { sent: true };
  } catch (error) {
    console.error("Resend notification failed", error);
    return { sent: false };
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
