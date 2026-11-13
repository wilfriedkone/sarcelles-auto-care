/**
 * Contenu détaillé des pages services : signes qui doivent amener au garage
 * et questions fréquentes (affichées sur la page et transmises à Google).
 * Aucun prix ni délai n'est promis : à compléter quand le garage les valide.
 */

export type ServiceContent = {
  /** "Quand venir au garage ?" */
  signs: string[];
  faq: { q: string; a: string }[];
};

export const servicesContent: Record<string, ServiceContent> = {
  "mecanique-generale": {
    signs: [
      "Bruit anormal au démarrage, en roulant ou au freinage",
      "Vibrations dans le volant ou la pédale",
      "Perte de puissance ou consommation qui augmente",
      "Fuite sous le véhicule (huile, liquide de refroidissement)",
      "Embrayage qui patine ou vitesses qui passent mal",
    ],
    faq: [
      {
        q: "Intervenez-vous sur toutes les marques ?",
        a: "Oui, l'atelier est multimarque. Pour certaines opérations très spécifiques, nous vérifions la faisabilité sur votre modèle avant d'accepter le véhicule.",
      },
      {
        q: "Combien coûte une réparation mécanique ?",
        a: "Le prix dépend du véhicule et de la panne. Nous identifions d'abord l'origine du problème, puis nous vous donnons un devis : rien n'est réparé sans votre accord.",
      },
      {
        q: "Puis-je fournir mes propres pièces ?",
        a: "Parlez-en avec le garage avant votre passage. Nous vous indiquerons si c'est possible selon la pièce et l'intervention.",
      },
    ],
  },
  "diagnostic-electronique": {
    signs: [
      "Un voyant s'allume sur le tableau de bord (moteur, ABS, airbag…)",
      "Le véhicule passe en mode dégradé et manque de puissance",
      "Démarrage difficile ou ralenti irrégulier",
      "Avant un achat d'occasion, pour vérifier l'état électronique",
    ],
    faq: [
      {
        q: "Un voyant moteur allumé, est-ce grave ?",
        a: "Pas toujours, mais il ne faut pas l'ignorer. Un voyant orange signale un défaut à contrôler rapidement ; un voyant rouge ou clignotant impose de s'arrêter. Le diagnostic permet de savoir exactement ce qui se passe.",
      },
      {
        q: "Le diagnostic suffit-il à réparer la panne ?",
        a: "Le diagnostic lit les défauts enregistrés par les calculateurs et oriente la recherche. Nous contrôlons ensuite les éléments concernés pour éviter de remplacer une pièce inutilement.",
      },
      {
        q: "Effacer le voyant fait-il disparaître la panne ?",
        a: "Non. Effacer un code sans traiter la cause ne fait que masquer le problème : le voyant revient. Nous vous expliquons le résultat avant toute intervention.",
      },
    ],
  },
  "pannes-electriques": {
    signs: [
      "La voiture ne démarre pas ou la batterie se décharge seule",
      "Éclairage, vitres ou fermeture centralisée qui ne fonctionnent plus",
      "Voyant de batterie ou de charge allumé",
      "Fusibles qui grillent à répétition",
    ],
    faq: [
      {
        q: "Ma batterie se vide toute seule, pourquoi ?",
        a: "Les causes les plus fréquentes sont une batterie usée, un alternateur qui charge mal ou un équipement qui consomme à l'arrêt. Une mesure permet d'identifier la bonne cause.",
      },
      {
        q: "Une panne électrique est-elle longue à trouver ?",
        a: "Cela dépend du défaut. Nous procédons par étapes pour localiser l'origine, et nous vous tenons informé avant d'engager une réparation.",
      },
      {
        q: "Remplacez-vous les batteries ?",
        a: "Oui, après avoir vérifié que la batterie est bien en cause et que le circuit de charge fonctionne correctement.",
      },
    ],
  },
  "codage-reprogrammation-ecu": {
    signs: [
      "Remplacement d'un calculateur, d'un injecteur ou d'un module à coder",
      "Fonction d'origine présente sur le véhicule mais non activée",
      "Message d'erreur après le changement d'une pièce électronique",
    ],
    faq: [
      {
        q: "Qu'est-ce que le codage d'un calculateur ?",
        a: "C'est l'opération qui permet à une pièce électronique neuve ou d'occasion d'être reconnue par le véhicule, ou d'activer une fonction prévue par le constructeur.",
      },
      {
        q: "La reprogrammation est-elle autorisée ?",
        a: "Toute modification doit respecter la réglementation et l'homologation du véhicule. Nous étudions chaque demande au cas par cas et refusons celles qui ne sont pas conformes.",
      },
      {
        q: "Mon véhicule est-il compatible ?",
        a: "La faisabilité dépend de la marque, du modèle et de l'équipement. Appelez le garage avec ces informations : nous vous répondons avant tout rendez-vous.",
      },
    ],
  },
  "cles-vehicules": {
    signs: [
      "Clé perdue ou volée",
      "Besoin d'un double de clé ou de télécommande",
      "Télécommande qui ne répond plus",
      "Voyant d'antidémarrage allumé",
    ],
    faq: [
      {
        q: "Quels documents faut-il apporter ?",
        a: "La carte grise et une pièce d'identité au même nom : sans justificatif de propriété, nous ne pouvons pas reproduire ni programmer une clé.",
      },
      {
        q: "Pouvez-vous faire une clé si je n'en ai plus aucune ?",
        a: "Cela dépend de la marque et du système antidémarrage. Contactez le garage avec le modèle et l'année du véhicule pour vérifier la faisabilité.",
      },
      {
        q: "Combien de temps faut-il ?",
        a: "Le délai dépend du type de clé et de la disponibilité de la pièce. Nous vous l'indiquons au moment de la demande.",
      },
    ],
  },
  "entretien-vidange-freinage": {
    signs: [
      "Vidange ou révision prévue au carnet d'entretien",
      "Grincement, frottement ou pédale de frein moins ferme",
      "Embrayage qui patine ou devient dur",
      "Kilométrage de remplacement de la distribution atteint",
    ],
    faq: [
      {
        q: "Tous les combien faire la vidange ?",
        a: "L'intervalle dépend du moteur et de l'huile utilisée : il figure dans le carnet d'entretien, souvent entre 15 000 et 30 000 km ou une fois par an. Nous vous indiquons le bon rythme pour votre véhicule.",
      },
      {
        q: "Comment savoir si mes plaquettes sont usées ?",
        a: "Un bruit de frottement ou de sifflement au freinage, une distance de freinage plus longue ou un voyant d'usure sont les signes à surveiller. Un contrôle au garage le confirme.",
      },
      {
        q: "L'entretien chez vous garde-t-il la garantie constructeur ?",
        a: "Oui, en Europe, l'entretien peut être réalisé hors réseau du constructeur sans perdre la garantie, à condition de respecter le programme d'entretien prévu.",
      },
    ],
  },
  climatisation: {
    signs: [
      "La climatisation ne refroidit plus ou souffle de l'air tiède",
      "Mauvaise odeur à la mise en marche",
      "Bruit anormal quand la climatisation est active",
      "Buée difficile à chasser en hiver",
    ],
    faq: [
      {
        q: "Faut-il recharger la climatisation chaque année ?",
        a: "Une climatisation en bon état ne perd que peu de gaz. Si elle refroidit moins, nous contrôlons d'abord le circuit pour trouver une éventuelle fuite avant de recharger.",
      },
      {
        q: "D'où vient la mauvaise odeur ?",
        a: "Le plus souvent d'un filtre d'habitacle encrassé ou d'un évaporateur humide. Un entretien adapté règle généralement le problème.",
      },
      {
        q: "Pourquoi utiliser la climatisation en hiver ?",
        a: "Elle assèche l'air et désembue plus vite. La faire fonctionner régulièrement aide aussi à garder le circuit en bon état.",
      },
    ],
  },
  "pre-controle-technique": {
    signs: [
      "Contrôle technique à passer dans les prochaines semaines",
      "Contre-visite à préparer après un premier contrôle",
      "Doute sur l'éclairage, les pneus ou le freinage",
    ],
    faq: [
      {
        q: "Faites-vous le contrôle technique ?",
        a: "Non. Le contrôle technique officiel est réalisé par un centre agréé. Nous vérifions les points les plus courants avant votre passage et réalisons les remises en état nécessaires.",
      },
      {
        q: "À quoi sert un pré-contrôle ?",
        a: "À repérer à l'avance les défauts fréquents pour éviter une contre-visite, qui fait perdre du temps et de l'argent.",
      },
      {
        q: "Pouvez-vous réparer après une contre-visite ?",
        a: "Oui. Apportez le procès-verbal du centre : nous vous faisons un devis pour les points à corriger.",
      },
    ],
  },
  "achat-vente-vehicules": {
    signs: [
      "Vous voulez vendre votre véhicule rapidement",
      "Vous cherchez un véhicule d'occasion vérifié par un atelier",
      "Vous voulez un avis avant d'acheter une occasion",
    ],
    faq: [
      {
        q: "Rachetez-vous tous les véhicules ?",
        a: "Nous étudions chaque proposition. Communiquez la marque, le modèle, l'année, le kilométrage et l'état général pour obtenir une réponse.",
      },
      {
        q: "Comment connaître les véhicules disponibles ?",
        a: "Le stock change régulièrement : appelez le garage pour connaître les véhicules disponibles au moment de votre recherche.",
      },
      {
        q: "Aidez-vous pour les papiers ?",
        a: "Oui, nous vous accompagnons dans les démarches administratives liées à la vente ou à l'achat.",
      },
    ],
  },
};

