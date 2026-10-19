import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Cog,
  FileText,
  MapPin,
  Phone,
  ScanLine,
  Star,
  Wrench,
} from "lucide-react";

import atelier from "@/assets/photo-atelier.jpg";
import mecanique from "@/assets/photo-mecanique.jpg";
import vente from "@/assets/photo-vente.jpg";
import diagnostic from "@/assets/photo-diagnostic.jpg";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/site/Section";
import { AutoRepairJsonLd } from "@/components/site/JsonLd";
import { QuoteForm } from "@/components/site/QuoteForm";
import { MapEmbed } from "@/components/site/MapEmbed";
import { CallbackForm } from "@/components/site/CallbackForm";
import { Marquee } from "@/components/site/Marquee";
import {
  faq,
  googleRating,
  googleReviews,
  primaryContact,
  seoServices,
  services,
  site,
  steps,
} from "@/config/site";

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
      { property: "og:url", content: `${site.url}/` },
    ],
    links: [{ rel: "canonical", href: `${site.url}/` }],
  }),
  component: Home,
});

/** Les 3 services mis en avant en grandes cartes photo. */
const featured = [
  { slug: "mecanique-generale", image: mecanique, alt: "Mécanicien intervenant sur un moteur" },
  { slug: "diagnostic-electronique", image: diagnostic, alt: "Valise de diagnostic branchée sur un véhicule" },
  { slug: "entretien-vidange-freinage", image: atelier, alt: "Véhicule sur pont élévateur dans l'atelier" },
];
const featuredServices = featured.map((f) => ({
  ...f,
  service: services.find((s) => s.slug === f.slug)!,
}));
const otherServices = seoServices.filter((s) => !featured.some((f) => f.slug === s.slug));

const marqueeItems = [
  "Mécanique générale",
  "Diagnostic électronique",
  "Pannes électriques",
  "Codage ECU",
  "Clés & télécommandes",
  "Entretien & vidange",
  "Freinage",
  "Climatisation",
  "Pré-contrôle technique",
  "Achat & vente",
];

const trust = [
  { icon: FileText, title: "Devis d'abord", text: "Rien n'est fait sans votre accord" },
  { icon: ScanLine, title: "Diagnostic", text: "Valise électronique multimarque" },
  { icon: Wrench, title: "Toutes marques", text: "Du courant au technique" },
  { icon: MapPin, title: "Sarcelles (95)", text: "Garges, Villiers-le-Bel, Écouen…" },
];

const eyebrow = "font-display text-sm font-bold uppercase tracking-[0.25em] text-[oklch(0.72_0.17_29)]";
const bigTitle = "mt-3 text-4xl font-extrabold uppercase leading-[1.02] md:text-6xl";

