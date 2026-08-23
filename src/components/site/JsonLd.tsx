import { site } from "@/config/site";

/** Données structurées Schema.org AutoRepair — aucune note ni avis inventés. */
export function AutoRepairJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: site.name,
    description: site.activity,
    email: site.email,
    telephone: site.contacts.map((c) => c.tel),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    areaServed: site.areas.map((a) => ({ "@type": "City", name: a })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        opens: site.hoursRange.opens,
        closes: site.hoursRange.closes,
      },
    ],
    hasMap: site.mapsUrl,
  };

  return (
    <script
      type="application/ld+json"
      // Contenu statique issu de la configuration du site
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
