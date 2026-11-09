import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Images, Inbox, LogOut } from "lucide-react";
import type { ReactNode } from "react";

import logo from "@/assets/dsk-logo.webp";
import { supabase } from "@/integrations/supabase/client";
import { listQuoteRequests } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

export const QUOTES_KEY = ["admin", "quote-requests"] as const;

const tabs = [
  { to: "/admin/demandes", label: "Demandes", icon: Inbox },
  { to: "/admin/photos", label: "Photos", icon: Images },
] as const;

/** Mise en page commune de l'espace admin (pensée d'abord pour le téléphone). */
export function AdminShell({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchRequests = useServerFn(listQuoteRequests);
  const { data } = useQuery({ queryKey: QUOTES_KEY, queryFn: () => fetchRequests() });
  const newCount = (data?.requests ?? []).filter((r) => r.status === "nouvelle").length;

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" width={48} height={40} className="h-10 w-auto" />
            <div className="leading-tight">
              <p className="font-display text-lg font-bold uppercase">Espace garage</p>
              <p className="text-xs text-muted-foreground">DSK AUTO 95</p>
            </div>
          </div>

          <nav aria-label="Espace admin" className="hidden items-center gap-1 lg:flex">
            {tabs.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                activeProps={{ className: "bg-card text-foreground" }}
                className="relative inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                <tab.icon className="size-4" aria-hidden="true" />
                {tab.label}
                {tab.to === "/admin/demandes" && newCount > 0 ? <Badge count={newCount} /> : null}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground"
              aria-label="Voir le site"
              title="Voir le site"
            >
              <ExternalLink className="size-5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground"
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <LogOut className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-bold uppercase">{title}</h1>
          {actions}
        </div>
        <div className="mt-6">{children}</div>
      </main>

      {/* Barre d'onglets en bas, sur téléphone */}
      <nav
        aria-label="Espace admin"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeProps={{ className: "text-primary" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="relative flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold"
          >
            <span className="relative">
              <tab.icon className="size-6" aria-hidden="true" />
              {tab.to === "/admin/demandes" && newCount > 0 ? (
                <Badge count={newCount} className="absolute -top-2 -right-3" />
              ) : null}
            </span>
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function Badge({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] leading-5 font-bold text-primary-foreground",
        className,
      )}
      aria-label={`${count} nouvelle${count > 1 ? "s" : ""}`}
    >
      {count}
    </span>
  );
}
