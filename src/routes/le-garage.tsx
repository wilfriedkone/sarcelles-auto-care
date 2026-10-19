import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";

import atelier from "@/assets/photo-atelier.jpg";
import mecanique from "@/assets/photo-mecanique.jpg";
import diagnostic from "@/assets/photo-diagnostic.jpg";
import vente from "@/assets/photo-vente.jpg";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { AutoRepairJsonLd } from "@/components/site/JsonLd";
import { primaryContact, site, steps } from "@/config/site";

export const Route = createFileRoute("/le-garage")({
  head: () => ({
    meta: [
      { title: "Le garage DSK AUTO 95 à Sarcelles | Atelier automobile" },
      {
        name: "description",
        content:
          "Découvrez DSK AUTO 95 GARAGE, atelier automobile à Sarcelles (95) : méthode de travail, devis avant intervention et prestations multimarques.",
      },
      { property: "og:title", content: "Le garage DSK AUTO 95 à Sarcelles" },
      {
        property: "og:description",
        content:
          "Atelier automobile de proximité à Sarcelles : diagnostic, réparation, entretien et vente de véhicules.",
      },
    ],
    links: [{ rel: "canonical", href: `${site.url}/le-garage` }],
  }),
  component: GaragePage,
});

/** Photos temporaires : remplacez simplement ces fichiers dans src/assets. */
const photos = [
  { src: atelier, alt: "Atelier du garage avec véhicule sur pont élévateur" },
  { src: mecanique, alt: "Intervention mécanique sur un moteur" },
  { src: diagnostic, alt: "Diagnostic électronique d'un véhicule" },
  { src: vente, alt: "Véhicule prêt à être remis au client" },
];

function GaragePage() {
  return (
    <>
      <AutoRepairJsonLd />
      <Section className="bg-honeycomb">
        <SectionHeading
          as="h1"
          eyebrow="Le garage"
          title="DSK AUTO 95 GARAGE, atelier à Sarcelles"
          description="Le garage prend en charge l'entretien, la réparation et le diagnostic électronique des véhicules. Notre priorité : comprendre la panne, l'expliquer simplement et proposer un devis avant toute intervention."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((photo) => (
            <img
              key={photo.alt}
              src={photo.src}
              alt={photo.alt}
              width={1200}
              height={900}
              loading="lazy"
              className="h-52 w-full rounded-xl object-cover shadow-card"
            />
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">
              Notre façon de travailler
            </h2>
            <ol className="mt-6 space-y-4">
              {steps.map((step) => (
                <li key={step.title} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-display text-lg font-bold uppercase text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">
              Informations pratiques
            </h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-semibold uppercase text-muted-foreground">Adresse</dt>
                <dd className="mt-1">{site.address.full}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase text-muted-foreground">Horaires</dt>
                <dd className="mt-1">{site.hoursLabel}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase text-muted-foreground">Contacts</dt>
                <dd className="mt-1 space-y-1">
                  {site.contacts.map((c) => (
                    <div key={c.tel}>
                      <a className="hover:text-primary" href={`tel:${c.tel}`}>
                        {c.name} — {c.phone}
                      </a>
                    </div>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="font-semibold uppercase text-muted-foreground">E-mail</dt>
                <dd className="mt-1">
                  <a className="hover:text-primary" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/contact">Demander un devis</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={`tel:${primaryContact.tel}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  Appeler le garage
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
