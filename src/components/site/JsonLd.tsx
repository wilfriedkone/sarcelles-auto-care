import logo from "@/assets/dsk-logo.webp";
import { primaryContact, site } from "@/config/site";

/**
 * Données structurées Schema.org lues par Google (fiche du garage, FAQ,
 * fil d'Ariane, prestations). Aucune note ni avis inventés.
 */

const GARAGE_ID = `${site.url}/#garage`;

function absolute(path: string) {
  return path.startsWith("http") ? path : `${site.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Contenu statique issu de la configuration du site
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function AutoRepairJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AutoRepair",
        "@id": GARAGE_ID,
        name: site.name,
        description: site.activity,
        url: `${site.url}/`,
        logo: absolute(logo),
        image: absolute("/og-image.jpg"),
        email: site.email,
        telephone: primaryContact.tel,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          postalCode: site.address.postalCode,
          addressLocality: site.address.city,
          addressRegion: "Val-d'Oise",
          addressCountry: site.address.country,
        },
        areaServed: [site.city, ...site.areas.filter((a) => a !== site.city)].map((name) => ({
          "@type": "City",
          name,
        })),
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: site.openingDays,
            opens: site.hoursRange.opens,
            closes: site.hoursRange.closes,
          },
        ],
        hasMap: site.mapsUrl,
        ...(site.googleBusinessUrl ? { sameAs: [site.googleBusinessUrl] } : {}),
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: ReadonlyArray<{ q: string; a: string }> }) {
  if (items.length === 0) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }}
    />
  );
}

/** Fil d'Ariane : [{ name: "Accueil", path: "/" }, …] */
export function BreadcrumbJsonLd({ items }: { items: ReadonlyArray<{ name: string; path: string }> }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: absolute(item.path),
        })),
      }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        url: absolute(path),
        serviceType: name,
        provider: { "@id": GARAGE_ID },
        areaServed: [site.city, ...site.areas.filter((a) => a !== site.city)].map((n) => ({
          "@type": "City",
          name: n,
        })),
      }}
    />
  );
}
