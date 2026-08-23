import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { ServiceIcon } from "@/components/site/icons";
import { AutoRepairJsonLd } from "@/components/site/JsonLd";
import { QuoteForm } from "@/components/site/QuoteForm";
import { primaryContact, seoServices, services, site } from "@/config/site";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug && s.seoPage);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Prestation introuvable | DSK AUTO 95 GARAGE" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { service } = loaderData;
    return {
      meta: [
        { title: service.metaTitle },
        { name: "description", content: service.metaDescription },
        { property: "og:title", content: service.metaTitle },
        { property: "og:description", content: service.metaDescription },
      ],
      links: [{ rel: "canonical", href: `/services/${service.slug}` }],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const others = seoServices.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <>
      <AutoRepairJsonLd />
      <Section className="bg-honeycomb">
        <nav aria-label="Fil d'ariane" className="mb-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Accueil
          </Link>{" "}
          /{" "}
          <Link to="/services" className="hover:text-foreground">
            Services
          </Link>{" "}
          / <span className="text-foreground">{service.title}</span>
        </nav>

        <ServiceIcon name={service.icon} className="size-10 text-primary" />
        <SectionHeading
          as="h1"
          eyebrow={`Garage à ${site.city}`}
          title={service.title}
          description={service.intro}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">
              Ce que comprend la prestation
            </h2>
            <ul className="mt-6 space-y-3">
              {service.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-display text-2xl font-bold uppercase">
              Où intervenons-nous ?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              L'atelier se situe au {site.address.full}. Nous recevons les
              véhicules des automobilistes de {site.areas.join(", ")}{" "}
              {site.areaNote}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{site.hoursLabel}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <a href={`tel:${primaryContact.tel}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  Appeler {primaryContact.name}
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">Demander un devis</Link>
              </Button>
            </div>

            <h2 className="mt-12 font-display text-2xl font-bold uppercase">
              Autres prestations
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="text-sm text-primary hover:underline"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <QuoteForm />
        </div>
      </Section>
    </>
  );
}
