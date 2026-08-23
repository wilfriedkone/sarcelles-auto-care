# DSK AUTO 95 GARAGE — site vitrine

Site vitrine du garage automobile **DSK AUTO 95 GARAGE**, 6 rue l'Escouvrier,
95200 Sarcelles. Achat, vente, réparation, diagnostic.

## Modifier le contenu

Presque tout le contenu éditorial est centralisé dans **`src/config/site.ts`** :

| Donnée | Où |
| --- | --- |
| Nom, adresse, e-mail, téléphones | `site.name`, `site.address`, `site.email`, `site.contacts` |
| Horaires d'ouverture | `site.hours` |
| Services (titre, slug, description, prestations, FAQ) | `site.services` |
| Zones d'intervention | `site.areas` |
| Questions fréquentes générales | `site.faq` |

Ajouter un service dans `site.services` crée automatiquement :
sa carte sur `/services`, sa page SEO `/services/<slug>`, son entrée dans le
sélecteur du formulaire de devis. Pensez à ajouter le `<loc>` correspondant
dans `public/sitemap.xml`.

### Charte graphique

Les couleurs, typographies, ombres et textures sont des tokens définis dans
**`src/styles.css`** (noir `#080808`, anthracite `#141414`, rouge `#E10600`,
police Barlow). Ne codez jamais une couleur en dur dans un composant.

### Logo et favicon

- Logo : `src/assets/dsk-logo.png` (header, hero, footer). Ne pas le redessiner.
- Favicon : `public/favicon.png`, générée à partir du logo.

## Demandes de devis

Le formulaire enregistre chaque demande dans la table `quote_requests` du
backend Lovable Cloud, avec :

- une **référence unique** non séquentielle affichée au client ;
- des protections anti-spam : champ piège (honeypot), délai minimum de
  remplissage, limitation à 3 envois par quart d'heure et par visiteur ;
- un statut de suivi : `nouvelle`, `contactee`, `traitee`, `archivee`.

Les demandes ne sont **jamais** lisibles publiquement : les règles de sécurité
de la base réservent la lecture aux comptes ayant le rôle `admin`.

### Notifications e-mail (optionnel)

Si le secret `RESEND_API_KEY` est renseigné dans Project Settings → Secrets,
chaque nouvelle demande déclenche un e-mail vers l'adresse du garage. Sans ce
secret, la demande est simplement enregistrée et consultable dans l'espace
d'administration.

## Espace d'administration

- Connexion : **`/admin/login`** (e-mail + mot de passe, pas d'inscription publique).
- Tableau de bord : **`/admin/demandes`** — recherche, filtre par statut, fiche
  détaillée, boutons appeler / e-mailer, changement de statut.

### Créer un compte administrateur

1. Ouvrez le backend Lovable Cloud → **Users** et créez l'utilisateur
   (e-mail + mot de passe) pour l'équipe du garage.
2. Attribuez-lui le rôle admin dans la table `user_roles` :

```sql
insert into public.user_roles (user_id, role)
values ('<uuid-de-l-utilisateur>', 'admin');
```

Sans cette ligne, la connexion fonctionne mais la liste des demandes reste
inaccessible.

## À compléter avant mise en ligne

- `/mentions-legales` : SIRET, forme juridique, responsable de publication, hébergeur.
- `/politique-confidentialite` : identité du responsable de traitement, durée de conservation.
- `public/sitemap.xml` : préfixer chaque URL par le domaine final.
- `public/robots.txt` : ajouter la ligne `Sitemap:` une fois le domaine connu.

## Développement

```bash
bun install
bun run dev
```

Stack : TanStack Start (React 19, SSR), Tailwind CSS v4, Lovable Cloud.
