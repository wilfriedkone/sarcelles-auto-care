import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/site/Section";
import { AutoRepairJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/site/JsonLd";
import { MapEmbed } from "@/components/site/MapEmbed";
import { CallbackForm } from "@/components/site/CallbackForm";
import { primaryContact, seoServices, site } from "@/config/site";
import { cityPages, deVille } from "@/config/services-content";

export const Route = createFileRoute("/garage-auto/$ville")({
  loader: ({ params }) => {
    const city = cityPages.find((c) => c.slug === params.ville);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Page introuvable | DSK AUTO 95 GARAGE" }, { name: "robots", content: "noindex" }] };
    }
    const { city } = loaderData;
    const title = `Garage automobile près ${deVille(city.name)} | DSK AUTO 95 GARAGE`;
    const description = `Garage multimarque à Sarcelles, tout près ${deVille(city.name)} : mécanique, diagnostic électronique, entretien, freins, clés. Devis avant intervention. Appelez le 07 59 04 48 39.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
      links: [{ rel: "canonical", href: `${site.url}/garage-auto/${city.slug}` }],
    };
  },
  component: CityPage,
});

function cityFaq(name: string) {
  return [
    {
      q: `Le garage est-il loin ${deVille(name)} ?`,
      a: `Non. L'atelier se trouve au ${site.address.full}, dans une commune voisine ${deVille(name)}. Le bouton « Itinéraire » calcule le trajet depuis chez vous.`,
    },
    {
      q: "Quels sont vos horaires ?",
      a: `${site.hoursLabel}. Appelez avant de passer pour vérifier les disponibilités de l'atelier.`,
    },
    {
      q: "Faut-il prendre rendez-vous ?",
      a: `C'est conseillé. Appelez ${primaryContact.name} au ${primaryContact.phone} ou envoyez une demande de devis : nous vous proposons un créneau.`,
    },
  ];
}

function CityPage() {
  const { city } = Route.useLoaderData();
  const faq = cityFaq(city.name);
  const directions = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    `${city.name}, France`,
  )}&destination=${encodeURIComponent(site.address.full)}`;
  const otherCities = cityPages.filter((c) => c.slug !== city.slug);

  return (
    <>
      <AutoRepairJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Zone d'intervention", path: "/zone-intervention" },
          { name: `Garage près ${deVille(city.name)}`, path: `/garage-auto/${city.slug}` },
        ]}
      />
      <FaqJsonLd items={faq} />

      <Section className="bg-honeycomb">
        <nav aria-label="Fil d'Ariane" className="mb-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Accueil</Link> /{" "}
          <Link to="/zone-intervention" className="hover:text-foreground">Zone d'intervention</Link> /{" "}
          <span className="text-foreground">{city.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading
              as="h1"
              eyebrow={`${city.name} et alentours`}
              title={`Garage automobile près ${deVille(city.name)}`}
              description={city.intro}
            />
            <ul className="mt-8 space-y-3">
              {[
                "Atelier multimarque, du simple entretien aux pannes électroniques",
                "Diagnostic expliqué clairement et devis avant toute intervention",
                site.hoursLabel,
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[15px] text-foreground/85">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={`tel:${primaryContact.tel}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  Appeler {primaryContact.name}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer noopener">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={directions} target="_blank" rel="noreferrer noopener">
                  <Navigation className="size-4" aria-hidden="true" />
                  Itinéraire depuis {city.name}
                </a>
              </Button>
            </div>
          </div>
          <CallbackForm />
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-bold uppercase md:text-4xl">
          Nos prestations pour les automobilistes {deVille(city.name)}
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {seoServices.map((service) => (
            <li key={service.slug}>
              <Link
                to="/services/$slug"
                params={{ slug: service.slug }}
                className="group flex min-h-16 items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 font-semibold transition-colors hover:border-primary"
              >
                {service.title}
                <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-y border-border bg-card">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold uppercase md:text-4xl">Venir au garage</h2>
            <p className="mt-4 flex gap-3 text-[15px] text-foreground/85">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              {site.address.full}
            </p>
            <h2 className="mt-12 text-3xl font-bold uppercase md:text-4xl">Questions fréquentes</h2>
            <Accordion type="single" collapsible className="mt-4">
              {faq.map((item, index) => (
                <AccordionItem key={item.q} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-base font-semibold">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <MapEmbed className="h-80" />
        </div>
      </Section>

      <Section>
        <p className="text-sm text-muted-foreground">
          Nous accueillons aussi les automobilistes de{" "}
          {otherCities.map((c, i) => (
            <span key={c.slug}>
              <Link to="/garage-auto/$ville" params={{ ville: c.slug }} className="text-foreground underline-offset-2 hover:underline">
                {c.name}
              </Link>
              {i < otherCities.length - 1 ? ", " : ""}
            </span>
          ))}{" "}
          et de Sarcelles.
        </p>
      </Section>
    </>
  );
}
