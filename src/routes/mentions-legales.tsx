import { createFileRoute } from "@tanstack/react-router";

import { Section, SectionHeading } from "@/components/site/Section";
import { site } from "@/config/site";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales | DSK AUTO 95 GARAGE" },
      {
        name: "description",
        content:
          "Mentions légales du site du garage automobile DSK AUTO 95 GARAGE, situé à Sarcelles (95).",
      },
      { property: "og:title", content: "Mentions légales | DSK AUTO 95 GARAGE" },
      {
        property: "og:description",
        content: "Informations légales du site DSK AUTO 95 GARAGE à Sarcelles.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${site.url}/mentions-legales` }],
  }),
  component: LegalPage,
});

function LegalPage() {
  return (
    <Section>
      <SectionHeading as="h1" eyebrow="Informations" title="Mentions légales" />

      <div className="mt-6 rounded-lg border border-primary/50 bg-primary/10 p-4 text-sm">
        <strong>À compléter avant mise en ligne :</strong> SIRET, forme
        juridique, responsable de la publication et hébergeur.
      </div>

      <div className="mt-10 max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-bold uppercase text-foreground">
            Éditeur du site
          </h2>
          <p className="mt-3">
            {site.name}
            <br />
            {site.address.full}
            <br />
            E-mail : {site.email}
            <br />
            Téléphones :{" "}
            {site.contacts.map((c) => `${c.name} ${c.phone}`).join(" — ")}
          </p>
          <p className="mt-3">
            Forme juridique : <em>à compléter</em>
            <br />
            SIRET : <em>à compléter</em>
            <br />
            Numéro de TVA intracommunautaire : <em>à compléter</em>
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-foreground">
            Responsable de la publication
          </h2>
          <p className="mt-3">
            <em>À compléter</em> (nom et qualité du responsable de publication).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-foreground">
            Hébergement
          </h2>
          <p className="mt-3">
            <em>À compléter</em> : nom de l'hébergeur, adresse et coordonnées de
            contact.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-foreground">
            Propriété intellectuelle
          </h2>
          <p className="mt-3">
            Le logo, les textes et les visuels présents sur ce site sont la
            propriété de leurs titulaires respectifs. Toute reproduction sans
            autorisation est interdite.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-foreground">
            Médiation de la consommation
          </h2>
          <p className="mt-3">
            <em>À compléter</em> : coordonnées du médiateur de la consommation
            si applicable à l'activité.
          </p>
        </section>
      </div>
    </Section>
  );
}
