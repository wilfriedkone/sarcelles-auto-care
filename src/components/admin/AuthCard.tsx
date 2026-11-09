import type { ReactNode } from "react";

import logo from "@/assets/dsk-logo.webp";

/** Carte centrée des pages de connexion / mot de passe de l'espace garage. */
export function AuthCard({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <main className="bg-honeycomb flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-card">
        <img src={logo} alt="DSK AUTO 95 GARAGE" width={96} height={81} className="mx-auto h-20 w-auto" />
        <h1 className="mt-5 text-center font-display text-2xl font-bold uppercase">{title}</h1>
        {intro ? <p className="mt-2 text-center text-sm text-muted-foreground">{intro}</p> : null}
        <div className="mt-7">{children}</div>
      </div>
    </main>
  );
}
