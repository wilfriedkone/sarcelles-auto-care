import { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";

import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { getConsent, saveConsent, useConsent } from "@/lib/consent";
import { cn } from "@/lib/utils";

/**
 * Carte Google Maps chargée seulement après consentement :
 * aucun appel à Google tant que le visiteur n'a pas accepté.
 */
export function MapEmbed({ className }: { className?: string }) {
  const consent = useConsent();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const allowed = mounted && Boolean(consent?.maps);

  if (allowed) {
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <iframe
          src={site.mapsEmbedUrl}
          title={`Localisation de ${site.name} à Sarcelles`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={cn("w-full", className)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-honeycomb flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-border p-6 text-center",
        className,
      )}
    >
      <MapPin className="size-8 text-primary" aria-hidden="true" />
      <p className="font-semibold">{site.address.full}</p>
      <p className="max-w-sm text-xs text-muted-foreground">
        La carte est fournie par Google, qui peut déposer des cookies. Elle ne
        s'affiche qu'avec votre accord.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          size="sm"
          onClick={() =>
            saveConsent({ analytics: getConsent()?.analytics ?? false, maps: true })
          }
        >
          Afficher la carte
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={site.mapsUrl} target="_blank" rel="noreferrer noopener">
            <Navigation aria-hidden="true" />
            Itinéraire
          </a>
        </Button>
      </div>
    </div>
  );
}
