import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { AutoRepairJsonLd } from "@/components/site/JsonLd";
import { QuoteForm } from "@/components/site/QuoteForm";
import { site } from "@/config/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & devis — Garage à Sarcelles | DSK AUTO 95 GARAGE" },
      {
        name: "description",
        content:
          "Contactez DSK AUTO 95 GARAGE à Sarcelles : adresse, téléphones, e-mail et formulaire de demande de devis pour votre véhicule.",
      },
      { property: "og:title", content: "Contact & devis — DSK AUTO 95 GARAGE" },
      {
        property: "og:description",
        content:
          "Adresse, téléphones et formulaire de devis du garage DSK AUTO 95 à Sarcelles (95).",
      },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <AutoRepairJsonLd />
      <Section className="bg-honeycomb">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Contacter le garage"
          description="Appelez-nous directement ou envoyez votre demande de devis : nous revenons vers vous rapidement pour préciser l'intervention."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <ul className="space-y-5 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <address className="not-italic">{site.address.full}</address>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <span>{site.hoursLabel}</span>
              </li>
              {site.contacts.map((c) => (
                <li key={c.tel} className="flex gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <a href={`tel:${c.tel}`} className="hover:text-primary">
                    {c.name} — {c.phone}
                  </a>
                </li>
              ))}
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="hover:text-primary">
                  {site.email}
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <Button asChild variant="outline">
                <a href={site.mapsUrl} target="_blank" rel="noreferrer noopener">
                  <Navigation className="size-4" aria-hidden="true" />
                  Ouvrir l'itinéraire Google Maps
                </a>
              </Button>
            </div>

            <div className="mt-8 overflow-hidden rounded-xl border border-border">
              <iframe
                src={site.mapsEmbedUrl}
                title={`Localisation de ${site.name} à Sarcelles`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full"
              />
            </div>
          </div>

          <QuoteForm />
        </div>
      </Section>
    </>
  );
}
