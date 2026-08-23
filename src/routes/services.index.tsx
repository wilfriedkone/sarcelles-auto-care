import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { ServiceIcon } from "@/components/site/icons";
import { AutoRepairJsonLd } from "@/components/site/JsonLd";
import { primaryContact, seoServices } from "@/config/site";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services d'un garage auto à Sarcelles | DSK AUTO 95 GARAGE" },
      {
        name: "description",
        content:
          "Mécanique, diagnostic électronique, pannes électriques, codage ECU, clés, entretien, climatisation et pré-contrôle technique à Sarcelles (95).",
      },
      {
        property: "og:title",
        content: "Services d'un garage auto à Sarcelles | DSK AUTO 95",
      },
      {
        property: "og:description",
        content:
          "Toutes les prestations du garage DSK AUTO 95 à Sarcelles : entretien, diagnostic, électronique, clés, achat et vente.",
      },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <AutoRepairJsonLd />
      <Section className="bg-honeycomb">
        <SectionHeading
          as="h1"
          eyebrow="Prestations"
          title="Nos services à Sarcelles"
          description="Le garage intervient en multimarque sur l'entretien courant, la réparation mécanique et les interventions électroniques. Chaque prestation fait l'objet d'un échange et d'un devis avant intervention."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {seoServices.map((service) => (
            <article
              key={service.slug}
              className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <ServiceIcon name={service.icon} className="size-8 text-primary" />
              <h2 className="mt-4 font-display text-xl font-bold uppercase">
                {service.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.short}
              </p>
              <Link
                to="/services/$slug"
                params={{ slug: service.slug }}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Détail de la prestation
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/contact">Demander un devis</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
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
