import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { quoteSchema } from "@/lib/quote-schema";
import { submitQuoteRequest } from "@/lib/quote.functions";
import { cn } from "@/lib/utils";

const needs = [
  "Diagnostic / voyant allumé",
  "Entretien, vidange, freins",
  "Panne mécanique ou électrique",
  "Achat ou vente de véhicule",
  "Autre demande",
];

/**
 * "Devis express" de l'accueil : demande de rappel en 3 champs.
 * Passe par le même enregistrement que le formulaire de devis complet.
 */
export function CallbackForm({ className }: { className?: string }) {
  const submit = useServerFn(submitQuoteRequest);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [need, setNeed] = useState(needs[0]!);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    if (!phone.trim()) {
      setError("Indiquez votre téléphone pour être rappelé.");
      return;
    }
    const parsed = quoteSchema.safeParse({
      fullName,
      phone,
      email: "",
      service: need,
      vehicle: "",
      preferredContact: "telephone",
      message: `Demande de rappel depuis l'accueil — besoin : ${need}.`,
      consent,
      company: honeypot.current?.value ?? "",
      startedAt: startedAt.current,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Formulaire incomplet.");
      return;
    }

    setError(null);
    setSending(true);
    try {
      const result = await submit({ data: parsed.data });
      if (result.ok) setReference(result.reference);
      else setError(result.error);
    } catch {
      setError("L'envoi a échoué. Réessayez ou appelez le garage.");
    } finally {
      setSending(false);
    }
  }

  const cardClass = cn(
    "rounded-2xl border border-border bg-card/95 p-6 shadow-card backdrop-blur md:p-7",
    className,
  );

  if (reference) {
    return (
      <div role="status" aria-live="polite" className={cardClass}>
        <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
        <p className="mt-3 font-display text-2xl font-bold uppercase">C'est noté !</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Nous vous rappelons rapidement. Référence :{" "}
          <span className="font-mono font-bold text-foreground">{reference}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby="devis-express" className={cardClass}>
      <p id="devis-express" className="font-display text-2xl font-bold uppercase">
        Devis express
      </p>
      <p className="mt-1 text-sm text-muted-foreground">Laissez votre numéro, on vous rappelle.</p>

      <div className="mt-5 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="cb-name">Nom</Label>
          <Input
            id="cb-name"
            autoComplete="name"
            placeholder="Votre nom"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cb-phone">Téléphone</Label>
          <Input
            id="cb-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="06 00 00 00 00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cb-need">Besoin</Label>
          <select
            id="cb-need"
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {needs.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Champ piège anti-robots, invisible pour les humains */}
        <input
          ref={honeypot}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] size-px opacity-0"
        />

        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary)]"
          />
          <span>
            J'accepte d'être recontacté au sujet de ma demande (
            <Link to="/politique-confidentialite" className="underline underline-offset-2">
              confidentialité
            </Link>
            ).
          </span>
        </label>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={sending} className="shine h-12 w-full text-base">
          {sending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {sending ? "Envoi…" : "Être rappelé"}
        </Button>
      </div>
    </form>
  );
}
