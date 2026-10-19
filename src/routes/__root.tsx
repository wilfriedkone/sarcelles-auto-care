import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { CookieBanner } from "@/components/site/CookieBanner";
import { BackToTop } from "@/components/site/BackToTop";
import { Analytics } from "@/components/site/Analytics";
import { site } from "@/config/site";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="bg-honeycomb flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-8xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold uppercase">Page introuvable</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Cette page n'existe pas ou a été déplacée. Vous pouvez revenir à
          l'accueil ou consulter nos services.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-red px-5 py-2.5 text-sm font-semibold uppercase text-primary-foreground"
          >
            Accueil
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold uppercase"
          >
            Nos services
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Cette page n'a pas pu se charger
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Une erreur est survenue. Réessayez ou revenez à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DSK AUTO 95 GARAGE — Garage automobile à Sarcelles" },
      {
        name: "description",
        content:
          "Garage automobile à Sarcelles (95) : mécanique, diagnostic multimarque, entretien, achat et vente de véhicules.",
      },
      { name: "author", content: "DSK AUTO 95 GARAGE" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:site_name", content: "DSK AUTO 95 GARAGE" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${site.url}/og-image.jpg` },
      { name: "theme-color", content: "#080808" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      {isAdmin ? (
        <Outlet />
      ) : (
        <>
          <Header />
          <main id="contenu" className="pt-20 pb-20 lg:pt-29 lg:pb-0">
            <Outlet />
          </main>
          <Footer />
          <MobileActionBar />
          <BackToTop />
          <CookieBanner />
        </>
      )}
      <Analytics />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
