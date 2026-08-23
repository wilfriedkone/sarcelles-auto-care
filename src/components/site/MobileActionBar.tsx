import { Link } from "@tanstack/react-router";
import { FileText, Phone } from "lucide-react";

import { primaryContact } from "@/config/site";

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:hidden">
      <div className="grid grid-cols-2 gap-2 p-2">
        <a
          href={`tel:${primaryContact.tel}`}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-red px-4 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
        >
          <Phone className="size-4" aria-hidden="true" />
          Appeler
        </a>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-semibold uppercase tracking-wide text-foreground"
        >
          <FileText className="size-4" aria-hidden="true" />
          Devis
        </Link>
      </div>
    </div>
  );
}