/** Pages locales "garage près de …" (communes voisines de Sarcelles). */
export type CityPage = {
  slug: string;
  name: string;
  /** Phrase d'accroche propre à la commune. */
  intro: string;
};

/** "de Garges-lès-Gonesse", mais "d'Écouen" (élision devant une voyelle). */
export function deVille(name: string): string {
  return /^[aeiouyàâéèêëîïôöûüh]/i.test(name) ? `d'${name}` : `de ${name}`;
}

export const cityPages: CityPage[] = [
  {
    slug: "garges-les-gonesse",
    name: "Garges-lès-Gonesse",
    intro:
      "Garges-lès-Gonesse et Sarcelles se touchent : le garage DSK AUTO 95 est à quelques minutes de chez vous pour l'entretien, les réparations et le diagnostic de votre véhicule.",
  },
  {
    slug: "villiers-le-bel",
    name: "Villiers-le-Bel",
    intro:
      "Commune voisine de Sarcelles, Villiers-le-Bel est à deux pas de notre atelier : un garage multimarque proche pour vos réparations, votre entretien et vos diagnostics.",
  },
  {
    slug: "saint-brice-sous-foret",
    name: "Saint-Brice-sous-Forêt",
    intro:
      "Depuis Saint-Brice-sous-Forêt, rejoignez rapidement notre atelier de Sarcelles pour faire entretenir ou réparer votre voiture, avec un devis avant toute intervention.",
  },
  {
    slug: "ecouen",
    name: "Écouen",
    intro:
      "Écouen est à quelques kilomètres de notre garage de Sarcelles : mécanique, diagnostic électronique, entretien et clés de véhicules, toutes marques.",
  },
];
