/**
 * ---------------------------------------------------------------------------
 * FICHIER DE CONFIGURATION UNIQUE — DSK AUTO 95 GARAGE
 * ---------------------------------------------------------------------------
 * Toutes les informations publiques du site sont centralisées ici.
 * Modifiez ce fichier pour mettre à jour le site (coordonnées, horaires,
 * services, zone d'intervention, FAQ...).
 */

export const site = {
  /**
   * Adresse publique du site, sans "/" final (ex. "https://dskauto95.fr").
   * Sert aux liens canoniques, au sitemap, au robots.txt et aux partages.
   */
  url: "https://id-preview--257ec0ea-6537-4e32-83a7-b2a2c4bf71ec.lovable.app",
  /**
   * Identifiant de mesure Google Analytics 4 (ex. "G-ABC123XYZ").
   * Laisser vide tant que le compte n'est pas créé : rien n'est chargé.
   * GA ne se charge qu'après acceptation dans la bannière cookies.
   */
  gaMeasurementId: "",
  name: "DSK AUTO 95 GARAGE",
  shortName: "DSK AUTO 95",
  activity: "Garage automobile — achat, vente, réparation, diagnostic",
  city: "Sarcelles",
  address: {
    street: "6 rue l'Escouvrier",
    postalCode: "95200",
    city: "Sarcelles",
    country: "FR",
    full: "6 rue l'Escouvrier, 95200 Sarcelles",
  },
  email: "dskauto95@gmail.com",
  contacts: [
    { name: "Diaby", phone: "07 59 04 48 39", tel: "+33759044839" },
  ],
  /** Horaires : jours d'ouverture non communiqués — ne rien inventer. */
  hoursLabel: "Horaires : 9h–19h — appelez-nous avant votre passage",
  hoursRange: { opens: "09:00", closes: "19:00" },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=6+rue+l%27Escouvrier+95200+Sarcelles",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=6%20rue%20l%27Escouvrier%2095200%20Sarcelles&output=embed",
  areas: [
    "Sarcelles",
    "Garges-lès-Gonesse",
    "Villiers-le-Bel",
    "Saint-Brice-sous-Forêt",
    "Écouen",
  ],
  areaNote: "et communes alentours du Val-d'Oise (95).",
  /**
   * Fiche Google Business du garage (lien "Voir tous les avis").
   * Laisser vide tant que la fiche n'existe pas.
   */
  googleBusinessUrl: "",
} as const;

export const primaryContact = site.contacts[0];

/**
 * Avis clients repris À L'IDENTIQUE depuis la fiche Google du garage.
 * Ne jamais inventer d'avis : la section "Avis clients" de l'accueil
 * reste masquée tant que cette liste est vide.
 */
export const googleReviews: Array<{ author: string; text: string; rating: number }> = [];

/** Note moyenne Google (ex. { value: 4.9, count: 37 }) ; null = non affichée. */
export const googleRating: { value: number; count: number } | null = null;


export type ServiceIconName =
  | "wrench"
  | "scan"
  | "zap"
  | "cpu"
  | "key"
  | "droplet"
  | "snowflake"
  | "clipboard"
  | "car";

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: ServiceIconName;
  /** Page SEO dédiée si true */
  seoPage: boolean;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  points: string[];
};

