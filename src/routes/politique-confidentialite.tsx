import { createFileRoute } from "@tanstack/react-router";

import { Section, SectionHeading } from "@/components/site/Section";
import { site } from "@/config/site";

export const Route = createFileRoute("/politique-confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité | DSK AUTO 95 GARAGE" },
      {
        name: "description",
        content:
          "Comment DSK AUTO 95 GARAGE traite les données envoyées via le formulaire de demande de devis.",
      },
      {
        property: "og:title",
        content: "Politique de confidentialité | DSK AUTO 95 GARAGE",
      },
      {
        property: "og:description",
        content:
          "Traitement des données personnelles du formulaire de contact du garage DSK AUTO 95.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "/politique-confidentialite" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Données personnelles"
        title="Politique de confidentialité"
      />

      <div className="mt-6 rounded-lg border border-primary/50 bg-primary/10 p-4 text-sm">
        <strong>À compléter avant mise en ligne :</strong> identité exacte du
        responsable de traitement (raison sociale, SIRET) et, le cas échéant,
        coordonnées d'un délégué à la protection des données.
      </div>

      <div className="mt-10 max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-bold uppercase text-foreground">
            Responsable de traitement
          </h2>
          <p className="mt-3">
            {site.name}, {site.address.full}. Contact : {site.email}.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-foreground">
            Données collectées
          </h2>
          <p className="mt-3">
            Via le formulaire de demande de devis : nom, téléphone, e-mail,
            service demandé, informations sur le véhicule, moyen de contact
            préféré et contenu du message. Une empreinte technique anonymisée de
            l'origine de la demande est conservée pour limiter les envois
            automatisés.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-foreground">
            Finalité et base légale
          </h2>
          <p className="mt-3">
            Les données sont utilisées uniquement pour répondre à votre demande
            et vous recontacter. La base légale est votre consentement, recueilli
            lors de l'envoi du formulaire.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-foreground">
            Durée de conservation
          </h2>
          <p className="mt-3">
            Les demandes sont conservées le temps nécessaire au traitement de la
            demande commerciale, puis archivées ou supprimées.{" "}
            <em>Durée précise à compléter par le garage.</em>
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-foreground">
            Destinataires
          </h2>
          <p className="mt-3">
            Les données sont accessibles uniquement à l'équipe du garage via un
            espace d'administration protégé par authentification. Elles ne sont
            ni vendues, ni cédées à des tiers à des fins commerciales.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-foreground">
            Vos droits
          </h2>
          <p className="mt-3">
            Vous disposez d'un droit d'accès, de rectification, d'effacement,
            d'opposition et de limitation du traitement. Pour l'exercer, écrivez
            à {site.email}. Vous pouvez également introduire une réclamation
            auprès de la CNIL.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-foreground">
            Cookies
          </h2>
          <p className="mt-3">
            Ce site n'utilise pas de cookies publicitaires ni de mesure
            d'audience. La carte Google Maps intégrée peut déposer des cookies
            propres à Google lorsqu'elle est affichée.
          </p>
        </section>
      </div>
    </Section>
  );
}
