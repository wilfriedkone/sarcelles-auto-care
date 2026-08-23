import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Loader2, Phone } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactPreferences, primaryContact, seoServices } from "@/config/site";
import { quoteSchema } from "@/lib/quote-schema";
import { submitQuoteRequest } from "@/lib/quote.functions";

type Values = {
  fullName: string;
  phone: string;
  email: string;
  service: string;
  vehicle: string;
  preferredContact: string;
  message: string;
  consent: boolean;
};

const empty: Values = {
  fullName: "",
  phone: "",
  email: "",
  service: "",
  vehicle: "",
  preferredContact: "telephone",
  message: "",
  consent: false,
};

const turnstileConfigured = Boolean(
  import.meta.env["VITE_TURNSTILE_SITE_KEY"],
);

export function QuoteForm() {
  const submit = useServerFn(submitQuoteRequest);
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const parsed = quoteSchema.safeParse({
      ...values,
      company: honeypot.current?.value ?? "",
      startedAt: startedAt.current,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setFormError("Merci de corriger les champs indiqués.");
      toast.error("Formulaire incomplet");
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus("sending");

    try {
      const result = await submit({ data: parsed.data });
      if (result.ok) {
        setReference(result.reference);
        setStatus("idle");
        setValues(empty);
        toast.success("Demande envoyée");
      } else {
        setStatus("error");
        setFormError(result.error);
        toast.error("Envoi impossible");
      }
    } catch {
      setStatus("error");
      setFormError(
        "L'envoi a échoué. Vérifiez votre connexion puis réessayez, ou appelez le garage.",
      );
      toast.error("Envoi impossible");
    }
  }

  if (reference) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-primary/40 bg-card p-8 shadow-card"
      >
        <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-bold uppercase">
          Votre demande a bien été envoyée
        </h3>
        <p className="mt-2 text-muted-foreground">
          L'équipe DSK AUTO 95 vous recontactera rapidement.
        </p>
        <p className="mt-4 text-sm">
          Numéro de référence :{" "}
          <span className="font-mono font-bold text-primary">{reference}</span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <a href={`tel:${primaryContact.tel}`}>
              <Phone className="size-4" aria-hidden="true" />
              Appeler le garage
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setReference(null);
              startedAt.current = Date.now();
            }}
          >
            Nouvelle demande
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-xl border border-border bg-card p-6 shadow-card md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          id="fullName"
          label="Nom et prénom"
          required
          error={errors["fullName"]}
        >
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            maxLength={80}
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            aria-invalid={Boolean(errors["fullName"])}
          />
        </Field>

        <Field id="phone" label="Téléphone" error={errors["phone"]}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={30}
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={Boolean(errors["phone"])}
          />
        </Field>

        <Field id="email" label="E-mail" error={errors["email"]}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={160}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={Boolean(errors["email"])}
          />
        </Field>

        <Field id="service" label="Service demandé" error={errors["service"]}>
          <select
            id="service"
            name="service"
            value={values.service}
            onChange={(e) => set("service", e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Je ne sais pas encore</option>
            {seoServices.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="vehicle"
          label="Véhicule (marque, modèle, année) — facultatif"
          error={errors["vehicle"]}
        >
          <Input
            id="vehicle"
            name="vehicle"
            maxLength={120}
            placeholder="Ex. Renault Clio 2016"
            value={values.vehicle}
            onChange={(e) => set("vehicle", e.target.value)}
          />
        </Field>

        <Field id="preferredContact" label="Moyen de contact préféré">
          <select
            id="preferredContact"
            name="preferredContact"
            value={values.preferredContact}
            onChange={(e) => set("preferredContact", e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {contactPreferences.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field id="message" label="Votre demande" required error={errors["message"]}>
          <Textarea
            id="message"
            name="message"
            rows={5}
            maxLength={2000}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            aria-invalid={Boolean(errors["message"])}
            placeholder="Décrivez le symptôme, le voyant allumé ou l'intervention souhaitée."
          />
        </Field>
      </div>

      {/* Champ piège anti-robot : masqué aux utilisateurs et aux lecteurs d'écran */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Société</label>
        <input id="company" name="company" ref={honeypot} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          checked={values.consent}
          onChange={(e) => set("consent", e.target.checked)}
          aria-invalid={Boolean(errors["consent"])}
          className="mt-1 size-4 accent-[oklch(0.554_0.2306_29.23)]"
        />
        <Label htmlFor="consent" className="text-sm font-normal leading-relaxed">
          J'accepte que mes informations soient utilisées pour être recontacté
          au sujet de ma demande, conformément à la{" "}
          <Link to="/politique-confidentialite" className="text-primary underline">
            politique de confidentialité
          </Link>
          . <span className="text-primary">*</span>
        </Label>
      </div>
      {errors["consent"] ? (
        <p className="mt-1 text-sm text-destructive">{errors["consent"]}</p>
      ) : null}

      {!turnstileConfigured ? (
        <p className="mt-5 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          Protection anti-robot Cloudflare Turnstile : non configurée. Le
          formulaire fonctionne avec les contrôles internes (champ piège, délai
          minimum, limitation d'envois). Ajoutez les clés Turnstile pour
          l'activer.
        </p>
      ) : null}

      {formError ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive-foreground"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{formError}</span>
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Envoi en cours…
            </>
          ) : status === "error" ? (
            "Réessayer"
          ) : (
            "Envoyer ma demande"
          )}
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={`tel:${primaryContact.tel}`}>
            <Phone className="size-4" aria-hidden="true" />
            Appeler {primaryContact.name}
          </a>
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2 block text-sm">
        {label} {required ? <span className="text-primary">*</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
