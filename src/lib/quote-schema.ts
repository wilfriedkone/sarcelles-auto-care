import { z } from "zod";

export const MAX = {
  name: 80,
  phone: 30,
  email: 160,
  service: 80,
  vehicle: 120,
  message: 2000,
};

export const quoteSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Merci d'indiquer votre nom.")
      .max(MAX.name, "Nom trop long."),
    phone: z
      .string()
      .trim()
      .max(MAX.phone, "Téléphone trop long.")
      .refine(
        (v) => v === "" || /^[0-9+\s().-]{6,30}$/.test(v),
        "Numéro de téléphone invalide.",
      ),
    email: z
      .string()
      .trim()
      .max(MAX.email, "E-mail trop long.")
      .refine(
        (v) => v === "" || /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v),
        "Adresse e-mail invalide.",
      ),
    service: z.string().trim().max(MAX.service).default(""),
    vehicle: z.string().trim().max(MAX.vehicle).default(""),
    preferredContact: z
      .enum(["telephone", "email", "peu-importe"])
      .default("telephone"),
    message: z
      .string()
      .trim()
      .min(10, "Merci de décrire votre besoin (10 caractères minimum).")
      .max(MAX.message, "Message trop long."),
    consent: z.literal(true, {
      errorMap: () => ({
        message: "Le consentement est obligatoire pour envoyer la demande.",
      }),
    }),
    /** Champ piège invisible — doit rester vide */
    company: z.string().max(0).optional().default(""),
    /** Horodatage d'ouverture du formulaire (ms) */
    startedAt: z.number().int().nonnegative().default(0),
  })
  .refine((d) => d.phone !== "" || d.email !== "", {
    message: "Indiquez au moins un téléphone ou un e-mail.",
    path: ["phone"],
  });

export type QuoteInput = z.input<typeof quoteSchema>;
export type QuoteValues = z.output<typeof quoteSchema>;
