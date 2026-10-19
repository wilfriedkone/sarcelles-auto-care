import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

import logo from "@/assets/dsk-logo.webp";
import { seoServices, site } from "@/config/site";
import { openConsentPreferences } from "@/lib/consent";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <img
            src={logo}
            alt={`Logo ${site.name}`}
            width={140}
            height={118}
            loading="lazy"
            className="h-20 w-auto"
          />
          <p className="mt-4 text-sm text-muted-foreground">{site.activity}</p>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-primary">
            Coordonnées
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <address className="not-italic">{site.address.full}</address>
            </li>
            {site.contacts.map((c) => (
              <li key={c.tel} className="flex gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <a className="hover:text-foreground" href={`tel:${c.tel}`}>
                  {c.name} — {c.phone}
                </a>
              </li>
            ))}
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a className="hover:text-foreground" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{site.hoursLabel}</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-primary">
            Services
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {seoServices.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="hover:text-foreground"
                >
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="hover:text-foreground">
                Tous les services
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-primary">
            Zone d'intervention
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            {site.areas.join(", ")} {site.areaNote}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/mentions-legales" className="hover:text-foreground">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link
                to="/politique-confidentialite"
                className="hover:text-foreground"
              >
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={openConsentPreferences}
                className="cursor-pointer hover:text-foreground"
              >
                Gestion des cookies
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {site.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
