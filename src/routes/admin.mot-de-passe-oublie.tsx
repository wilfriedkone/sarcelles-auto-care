import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AuthCard } from "@/components/admin/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/mot-de-passe-oublie")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Mot de passe oublié | Espace garage DSK AUTO 95" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/nouveau-mot-de-passe`,
    });
    setLoading(false);
    // Même message que le compte existe ou non : on ne révèle pas les adresses inscrites.
    if (resetError && resetError.status !== 400) {
      setError("Envoi impossible pour le moment. Réessayez dans quelques minutes.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      intro={sent ? undefined : "Indiquez votre e-mail : vous recevrez un lien pour choisir un nouveau mot de passe."}
    >
      {sent ? (
        <div role="status" className="text-center">
          <MailCheck className="mx-auto size-10 text-primary" aria-hidden="true" />
          <p className="mt-3 text-sm">
            Si un compte existe pour <strong>{email.trim()}</strong>, un e-mail vient d'être envoyé.
            Pensez à regarder dans les spams.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={loading || !email.trim()}>
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Recevoir le lien
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm">
        <Link to="/admin/login" className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </AuthCard>
  );
}