function Home() {
  return (
    <>
      <AutoRepairJsonLd />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={atelier}
          alt=""
          aria-hidden="true"
          width={1600}
          height={1000}
          fetchPriority="high"
          className="animate-kenburns absolute inset-0 size-full object-cover opacity-55"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background lg:bg-gradient-to-r lg:from-background lg:via-background/85 lg:to-background/30"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-12 px-4 py-14 md:py-24">
          <div className="min-w-0 flex-[999_1_560px]">
            <p className="animate-enter enter-delay-1 inline-flex items-center gap-2.5 rounded-full border border-primary/45 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[oklch(0.72_0.17_29)] md:text-[13px]">
              <span className="animate-ping-dot size-2 rounded-full bg-primary" aria-hidden="true" />
              Achat · Vente · Réparation · Diagnostic
            </p>
            <h1 className="animate-enter enter-delay-2 mt-5 text-5xl font-extrabold uppercase leading-[0.98] md:text-7xl xl:text-[84px]">
              Votre garage
              <br />
              de confiance
              <br />
              <span className="text-primary">à Sarcelles</span>
            </h1>
            <p className="animate-enter enter-delay-3 mt-6 max-w-xl text-lg text-foreground/85 md:text-xl">
              Entretien, réparation et diagnostic électronique toutes marques. On vous
              explique la panne et on vous remet un devis{" "}
              <strong className="text-foreground">avant toute intervention</strong>.
            </p>
            <div className="animate-enter enter-delay-4 mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shine h-13 px-7 text-base">
                <Link to="/contact">
                  Demander un devis
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 border-white/20 bg-white/5 px-6 text-base"
              >
                <a href={`tel:${primaryContact.tel}`}>
                  <Phone className="size-5" aria-hidden="true" />
                  {primaryContact.phone}
                </a>
              </Button>
            </div>
            <ul className="animate-enter enter-delay-5 mt-9 flex flex-wrap gap-x-7 gap-y-2.5 text-[15px] text-foreground/85">
              {["Devis avant intervention", "Toutes marques", "Explications claires"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-5 text-primary" strokeWidth={2.6} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <CallbackForm className="animate-enter enter-delay-4 w-full flex-[1_1_340px] lg:max-w-[400px]" />
        </div>
      </section>

      <Marquee items={marqueeItems} />

      {/* CONFIANCE */}
      <section aria-label="Nos engagements" className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-9 sm:grid-cols-2 lg:grid-cols-4">
          {googleRating ? (
            <TrustItem
              icon={Star}
              title={`${googleRating.value.toLocaleString("fr-FR")} / 5`}
              text={`${googleRating.count} avis Google`}
            />
          ) : null}
          {trust.slice(0, googleRating ? 3 : 4).map((t) => (
            <TrustItem key={t.title} {...t} />
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <div className="reveal flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <p className={eyebrow}>Nos prestations</p>
            <h2 className={bigTitle}>Tout pour votre véhicule, au même endroit</h2>
          </div>
          <Link
            to="/services"
            className="group inline-flex min-h-11 items-center gap-2 font-semibold hover:text-primary"
          >
            Voir les {seoServices.length} services
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {featuredServices.map(({ service, image, alt }) => (
            <Link
              key={service.slug}
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="reveal group relative block min-h-80 overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-card md:min-h-[420px]"
            >
              <img
                src={image}
                alt={alt}
                width={1200}
                height={900}
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-background/95"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <h3 className="text-2xl font-bold uppercase md:text-3xl">{service.title}</h3>
                <p className="mt-1.5 text-[15px] text-foreground/85">{service.short}</p>
                <span className="mt-3.5 inline-flex items-center gap-2 font-semibold text-[oklch(0.72_0.17_29)]">
                  En savoir plus
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherServices.map((service) => (
            <li key={service.slug}>
              <Link
                to="/services/$slug"
                params={{ slug: service.slug }}
                className="group flex min-h-16 items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-primary"
              >
                {service.title}
                <ArrowRight
                  className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ÉTAPES */}
      <section className="relative overflow-hidden border-y border-border bg-card">
        <Cog
          className="animate-spin-slow pointer-events-none absolute -top-32 -right-36 size-[520px] text-white/[0.05]"
          strokeWidth={0.8}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-24">
          <p className={eyebrow}>Comment ça se passe</p>
          <h2 className={`reveal ${bigTitle}`}>Simple, transparent, sans surprise</h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="reveal border-t-2 border-border pt-5">
                <p className="font-display text-6xl leading-none font-extrabold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3.5 text-2xl font-bold uppercase">
                  {step.title.replace(/^\d+\.\s*/, "")}
                </h3>
                <p className="mt-1.5 text-[15px] text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ACHAT / VENTE */}
      <section
        id="achat-vente"
        className="mx-auto flex max-w-7xl flex-wrap items-center gap-14 px-4 py-20 md:py-28"
      >
        <div className="reveal relative min-w-0 flex-[1_1_440px]">
          <img
            src={vente}
            alt="Véhicule d'occasion proposé à la vente"
            width={1200}
            height={900}
            loading="lazy"
            className="h-72 w-full rounded-2xl border border-border object-cover md:h-[440px]"
          />
          <div className="animate-float absolute bottom-5 left-5 rounded-xl border border-border bg-background/90 px-4 py-3 text-sm backdrop-blur">
            <strong>Stock du moment</strong>
            <br />
            <span className="text-muted-foreground">Disponibilités sur appel</span>
          </div>
        </div>
        <div className="reveal min-w-0 flex-[1_1_400px]">
          <p className={eyebrow}>Achat &amp; vente</p>
          <h2 className={bigTitle}>Vendre ou acheter un véhicule</h2>
          <p className="mt-5 text-lg text-foreground/85">
            Vous souhaitez vendre votre véhicule ou en acheter un ? Contactez{" "}
            {primaryContact.name} : il étudie votre demande et vous indique les véhicules
            disponibles au moment de votre appel.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Reprise et achat de votre véhicule",
              "Véhicules disponibles selon le stock",
              "Accompagnement pour les démarches",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <Check className="size-5 text-primary" strokeWidth={2.6} aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12">
              <a href={`tel:${primaryContact.tel}`}>
                <Phone className="size-4" aria-hidden="true" />
                Appeler {primaryContact.name}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12">
              <Link to="/contact">Proposer mon véhicule</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AVIS — affiché uniquement avec de vrais avis Google */}
      {googleReviews.length > 0 ? (
        <section id="avis" className="border-y border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-20 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className={eyebrow}>Ils nous font confiance</p>
                <h2 className={`reveal ${bigTitle}`}>Avis clients</h2>
              </div>
              {site.googleBusinessUrl ? (
                <a
                  href={site.googleBusinessUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-11 items-center gap-2 font-semibold hover:text-primary"
                >
                  Tous les avis sur Google
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </a>
              ) : null}
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {googleReviews.slice(0, 3).map((review) => (
                <figure
                  key={review.author}
                  className="reveal flex flex-col gap-4 rounded-2xl border border-border bg-background p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary"
                >
                  <div className="flex gap-0.5" role="img" aria-label={`${review.rating} étoiles sur 5`}>
                    {Array.from({ length: review.rating }, (_, i) => (
                      <Star key={i} className="size-4 fill-[#F5B301] text-[#F5B301]" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-foreground/85">{review.text}</blockquote>
                  <figcaption className="mt-auto text-sm text-muted-foreground">
                    <strong className="text-foreground">{review.author}</strong> · avis Google
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* GALERIE */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:py-24">
        <p className={eyebrow}>L'atelier en images</p>
        <h2 className={`reveal ${bigTitle}`}>Notre garage</h2>
        <div className="mt-10 grid auto-rows-[200px] grid-cols-2 gap-4 md:auto-rows-[240px] md:grid-cols-4">
          <img
            src={atelier}
            alt="L'atelier du garage"
            loading="lazy"
            className="reveal col-span-2 row-span-2 size-full rounded-2xl object-cover"
          />
          <img
            src={mecanique}
            alt="Intervention mécanique"
            loading="lazy"
            className="reveal size-full rounded-2xl object-cover"
          />
          <img
            src={vente}
            alt="Véhicule devant le garage"
            loading="lazy"
            className="reveal size-full rounded-2xl object-cover"
          />
          <img
            src={diagnostic}
            alt="Diagnostic électronique"
            loading="lazy"
            className="reveal col-span-2 size-full rounded-2xl object-cover"
          />
        </div>
      </section>

      {/* BANDEAU D'APPEL */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:pb-28">
        <div className="reveal relative flex flex-wrap items-center justify-between gap-7 overflow-hidden rounded-3xl bg-primary px-7 py-12 md:px-12 md:py-14">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-extrabold uppercase leading-[1.02] text-primary-foreground md:text-5xl">
              Un voyant allumé ? Un bruit suspect ?
            </h2>
            <p className="mt-3 text-lg text-primary-foreground">
              Appelez-nous : on vous dit tout de suite si on peut vous aider.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {site.contacts.map((c, index) => (
              <a
                key={c.tel}
                href={`tel:${c.tel}`}
                className={
                  index === 0
                    ? "shine inline-flex min-h-14 items-center gap-2 rounded-xl bg-background px-6 text-lg font-semibold text-foreground"
                    : "inline-flex min-h-14 items-center gap-2 rounded-xl bg-white px-6 text-lg font-semibold text-black"
                }
              >
                <Phone className="size-5" aria-hidden="true" />
                {c.name} · {c.phone}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT + FORMULAIRE */}
      <Section id="devis" className="border-t border-border bg-card">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Demander un devis"
              description="Décrivez votre besoin : nous revenons vers vous pour préciser l'intervention et convenir d'un passage à l'atelier."
            />
            <ul className="mt-8 space-y-4 text-[15px]">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <address className="not-italic text-foreground/85">{site.address.full}</address>
              </li>
              {site.contacts.map((c) => (
                <li key={c.tel} className="flex gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <a href={`tel:${c.tel}`} className="text-foreground/85 hover:text-foreground">
                    {c.name} — {c.phone}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <MapEmbed className="h-72" />
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
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </>
  );
}

function TrustItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Star;
  title: string;
  text: string;
}) {
  return (
    <div className="reveal flex items-start gap-3.5">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/12">
        <Icon className="size-6 text-[oklch(0.68_0.2_29)]" aria-hidden="true" />
      </div>
      <div>
        <p className="font-display text-2xl leading-tight font-bold">{title}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
