import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  getConsent,
  onOpenConsentPreferences,
  saveConsent,
  useConsent,
  type ConsentCategories,
} from "@/lib/consent";

/**
 * Bannière de consentement : s'affiche tant qu'aucun choix n'est enregistré,
 * et se rouvre via le lien "Gestion des cookies" du pied de page.
 */
export function CookieBanner() {
  const consent = useConsent();
  const [mounted, setMounted] = useState(false);
  const [forcedOpen, setForcedOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [draft, setDraft] = useState<ConsentCategories>({
    analytics: false,
    maps: false,
  });

  useEffect(() => {
    setMounted(true);
    return onOpenConsentPreferences(() => {
      const current = getConsent();
      setDraft({
        analytics: current?.analytics ?? false,
        maps: current?.maps ?? false,
      });
      setShowDetails(true);
      setForcedOpen(true);
    });
  }, []);

  if (!mounted || (consent && !forcedOpen)) return null;

  const decide = (choice: ConsentCategories) => {
    saveConsent(choice);
    setForcedOpen(false);
    setShowDetails(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <h2 id="cookie-title" className="font-display text-lg font-bold uppercase">
              Vos choix sur les cookies
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Avec votre accord, nous utilisons Google Analytics pour mesurer la
              fréquentation du site et Google Maps pour afficher la carte. Vous
              pouvez changer d'avis à tout moment via « Gestion des cookies » en
              bas de page.{" "}
              <Link
                to="/politique-confidentialite"
                className="underline underline-offset-2 hover:text-foreground"
              >
                En savoir plus
              </Link>
            </p>
          </div>
        </div>

        {showDetails ? (
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            <ConsentRow
              id="consent-essential"
              label="Strictement nécessaires"
              description="Mémorisation de vos choix et fonctionnement du formulaire. Toujours actifs."
              checked
              disabled
            />
            <ConsentRow
              id="consent-analytics"
              label="Mesure d'audience (Google Analytics)"
              description="Statistiques de visite anonymisées pour améliorer le site."
              checked={draft.analytics}
              onChange={(v) => setDraft((d) => ({ ...d, analytics: v }))}
            />
            <ConsentRow
              id="consent-maps"
              label="Carte Google Maps"
              description="Affichage de la carte interactive ; Google peut déposer ses propres cookies."
              checked={draft.maps}
              onChange={(v) => setDraft((d) => ({ ...d, maps: v }))}
            />
          </div>
        ) : null}

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {showDetails ? (
            <Button variant="outline" onClick={() => decide(draft)}>
              Enregistrer mes choix
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setShowDetails(true)}>
              Personnaliser
            </Button>
          )}
          <Button variant="outline" onClick={() => decide({ analytics: false, maps: false })}>
            Tout refuser
          </Button>
          <Button onClick={() => decide({ analytics: true, maps: true })}>
            Tout accepter
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConsentRow(props: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Label htmlFor={props.id} className="text-sm font-semibold">
          {props.label}
        </Label>
        <p className="text-xs text-muted-foreground">{props.description}</p>
      </div>
      <Switch
        id={props.id}
        checked={props.checked}
        disabled={props.disabled}
        onCheckedChange={props.onChange}
      />
    </div>
  );
}
