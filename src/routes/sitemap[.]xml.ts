import { createFileRoute } from "@tanstack/react-router";

import { seoServices, site } from "@/config/site";

/** Sitemap généré depuis la configuration : toujours à jour avec site.url et les services. */
const pages: Array<[path: string, priority: string]> = [
  ["/", "1.0"],
  ["/services", "0.9"],
  ...seoServices.map((s): [string, string] => [`/services/${s.slug}`, "0.8"]),
  ["/le-garage", "0.7"],
  ["/zone-intervention", "0.7"],
  ["/contact", "0.9"],
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = pages
          .map(
            ([path, priority]) =>
              `  <url><loc>${site.url}${path}</loc><priority>${priority}</priority></url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
