import { useEffect } from "react";

import { site } from "@/config/site";
import { useConsent } from "@/lib/consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4, chargé uniquement si un identifiant est configuré
 * ET que le visiteur a accepté la mesure d'audience.
 * Les changements de page sont suivis par la mesure améliorée de GA4.
 */
export function Analytics() {
  const consent = useConsent();
  const id = site.gaMeasurementId;
  const granted = Boolean(consent?.analytics);

  useEffect(() => {
    if (!id) return;

    if (granted && !window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // gtag attend l'objet `arguments`, pas un tableau
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
      window.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "granted",
      });
      window.gtag("js", new Date());
      window.gtag("config", id, { anonymize_ip: true });

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(script);
      return;
    }

    if (granted && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
      return;
    }

    if (!granted && window.gtag) {
      // Retrait du consentement : on coupe la mesure et on efface les cookies GA.
      window.gtag("consent", "update", { analytics_storage: "denied" });
      deleteGaCookies();
    }
  }, [id, granted]);

  return null;
}

function deleteGaCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0]?.trim();
    if (!name || !(name === "_ga" || name.startsWith("_ga_") || name === "_gid")) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    });
  });
}
