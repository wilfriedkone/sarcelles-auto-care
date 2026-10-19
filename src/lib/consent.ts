/**
 * Consentement cookies (RGPD / recommandations CNIL).
 * - Rien de non essentiel n'est chargé avant un choix explicite.
 * - "Refuser" est aussi simple que "Accepter".
 * - Le choix est conservé 6 mois, puis redemandé.
 */
import { useSyncExternalStore } from "react";

export type ConsentCategories = {
  /** Mesure d'audience Google Analytics */
  analytics: boolean;
  /** Carte Google Maps intégrée */
  maps: boolean;
};

type StoredConsent = ConsentCategories & { version: number; savedAt: number };

const STORAGE_KEY = "dsk-consent";
const VERSION = 1;
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182; // ~6 mois
const OPEN_EVENT = "dsk-consent:open";

const listeners = new Set<() => void>();
let cached: StoredConsent | null | undefined;

function read(): StoredConsent | null {
  if (cached !== undefined) return cached;
  cached = null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredConsent;
      const fresh = Date.now() - parsed.savedAt < MAX_AGE_MS;
      if (parsed.version === VERSION && fresh) cached = parsed;
    }
  } catch {
    cached = null;
  }
  return cached;
}

export function getConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  return read();
}

export function saveConsent(choice: ConsentCategories) {
  cached = { ...choice, version: VERSION, savedAt: Date.now() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    // Stockage indisponible (navigation privée) : le choix vaut pour la session.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Choix courant ; `null` tant que le visiteur n'a rien décidé (ou côté serveur). */
export function useConsent() {
  return useSyncExternalStore(subscribe, getConsent, () => null);
}

/** Rouvre le panneau de préférences (lien "Gestion des cookies"). */
export function openConsentPreferences() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenConsentPreferences(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}
