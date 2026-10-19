import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Menu, Phone, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/dsk-logo.webp";
import { primaryContact, site } from "@/config/site";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/le-garage", label: "Le garage" },
  { to: "/zone-intervention", label: "Zone d'intervention" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
      {/* Barre d'infos (ordinateur) */}
      <div className="hidden h-9 border-b border-border/70 bg-card text-[13px] text-muted-foreground lg:block">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5 text-primary" aria-hidden="true" />
              {site.address.full}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-3.5 text-primary" aria-hidden="true" />
              {site.hoursLabel.replace("Horaires : ", "")}
            </span>
          </div>
          <div className="flex items-center gap-5">
            {site.contacts.map((c) => (
              <a key={c.tel} href={`tel:${c.tel}`} className="hover:text-foreground">
                {c.name} {c.phone}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label={`${site.name} — accueil`}
          onClick={() => setOpen(false)}
        >
          <img
            src={logo}
            alt={`Logo ${site.name}`}
            width={62}
            height={52}
            className="h-12 w-auto"
          />
          <span className="hidden font-display text-lg font-bold uppercase tracking-wide sm:block">
            DSK AUTO 95 <span className="text-primary">Garage</span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-primary" }}
                  className="rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="hidden h-10 sm:inline-flex">
            <a href={`tel:${primaryContact.tel}`}>
              <Phone className="size-4" aria-hidden="true" />
              Appeler
            </a>
          </Button>
          <Button asChild size="sm" className="hidden h-10 md:inline-flex">
            <Link to="/contact">Demander un devis</Link>
          </Button>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="menu-mobile"
          aria-label="Navigation mobile"
          className="border-t border-border bg-card lg:hidden"
        >
          <ul className="mx-auto max-w-7xl px-4 py-2">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-primary" }}
                  className="block border-b border-border/60 py-3 text-sm font-medium uppercase tracking-wide"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
