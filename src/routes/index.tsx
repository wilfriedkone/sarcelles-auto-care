import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Clock,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Timer,
  Wrench,
  MapPinned,
  ArrowRight,
} from "lucide-react";

import atelier from "@/assets/photo-atelier.jpg";
import mecanique from "@/assets/photo-mecanique.jpg";
import vente from "@/assets/photo-vente.jpg";
import diagnostic from "@/assets/photo-diagnostic.jpg";
import logo from "@/assets/dsk-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/site/Section";
import { ServiceIcon } from "@/components/site/icons";
import { AutoRepairJsonLd } from "@/components/site/JsonLd";
import { QuoteForm } from "@/components/site/QuoteForm";
import { MapEmbed } from "@/components/site/MapEmbed";
import { faq, primaryContact, seoServices, site, steps } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Garage automobile à Sarcelles (95) | DSK AUTO 95 GARAGE" },
      {
        name: "description",
        content:
          "DSK AUTO 95 GARAGE, garage automobile à Sarcelles : mécanique, diagnostic électronique multimarque, entretien, clés, achat et vente de véhicules.",
      },
      {
        property: "og:title",
        content: "Garage automobile à Sarcelles (95) | DSK AUTO 95 GARAGE",
      },
      {
        property: "og:description",
        content:
          "Mécanique, diagnostic multimarque, entretien et vente de véhicules à Sarcelles. Devis sur demande.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: `${site.url}/` }],
  }),
  component: Home,
});

const reassurance = [
  {
    icon: ShieldCheck,
    title: "Diagnostic multimarque",
    text: "Valise de diagnostic électronique pour cibler la panne avant d'intervenir.",
  },
  {
    icon: Timer,
    title: "Prise de contact rapide",
    text: "Un appel ou un formulaire suffit : nous revenons vers vous rapidement.",
  },
  {
    icon: Wrench,
    title: "Services complets",
    text: "De l'entretien courant au codage de calculateur, en passant par les clés.",
  },
  {
    icon: MapPinned,
    title: "Proximité",
    text: `Atelier à Sarcelles, au service des automobilistes du 95.`,
  },
];

