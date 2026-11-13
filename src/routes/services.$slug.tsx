import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertCircle, Check, MapPin, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { ServiceIcon } from "@/components/site/icons";
import {
  AutoRepairJsonLd,
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/site/JsonLd";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QuoteForm } from "@/components/site/QuoteForm";
import { primaryContact, seoServices, services, site, steps } from "@/config/site";
import { cityPages, servicesContent } from "@/config/services-content";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug && s.seoPage);
    if (!service) throw notFound();
    return { service, content: servicesContent[service.slug] ?? { signs: [], faq: [] } };
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
      links: [{ rel: "canonical", href: `${site.url}/services/${service.slug}` }],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service, content } = Route.useLoaderData();
  const others = seoServices.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <>
      <AutoRepairJsonLd />
      <ServiceJsonLd
        name={service.title}
        description={service.metaDescription}
        path={`/services/${service.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
      />
      <FaqJsonLd items={content.faq} />
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
            {content.signs.length > 0 ? (
              <>
                <h2 className="font-display text-2xl font-bold uppercase">
                  Quand venir au garage ?
                </h2>
                <ul className="mt-6 mb-12 space-y-3">
                  {content.signs.map((sign) => (
                    <li key={sign} className="flex gap-3 text-[15px] text-foreground/85">
                      <AlertCircle className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                      {sign}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <h2 className="font-display text-2xl font-bold uppercase">
              Ce que comprend la prestation
            </h2>
            <ul className="mt-6 space-y-3">
              {service.points.map((point) => (
                <li key={point} className="flex gap-3 text-[15px] text-foreground/85">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-display text-2xl font-bold uppercase">
              Comment ça se passe ?
            </h2>
            <ol className="mt-6 space-y-4">
              {steps.map((step) => (
                <li key={step.title}>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                </li>
              ))}
            </ol>

            <h2 className="mt-12 font-display text-2xl font-bold uppercase">
              Où se trouve le garage ?
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">
              L'atelier se situe au {site.address.full}. {site.hoursLabel}. Nous
              recevons les automobilistes de Sarcelles et des communes voisines :
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {cityPages.map((city) => (
                <li key={city.slug}>
                  <Link
                    to="/garage-auto/$ville"
                    params={{ ville: city.slug }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm hover:border-primary"
                  >
                    <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <a href={`tel:${primaryContact.tel}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  Appeler {primaryContact.name}
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer noopener">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">Demander un devis</Link>
              </Button>
            </div>

            {content.faq.length > 0 ? (
              <>
                <h2 className="mt-12 font-display text-2xl font-bold uppercase">
                  Questions fréquentes
                </h2>
                <Accordion type="single" collapsible className="mt-4">
                  {content.faq.map((item, index) => (
                    <AccordionItem key={item.q} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-base font-semibold">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            ) : null}

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
