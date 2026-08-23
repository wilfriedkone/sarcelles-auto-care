import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Connexion administration | DSK AUTO 95 GARAGE" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Accès réservé à l'équipe du garage." },
      { property: "og:title", content: "Connexion administration" },
      { property: "og:description", content: "Accès réservé." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setLoading(false);
      setError("Identifiants invalides.");
      return;
    }
    await navigate({ to: "/admin/demandes", replace: true });
  }

  return (
    <main className="bg-honeycomb flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-card">
        <h1 className="font-display text-2xl font-bold uppercase">
          Administration
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Accès réservé à l'équipe DSK AUTO 95. Aucune inscription publique.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <div>
            <Label htmlFor="email" className="mb-2 block">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-2 block">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Connexion…
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