function Home() {
  return (
    <>
      <AutoRepairJsonLd />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={atelier}
          alt="Atelier de réparation automobile avec véhicule sur pont élévateur"
          width={1600}
          height={1000}
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="max-w-3xl animate-rise">
            <img
              src={logo.url}
              alt={`Logo ${site.name}`}
              width={200}
              height={163}
              className="h-24 w-auto md:h-32"
            />
            <p className="mt-8 font-display text-sm font-bold uppercase tracking-[0.3em] text-primary">
              Achat · Vente · Réparation · Diagnostic
            </p>
            <h1 className="mt-3 text-4xl font-bold uppercase leading-[1.05] md:text-6xl">
              Garage automobile à Sarcelles
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              DSK AUTO 95 GARAGE prend en charge l'entretien, la réparation et
              le diagnostic électronique de votre véhicule, avec un devis avant
              intervention et des explications claires.
            </p>

            <ul className="mt-7 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-6">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {site.address.full}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-primary" aria-hidden="true" />
                {site.hoursLabel}
              </li>
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">Demander un devis</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href={`tel:${primaryContact.tel}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  Appeler {primaryContact.name}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={site.mapsUrl} target="_blank" rel="noreferrer noopener">
                  <Navigation className="size-4" aria-hidden="true" />
                  Itinéraire
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* RÉASSURANCE */}
      <section aria-label="Nos engagements" className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {reassurance.map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 className="font-display text-base font-bold uppercase">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <Section className="bg-honeycomb">
        <SectionHeading
          eyebrow="Nos prestations"
          title="Services du garage"
          description="Un atelier multimarque pour l'entretien courant comme pour les interventions électroniques les plus techniques."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {seoServices.map((service) => (
            <Link
              key={service.slug}
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/60"
            >
              <ServiceIcon name={service.icon} className="size-8 text-primary" />
              <h3 className="mt-4 font-display text-xl font-bold uppercase">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.short}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                En savoir plus
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* LE GARAGE */}
      <Section className="border-y border-border bg-card/30">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Le garage"
              title="Un atelier de proximité à Sarcelles"
              description="DSK AUTO 95 GARAGE accueille les automobilistes de Sarcelles et des communes alentours pour l'entretien, la réparation et le diagnostic. Nous privilégions une méthode simple : comprendre le problème, l'expliquer, puis proposer un devis avant d'intervenir."
            />
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li>• Interventions multimarques, du courant au technique</li>
              <li>• Devis avant intervention, sans engagement</li>
              <li>• Explication du diagnostic dans un langage clair</li>
              <li>• Achat et vente de véhicules sur demande</li>
            </ul>
            <div className="mt-8">
              <Button asChild variant="secondary">
                <Link to="/le-garage">Découvrir le garage</Link>
              </Button>
            </div>
          </div>
          {/* Photos temporaires — remplacez ces fichiers dans src/assets */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src={mecanique}
              alt="Mécanicien travaillant sur un moteur automobile"
              width={1200}
              height={900}
              loading="lazy"
              className="h-56 w-full rounded-xl object-cover shadow-card"
            />
            <img
              src={diagnostic}
              alt="Diagnostic électronique d'un véhicule avec un outil de lecture"
              width={1200}
              height={900}
              loading="lazy"
              className="mt-8 h-56 w-full rounded-xl object-cover shadow-card"
            />
          </div>
        </div>
      </Section>

      {/* ÉTAPES */}
      <Section>
        <SectionHeading
          eyebrow="Comment ça se passe"
          title="Quatre étapes simples"
        />
        <ol className="mt-12 grid gap-5 md:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.title}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <h3 className="font-display text-lg font-bold uppercase text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ACHAT / VENTE */}
      <Section className="border-y border-border bg-card/30">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img
            src={vente}
            alt="Véhicule d'occasion propre stationné devant un garage"
            width={1200}
            height={900}
            loading="lazy"
            className="h-72 w-full rounded-xl object-cover shadow-card"
          />
          <div>
            <SectionHeading
              eyebrow="Achat & vente"
              title="Vendre ou acheter un véhicule"
              description="Nous étudions l'achat de votre véhicule et vous informons des véhicules disponibles à la vente au moment de votre demande. Les disponibilités évoluent : contactez-nous pour connaître le stock du moment."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/contact">Proposer mon véhicule</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={`tel:${primaryContact.tel}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  {primaryContact.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ZONE */}
      <Section className="bg-honeycomb">
        <SectionHeading
          eyebrow="Zone d'intervention"
          title="Sarcelles et communes alentours"
          description={`Nous accueillons les automobilistes de ${site.areas.join(", ")} ${site.areaNote}`}
        />
        <div className="mt-10 flex flex-wrap gap-3">
          {site.areas.map((area) => (
            <span
              key={area}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
            >
              {area}
            </span>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="secondary">
            <Link to="/zone-intervention">Voir la zone détaillée</Link>
          </Button>
        </div>
      </Section>

      {/* CONTACT + FORMULAIRE */}
      <Section id="devis" className="border-t border-border bg-card/30">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Demander un devis"
              description="Décrivez votre besoin : nous revenons vers vous pour préciser l'intervention et convenir d'un passage à l'atelier."
            />
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <address className="not-italic text-muted-foreground">
                  {site.address.full}
                </address>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-muted-foreground">{site.hoursLabel}</span>
              </li>
              {site.contacts.map((c) => (
                <li key={c.tel} className="flex gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <a href={`tel:${c.tel}`} className="text-muted-foreground hover:text-foreground">
                    {c.name} — {c.phone}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <MapEmbed className="h-64" />
            </div>
          </div>
          <QuoteForm />
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeading eyebrow="FAQ" title="Questions fréquentes" />
        <Accordion type="single" collapsible className="mt-10 max-w-3xl">
          {faq.map((item, index) => (
            <AccordionItem key={item.q} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </>
  );
}
