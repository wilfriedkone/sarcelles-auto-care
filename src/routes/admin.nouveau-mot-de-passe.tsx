import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AuthCard } from "@/components/admin/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/nouveau-mot-de-passe")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Nouveau mot de passe | Espace garage DSK AUTO 95" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NewPassword,
});

const MIN_LENGTH = 10;

function NewPassword() {
  const navigate = useNavigate();
  // Le lien reçu par e-mail ouvre une session temporaire de récupération.
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    const timer = window.setTimeout(() => setReady((r) => r ?? false), 4000);
    return () => {
      sub.subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    if (password.length < MIN_LENGTH) {
      setError(`Au moins ${MIN_LENGTH} caractères.`);
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError("Modification impossible. Le lien a peut-être expiré : redemandez-en un.");
      return;
    }
    toast.success("Mot de passe modifié");
    await navigate({ to: "/admin/demandes", replace: true });
  }

  if (ready === false) {
    return (
      <AuthCard title="Lien expiré" intro="Ce lien n'est plus valable. Demandez-en un nouveau.">
        <Button asChild size="lg" className="h-12 w-full text-base">
          <Link to="/admin/mot-de-passe-oublie">Recevoir un nouveau lien</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Nouveau mot de passe" intro={`Choisissez un mot de passe d'au moins ${MIN_LENGTH} caractères.`}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="new-password">Nouveau mot de passe</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 text-base"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm-password">Confirmer</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-12 text-base"
          />
        </div>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={loading || ready !== true}>
          {loading || ready === null ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Enregistrer
        </Button>
      </form>
    </AuthCard>
  );
}
