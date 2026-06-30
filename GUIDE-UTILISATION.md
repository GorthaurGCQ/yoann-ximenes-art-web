# Guide d'utilisation — Site vitrine Yoann Ximenes

> Document destiné à l'administrateur du site. Il explique comment accéder au studio de gestion de contenu, modifier les textes et images, et publier les changements.

---

## Sommaire

1. [Présentation du site](#1-présentation-du-site)
2. [Accès au Studio (back-office)](#2-accès-au-studio-back-office)
3. [Interface du Studio](#3-interface-du-studio)
4. [Modifier du contenu — mode inline](#4-modifier-du-contenu--mode-inline)
5. [Modifier du contenu — panneau latéral](#5-modifier-du-contenu--panneau-latéral)
6. [Gestion des images](#6-gestion-des-images)
7. [Contenu bilingue (FR / EN)](#7-contenu-bilingue-fr--en)
8. [Pages et blocs éditables](#8-pages-et-blocs-éditables)
9. [Publier les modifications](#9-publier-les-modifications)
10. [Se déconnecter](#10-se-déconnecter)
11. [Informations techniques](#11-informations-techniques)

---

## 1. Présentation du site

Le site est composé de deux parties :

| Partie | URL | Visible par |
|--------|-----|-------------|
| **Site public** | `https://votre-domaine.vercel.app/` | Tout le monde |
| **Studio d'édition** | `https://votre-domaine.vercel.app/studio` | Admin uniquement |

**Pages publiques disponibles :**
- `/` — Accueil
- `/artiste` — L'Artiste
- `/oeuvres` — Œuvres
- `/expositions` — Expositions
- `/actualites` — Actualités
- `/contact` — Contact

Toutes ces pages peuvent être modifiées via le Studio sans toucher au code.

---

## 2. Accès au Studio (back-office)

### URL de connexion

L'URL du Studio est **intentionnellement cachée** des moteurs de recherche. Pour y accéder :

```
https://votre-domaine.vercel.app/studio/login
```

> En local (développement) : `http://localhost:3000/studio/login`

### Identifiants

| Champ | Valeur |
|-------|--------|
| **Email** | `admin@gmail.com` |
| **Mot de passe** | `password` |

> ⚠️ Ces identifiants sont ceux configurés dans les variables d'environnement du projet. En production sur Vercel, ils peuvent être différents selon la configuration du dashboard Vercel.

### Sécurité
- La session dure **12 heures** — passé ce délai il faut se reconnecter.
- Après **5 tentatives** de connexion échouées, l'accès est bloqué pendant 10 minutes.
- La session est stockée dans un cookie sécurisé (`httpOnly`).

---

## 3. Interface du Studio

Une fois connecté, le Studio se présente ainsi :

```
┌─────────────────────────────────────────────────────────┐
│  Studio │ [Accueil ▼] │ [FR|EN] │        Ctrl+K  Voir le site  Déconnexion  │
├─────────────────────────────────────────────────────────┤
│  ⚠ 3 modification(s) non sauvegardée(s)    Annuler tout │ Publier tout │
├────────────────────────────────────────────┬────────────┤
│                                            │  Titre     │
│         Aperçu de la page                 │  section   │
│         (cliquable pour éditer)            │            │
│                                            │  FRANÇAIS  │
│                                            │  [champ]   │
│                                            │            │
│                                            │  ANGLAIS   │
│                                            │  [champ]   │
│                                            │            │
│                                            │ [Sauvegarder] [Annuler] │
└────────────────────────────────────────────┴────────────┘
```

### Éléments de l'interface

| Élément | Description |
|---------|-------------|
| **Sélecteur de page** (`Accueil ▼`) | Changer de page à éditer |
| **Bouton FR / EN** | Prévisualiser la page en français ou anglais |
| **Ctrl+K** | Palette de recherche pour trouver un bloc rapidement |
| **Voir le site** | Ouvrir le site public dans un nouvel onglet |
| **Barre orange** | Indique le nombre de modifications non publiées |
| **Publier tout** | Publier toutes les modifications en attente |
| **Annuler tout** | Annuler toutes les modifications non publiées |

---

## 4. Modifier du contenu — mode inline

Le mode **inline** permet de modifier directement le texte visible dans l'aperçu de la page.

### Comment faire

1. **Survoler** un texte dans l'aperçu — un contour bleu apparaît avec un badge de label (ex. `TITRE SECTION EXPOSITION`)
2. **Cliquer** sur le texte — un champ de saisie apparaît directement à cet endroit
3. **Taper** le nouveau texte dans le champ
4. **Cliquer ailleurs** dans la page pour valider

> La modification est enregistrée localement (brouillon) mais **pas encore publiée**. La barre orange indique le nombre de modifications en attente.

### Astuce
Utiliser **Ctrl+K** pour ouvrir la palette de recherche et trouver rapidement un bloc par son nom (ex. taper « titre » ou « description »).

---

## 5. Modifier du contenu — panneau latéral

Le **panneau latéral droit** (barre blanche) s'affiche automatiquement quand un bloc est sélectionné. Il est souvent plus pratique pour les textes longs.

### Contenu du panneau

- **Nom du bloc** — titre et description du champ
- **Champ FRANÇAIS** — version française du texte
- **Champ ANGLAIS** — version anglaise (si applicable)
- **Bouton Sauvegarder** — publie uniquement ce bloc
- **Bouton Annuler** — annule les modifications de ce bloc
- **Aperçu** — prévisualisation du rendu dans la langue sélectionnée

### Pour les textes riches (paragraphes)

Les champs `richtext` (comme les descriptions d'œuvres ou les biographies) acceptent :
- Les retours à la ligne (Entrée = nouveau paragraphe)
- Le contenu est automatiquement converti en HTML lors de la publication

---

## 6. Gestion des images

### Modifier une image

1. Cliquer sur une image dans l'aperçu — le panneau latéral affiche la gestion d'image
2. Cliquer sur **« Importer image »** pour sélectionner un fichier depuis votre ordinateur
3. Formats acceptés : `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`
4. L'image est uploadée automatiquement et l'URL est mise à jour dans le champ

### Où sont stockées les images ?

| Environnement | Stockage |
|---------------|----------|
| **Local** (développement) | `public/Images/uploads/` |
| **Production** (Vercel) | Vercel Blob (stockage cloud Vercel) |

> Les images uploadées en production sont accessibles via une URL Vercel Blob et ne sont **pas** perdues lors d'un nouveau déploiement.

### Images statiques existantes

Les images fixes du site se trouvent dans `public/Images/` :
- `yoann-ximenes-portrait.jpeg` — Portrait de l'artiste
- `Oeuvres/` — Photos des œuvres par dossier

---

## 7. Contenu bilingue (FR / EN)

Tous les textes du site existent en **deux langues** : français et anglais.

### Dans le panneau latéral

Quand un bloc est sélectionné, le panneau affiche systématiquement :
- Un champ **FRANÇAIS**
- Un champ **ANGLAIS**

Il faut remplir les deux pour que le site soit complet dans les deux langues.

### Indicateur « non traduit »

Un badge **rouge « non traduit »** apparaît sur les blocs dont la version anglaise est vide alors que la version française est remplie. Cela aide à identifier les contenus à compléter.

### Prévisualisation par langue

Le bouton **FR / EN** dans la barre du haut permet de prévisualiser l'aperçu de la page dans la langue souhaitée. Il ne change pas la langue des champs de saisie — seulement le rendu visuel.

---

## 8. Pages et blocs éditables

### Page Accueil (`/studio/edit/accueil`)

| Bloc | Description | Type |
|------|-------------|------|
| Sous-titre hero | Texte sous le nom dans le slideshow | Texte |
| Titre section exposition | « Dernière Exposition » | Texte |
| Description exposition | Paragraphe de présentation | Texte riche |
| Texte du lien | « En savoir plus » | Texte |
| URL du lien | Lien vers la page expositions | Texte |
| Image exposition | Photo principale de l'accueil | Image |

### Page Artiste (`/studio/edit/artiste`)

| Bloc | Description | Type |
|------|-------------|------|
| Portrait | Photo de l'artiste | Image |
| Texte alternatif portrait | Description de l'image (accessibilité) | Texte |
| Titre, Heading | Titres de la page | Texte |
| Texte 1 à 4 | Paragraphes biographiques | Texte riche |
| Citation | Citation mise en valeur | Texte riche |
| Distinctions | Titre et 3 distinctions | Texte |

### Page Œuvres (`/studio/edit/oeuvres`)

| Bloc | Description | Type |
|------|-------------|------|
| Titre de la page | « Œuvres » | Texte |
| Œuvres (6 fiches) | Pour chaque œuvre : image, titre, catégorie, description | Image + Texte riche |

**Œuvres présentes :** La Symphonie des Vagabonds, Le Big Bang de Louise, Mantras #1, Nùn, Souvenir from Earth, Speechscape.

### Page Expositions (`/studio/edit/expositions`)

| Bloc | Description | Type |
|------|-------------|------|
| Titre de la page | « Expositions » | Texte |
| Badges | Texte des badges « À venir », « En cours » | Texte |
| Expositions (liste) | Pour chaque expo : année, badge, titre, lieu, date | Texte |

### Page Actualités (`/studio/edit/actualites`)

| Bloc | Description | Type |
|------|-------------|------|
| Titre, sous-titre | En-têtes de la page | Texte |
| Articles 1, 2, 3 | Date, catégorie, titre, description, lien | Texte |
| Images Instagram | 3 photos Instagram | Image |
| Texte Instagram | « Suivre sur Instagram » | Texte |

### Page Contact (`/studio/edit/contact`)

| Bloc | Description | Type |
|------|-------------|------|
| Titre, Description | En-tête de la page contact | Texte |
| Envoyer un email | Texte du bouton | Texte |
| Atelier | Localisation atelier | Texte |
| Galerie | Nom et description de la galerie | Texte |
| Réseaux | Texte « Réseaux sociaux » | Texte |

---

## 9. Publier les modifications

### Publier un seul bloc

Dans le panneau latéral, cliquer sur **« Sauvegarder »** après modification. Le bloc est immédiatement publié sur le site public.

### Publier tous les blocs modifiés

Dans la barre orange en haut, cliquer sur **« Publier tout »**. Tous les brouillons en attente sont publiés d'un coup.

### Annuler des modifications

- **Annuler un bloc** : bouton « Annuler » dans le panneau latéral (revient à la valeur publiée)
- **Annuler tout** : bouton « Annuler tout » dans la barre orange (efface tous les brouillons)

> ⚠️ Une fois publié, il n'y a pas de retour arrière automatique. Si une erreur a été publiée, il faut re-saisir la valeur correcte et republier.

---

## 10. Se déconnecter

Deux façons de se déconnecter :

1. **Depuis le Studio** : bouton « Déconnexion » en haut à droite
2. **Depuis le site public** (si connecté) : bouton flottant « Déconnexion » en bas à gauche de l'écran

---

## 11. Informations techniques

### Variables d'environnement

Le fichier `.env.local` (en développement) ou le dashboard Vercel (en production) contient :

| Variable | Usage |
|----------|-------|
| `ADMIN_EMAIL` | Email de connexion admin |
| `ADMIN_PASSWORD` | Mot de passe (texte simple, dev uniquement) |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt (recommandé en production) |
| `ADMIN_SESSION_SECRET` | Clé secrète pour les tokens JWT |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob (pour les images et le CMS en prod) |
| `BLOB_STORE_ID` | Identifiant du store Vercel Blob |

### Stockage des données

| Environnement | Textes/CMS | Images uploadées |
|---------------|------------|------------------|
| **Local** | `data/cms-store.json` | `public/Images/uploads/` |
| **Production Vercel** | Vercel Blob (`cms-store.json`) | Vercel Blob (`uploads/`) |

### Stack technique

- **Framework** : Next.js 16 (App Router, Turbopack)
- **UI** : React 19 + Tailwind CSS v4
- **Auth** : JWT (jose) + cookie httpOnly
- **Stockage** : Vercel Blob
- **Déploiement** : Vercel (déploiement automatique depuis Git)

### Commandes de développement

```bash
npm run dev    # Démarrer le serveur de développement (localhost:3000)
npm run build  # Compiler pour la production
npm run lint   # Vérifier le code
```

### Modifier les identifiants en production

Sur Vercel → Settings → Environment Variables :
- Modifier `ADMIN_EMAIL` et `ADMIN_PASSWORD` (ou `ADMIN_PASSWORD_HASH`)
- Changer `ADMIN_SESSION_SECRET` avec une chaîne aléatoire longue
- Redéployer après modification

---

*Documentation générée pour le projet yoann-ximenes-nextjs — Juin 2026*