export const services: Service[] = [
  {
    slug: "mecanique-generale",
    title: "Mécanique générale",
    short:
      "Interventions courantes et lourdes sur toutes marques : moteur, transmission, liaison au sol.",
    icon: "wrench",
    seoPage: true,
    metaTitle: "Mécanique générale à Sarcelles (95) | DSK AUTO 95 GARAGE",
    metaDescription:
      "Mécanique générale toutes marques à Sarcelles : moteur, transmission, suspension, échappement. Devis sur demande, appelez le garage.",
    intro:
      "Notre atelier de Sarcelles réalise les interventions de mécanique courantes et plus lourdes sur la plupart des marques. Chaque intervention est précédée d'un échange et d'un devis.",
    points: [
      "Diagnostic mécanique et recherche d'origine de panne",
      "Moteur, courroie, embrayage, boîte",
      "Suspension, direction, échappement",
      "Devis avant toute intervention",
    ],
  },
  {
    slug: "diagnostic-electronique",
    title: "Diagnostic électronique multimarque",
    short:
      "Lecture et interprétation des défauts avec valise multimarque pour cibler la panne.",
    icon: "scan",
    seoPage: true,
    metaTitle: "Diagnostic électronique auto à Sarcelles | DSK AUTO 95",
    metaDescription:
      "Diagnostic électronique multimarque à Sarcelles (95) : lecture des défauts, contrôle des calculateurs, explication claire du résultat.",
    intro:
      "Un voyant allumé n'indique pas toujours la véritable panne. Nous réalisons un diagnostic électronique multimarque puis nous vous expliquons le résultat simplement.",
    points: [
      "Lecture et effacement des codes défauts",
      "Contrôle des paramètres en temps réel",
      "Vérification des calculateurs et capteurs",
      "Compte-rendu clair et devis associé",
    ],
  },
  {
    slug: "pannes-electriques",
    title: "Recherche et réparation de pannes électriques",
    short:
      "Faisceaux, démarrage, charge, capteurs : identification puis réparation ciblée.",
    icon: "zap",
    seoPage: true,
    metaTitle: "Panne électrique automobile à Sarcelles | DSK AUTO 95",
    metaDescription:
      "Recherche de panne électrique auto à Sarcelles (95) : démarrage, batterie, faisceau, capteurs. Prise de contact rapide par téléphone.",
    intro:
      "Les pannes électriques demandent de la méthode. Nous recherchons l'origine du défaut avant d'intervenir, pour éviter le remplacement de pièces inutile.",
    points: [
      "Problèmes de démarrage et de charge",
      "Contrôle de faisceaux et de connectiques",
      "Capteurs, éclairage, accessoires",
      "Réparation ciblée après identification",
    ],
  },
  {
    slug: "codage-reprogrammation-ecu",
    title: "Codage, télécodage et reprogrammation ECU",
    short:
      "Codage et télécodage de calculateurs, selon le véhicule et la réglementation en vigueur.",
    icon: "cpu",
    seoPage: true,
    metaTitle: "Codage et reprogrammation calculateur à Sarcelles | DSK AUTO 95",
    metaDescription:
      "Codage, télécodage et reprogrammation de calculateurs à Sarcelles (95), selon le véhicule et la réglementation. Faisabilité étudiée au cas par cas.",
    intro:
      "Nous réalisons des opérations de codage, télécodage et reprogrammation de calculateurs. La faisabilité dépend du véhicule, de son équipement et de la réglementation applicable : elle est étudiée au cas par cas.",
    points: [
      "Codage après remplacement d'un organe",
      "Télécodage de fonctions d'usine disponibles",
      "Reprogrammation ECU selon véhicule",
      "Étude de faisabilité avant acceptation",
    ],
  },
  {
    slug: "cles-vehicules",
    title: "Reproduction et programmation de clés",
    short:
      "Double de clé et programmation, selon la marque et le système antidémarrage.",
    icon: "key",
    seoPage: true,
    metaTitle: "Double de clé voiture à Sarcelles (95) | DSK AUTO 95 GARAGE",
    metaDescription:
      "Reproduction et programmation de clés de véhicules à Sarcelles (95). Faisabilité selon la marque et le système antidémarrage — contactez le garage.",
    intro:
      "Nous réalisons la reproduction et la programmation de clés de véhicules. Un justificatif de propriété du véhicule est demandé.",
    points: [
      "Double de clé et télécommande",
      "Programmation antidémarrage selon marque",
      "Justificatif de propriété obligatoire",
      "Faisabilité confirmée avant intervention",
    ],
  },
  {
    slug: "entretien-vidange-freinage",
    title: "Entretien, vidange, freinage, embrayage, distribution",
    short:
      "Entretien périodique et pièces d'usure pour garder votre véhicule fiable.",
    icon: "droplet",
    seoPage: true,
    metaTitle: "Entretien et vidange auto à Sarcelles (95) | DSK AUTO 95",
    metaDescription:
      "Vidange, freinage, embrayage et distribution à Sarcelles (95). Entretien automobile toutes marques, devis avant intervention.",
    intro:
      "L'entretien régulier reste le meilleur moyen d'éviter les grosses réparations. Nous prenons en charge l'entretien périodique et les pièces d'usure.",
    points: [
      "Vidange et filtres",
      "Plaquettes, disques, freinage complet",
      "Embrayage et distribution",
      "Contrôle général avant longs trajets",
    ],
  },
  {
    slug: "climatisation",
    title: "Climatisation",
    short: "Contrôle, recherche de fuite et remise en état du circuit de clim.",
    icon: "snowflake",
    seoPage: true,
    metaTitle: "Climatisation automobile à Sarcelles (95) | DSK AUTO 95",
    metaDescription:
      "Entretien et réparation de climatisation automobile à Sarcelles (95) : contrôle du circuit, recherche de fuite, remise en état.",
    intro:
      "Une climatisation qui refroidit mal cache souvent une fuite ou un composant fatigué. Nous contrôlons le circuit avant toute recharge.",
    points: [
      "Contrôle de performance du circuit",
      "Recherche de fuite",
      "Remplacement de composants défectueux",
      "Conseils d'entretien",
    ],
  },
  {
    slug: "pre-controle-technique",
    title: "Pré-contrôle technique",
    short:
      "Vérification des points de contrôle courants avant le passage au centre agréé.",
    icon: "clipboard",
    seoPage: true,
    metaTitle: "Pré-contrôle technique à Sarcelles (95) | DSK AUTO 95 GARAGE",
    metaDescription:
      "Pré-contrôle technique à Sarcelles (95) : vérification des points courants avant votre passage en centre agréé. Devis de remise en état sur demande.",
    intro:
      "Nous vérifions les points de contrôle les plus courants avant votre passage en centre agréé, et nous vous indiquons les remises en état nécessaires. Le contrôle technique officiel reste réalisé par un centre agréé.",
    points: [
      "Freinage, pneumatiques, éclairage",
      "Liaison au sol et visibilité",
      "Pollution et voyants",
      "Devis de remise en état",
    ],
  },
  {
    slug: "achat-vente-vehicules",
    title: "Achat et vente de véhicules",
    short:
      "Nous achetons votre véhicule et proposons des véhicules à la vente selon disponibilité.",
    icon: "car",
    seoPage: true,
    metaTitle: "Achat et vente de véhicules à Sarcelles (95) | DSK AUTO 95",
    metaDescription:
      "Achat et vente de véhicules d'occasion à Sarcelles (95). Proposez votre véhicule ou demandez les disponibilités du moment au garage DSK AUTO 95.",
    intro:
      "Vous souhaitez vendre votre véhicule ou en acquérir un ? Contactez-nous : nous étudions votre demande et vous indiquons les véhicules disponibles au moment de votre appel.",
    points: [
      "Reprise et achat de véhicules",
      "Véhicules à la vente selon disponibilité",
      "Accompagnement administratif",
      "Contact direct par téléphone",
    ],
  },
];

