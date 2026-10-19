import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { AutoRepairJsonLd } from "@/components/site/JsonLd";
import { MapEmbed } from "@/components/site/MapEmbed";
import { primaryContact, site } from "@/config/site";

export const Route = createFileRoute("/zone-intervention")({
  head: () => ({
    meta: [
      { title: "Zone d'intervention : Sarcelles et 95 | DSK AUTO 95 GARAGE" },
      {
        name: "description",
        content:
          "Garage à Sarcelles au service des automobilistes de Garges-lès-Gonesse, Villiers-le-Bel, Saint-Brice-sous-Forêt, Écouen et alentours.",
      },
      {
        property: "og:title",
        content: "Zone d'intervention : Sarcelles et le Val-d'Oise",
      },
      {
        property: "og:description",
        content:
          "DSK AUTO 95 GARAGE accueille les véhicules de Sarcelles et des communes voisines du 95.",
      },
    ],
    links: [{ rel: "canonical", href: `${site.url}/zone-intervention` }],
  }),
  component: ZonePage,
});

function ZonePage() {
  return (
    <>
      <AutoRepairJsonLd />
      <Section className="bg-honeycomb">
        <SectionHeading
          as="h1"
          eyebrow="Proximité"
          title="Zone d'intervention du garage"
          description={`L'atelier se situe au ${site.address.full}. Nous accueillons les véhicules des automobilistes des communes suivantes ${site.areaNote}`}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <ul className="grid gap-3 sm:grid-cols-2">
            {site.areas.map((area) => (
              <li
                key={area}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm"
              >
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {area}
              </li>
            ))}
          </ul>

          <MapEmbed className="h-80" />
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/contact">Demander un devis</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={`tel:${primaryContact.tel}`}>
              <Phone className="size-4" aria-hidden="true" />
              Appeler {primaryContact.name}
            </a>
          </Button>
        </div>
      </Section>
    </>
  );
}