export const seoServices = services.filter((s) => s.seoPage);

export const steps = [
  {
    title: "1. Votre demande",
    text: "Vous appelez le garage ou envoyez le formulaire de devis avec les informations de votre véhicule.",
  },
  {
    title: "2. Échange",
    text: "Nous vous rappelons pour préciser le symptôme, l'historique et convenir d'un passage à l'atelier.",
  },
  {
    title: "3. Diagnostic et devis",
    text: "Nous identifions l'origine du problème et vous transmettons un devis avant toute intervention.",
  },
  {
    title: "4. Intervention",
    text: "Après votre accord, nous réalisons l'intervention et vous expliquons ce qui a été fait.",
  },
];

export const faq = [
  {
    q: "Faut-il prendre rendez-vous avant de passer au garage ?",
    a: "Oui, c'est fortement conseillé. Appelez-nous avant votre passage afin de vérifier nos disponibilités et le temps d'immobilisation nécessaire.",
  },
  {
    q: "Quelles marques prenez-vous en charge ?",
    a: "Nous intervenons en multimarque. Selon le modèle et l'opération demandée (codage, clés, reprogrammation), nous vérifions la faisabilité avant d'accepter le véhicule.",
  },
  {
    q: "Proposez-vous un devis avant intervention ?",
    a: "Oui. Après diagnostic, nous vous transmettons un devis. Aucune intervention n'est réalisée sans votre accord.",
  },
  {
    q: "Où se trouve le garage ?",
    a: `Au ${site.address.full}. Nous intervenons pour les automobilistes de Sarcelles et des communes alentours.`,
  },
  {
    q: "Réalisez-vous le contrôle technique ?",
    a: "Non. Nous réalisons un pré-contrôle technique afin de vérifier les points courants ; le contrôle technique officiel est effectué par un centre agréé.",
  },
  {
    q: "Puis-je vous vendre mon véhicule ?",
    a: "Oui, nous étudions les propositions d'achat de véhicules. Contactez-nous avec la marque, le modèle, l'année et le kilométrage.",
  },
];

export const contactPreferences = [
  { value: "telephone", label: "Téléphone" },
  { value: "email", label: "E-mail" },
  { value: "peu-importe", label: "Peu importe" },
];
