import type { ContentKind } from '@/lib/cms/types';
import {
  EXPOSITIONS_ITEMS_KEY,
  getExpositionBlockByKey,
  getExpositionRegistryBlocks,
} from '@/lib/cms/expositions';
import { getOeuvreBlockByKey, getOeuvreRegistryBlocks, OEUVRES_WORKS_KEY } from '@/lib/cms/oeuvres';

export type CmsPage =
  | 'accueil'
  | 'artiste'
  | 'oeuvres'
  | 'expositions'
  | 'actualites'
  | 'contact';

export const CMS_PAGES: Array<{ id: CmsPage; label: string; path: string }> = [
  { id: 'accueil', label: 'Accueil', path: '/studio/edit/accueil' },
  { id: 'artiste', label: 'Artiste', path: '/studio/edit/artiste' },
  { id: 'oeuvres', label: 'Oeuvres', path: '/studio/edit/oeuvres' },
  { id: 'expositions', label: 'Expositions', path: '/studio/edit/expositions' },
  { id: 'actualites', label: 'Actualites', path: '/studio/edit/actualites' },
  { id: 'contact', label: 'Contact', path: '/studio/edit/contact' },
];

export interface ContentBlock {
  key: string;
  label: string;
  description?: string;
  page: CmsPage;
  section: string;
  kind: ContentKind;
  lang?: 'fr' | 'en';
  order: number;
}

function tKey(lang: 'fr' | 'en', section: string, field: string) {
  return `translations.${lang}.${section}.${field}`;
}

function blocksForSection(
  page: CmsPage,
  section: string,
  fields: Array<{ field: string; label: string; kind: ContentKind; order: number }>
): ContentBlock[] {
  const result: ContentBlock[] = [];
  for (const lang of ['fr', 'en'] as const) {
    for (const { field, label, kind, order } of fields) {
      result.push({
        key: tKey(lang, section, field),
        label,
        page,
        section,
        kind,
        lang,
        order,
      });
    }
  }
  return result;
}

export const CONTENT_REGISTRY: ContentBlock[] = [
  // Accueil
  ...blocksForSection('accueil', 'index', [
    { field: 'subtitle', label: 'Sous-titre hero', kind: 'text', order: 1 },
    { field: 'derniereExpo', label: 'Titre section exposition', kind: 'text', order: 2 },
    { field: 'resonancesSilencieuses', label: 'Description exposition', kind: 'richtext', order: 3 },
    { field: 'enSavoirPlus', label: 'Lien en savoir plus', kind: 'text', order: 4 },
    { field: 'expoAlt', label: 'Texte alternatif image exposition', kind: 'text', order: 5 },
  ]),
  {
    key: 'accueil.expoImage.src',
    label: 'Image section exposition',
    page: 'accueil',
    section: 'expo',
    kind: 'image',
    order: 6,
  },

  // Artiste
  {
    key: 'artiste.profileImage.src',
    label: 'Portrait de l\'artiste',
    description: 'Photo principale de la page Artiste',
    page: 'artiste',
    section: 'portrait',
    kind: 'image',
    order: 1,
  },
  {
    key: 'artiste.profileImage.alt',
    label: 'Texte alternatif du portrait',
    page: 'artiste',
    section: 'portrait',
    kind: 'text',
    order: 2,
  },
  ...blocksForSection('artiste', 'artiste', [
    { field: 'title', label: 'Titre de la page', kind: 'text', order: 3 },
    { field: 'heading', label: 'Sous-titre principal', kind: 'text', order: 4 },
    { field: 'text1', label: 'Paragraphe 1', kind: 'richtext', order: 5 },
    { field: 'text2', label: 'Paragraphe 2', kind: 'richtext', order: 6 },
    { field: 'quote', label: 'Citation', kind: 'text', order: 7 },
    { field: 'text3', label: 'Paragraphe 3', kind: 'richtext', order: 8 },
    { field: 'text4', label: 'Paragraphe 4', kind: 'richtext', order: 9 },
    { field: 'distinctions', label: 'Titre distinctions', kind: 'text', order: 10 },
    { field: 'distinction1', label: 'Distinction 1', kind: 'text', order: 11 },
    { field: 'distinction2', label: 'Distinction 2', kind: 'text', order: 12 },
    { field: 'distinction3', label: 'Distinction 3', kind: 'text', order: 13 },
  ]),

  // Oeuvres
  ...blocksForSection('oeuvres', 'oeuvres', [
    { field: 'title', label: 'Titre de la page', kind: 'text', order: 1 },
  ]),
  ...getOeuvreRegistryBlocks(),

  // Expositions
  ...blocksForSection('expositions', 'expositions', [
    { field: 'title', label: 'Titre de la page', kind: 'text', order: 1 },
    { field: 'aVenir', label: 'Badge a venir', kind: 'text', order: 2 },
    { field: 'enCours', label: 'Badge en cours', kind: 'text', order: 3 },
  ]),
  ...getExpositionRegistryBlocks(),

  // Actualites
  ...blocksForSection('actualites', 'actualites', [
    { field: 'title', label: 'Titre de la page', kind: 'text', order: 1 },
    { field: 'dernieresPublications', label: 'Titre publications', kind: 'text', order: 2 },
    { field: 'lireSuite', label: 'Lien lire la suite', kind: 'text', order: 3 },
    { field: 'presse', label: 'Tag presse', kind: 'text', order: 4 },
    { field: 'evenement', label: 'Tag evenement', kind: 'text', order: 5 },
    { field: 'article1Date', label: 'Article 1 - Date', kind: 'text', order: 6 },
    { field: 'article1Categorie', label: 'Article 1 - Categorie', kind: 'text', order: 7 },
    { field: 'article1Titre', label: 'Article 1 - Titre', kind: 'text', order: 8 },
    { field: 'article1Desc', label: 'Article 1 - Description', kind: 'richtext', order: 9 },
    { field: 'article1LienTexte', label: 'Article 1 - Texte du lien', kind: 'text', order: 10 },
    { field: 'article1Lien', label: 'Article 1 - URL du lien', kind: 'text', order: 11 },
    { field: 'article2Date', label: 'Article 2 - Date', kind: 'text', order: 12 },
    { field: 'article2Categorie', label: 'Article 2 - Categorie', kind: 'text', order: 13 },
    { field: 'article2Titre', label: 'Article 2 - Titre', kind: 'text', order: 14 },
    { field: 'article2Desc', label: 'Article 2 - Description', kind: 'richtext', order: 15 },
    { field: 'article2LienTexte', label: 'Article 2 - Texte du lien', kind: 'text', order: 16 },
    { field: 'article2Lien', label: 'Article 2 - URL du lien', kind: 'text', order: 17 },
    { field: 'article3Date', label: 'Article 3 - Date', kind: 'text', order: 18 },
    { field: 'article3Categorie', label: 'Article 3 - Categorie', kind: 'text', order: 19 },
    { field: 'article3Titre', label: 'Article 3 - Titre', kind: 'text', order: 20 },
    { field: 'article3Desc', label: 'Article 3 - Description', kind: 'richtext', order: 21 },
    { field: 'article3LienTexte', label: 'Article 3 - Texte du lien', kind: 'text', order: 22 },
    { field: 'article3Lien', label: 'Article 3 - URL du lien', kind: 'text', order: 23 },
    { field: 'instagram', label: 'Titre Instagram', kind: 'text', order: 24 },
    { field: 'suivre', label: 'Lien suivre Instagram', kind: 'text', order: 25 },
  ]),
  {
    key: 'actualites.instagramImage1.src',
    label: 'Instagram image 1',
    page: 'actualites',
    section: 'instagram',
    kind: 'image',
    order: 26,
  },
  {
    key: 'actualites.instagramImage2.src',
    label: 'Instagram image 2',
    page: 'actualites',
    section: 'instagram',
    kind: 'image',
    order: 27,
  },
  {
    key: 'actualites.instagramImage3.src',
    label: 'Instagram image 3',
    page: 'actualites',
    section: 'instagram',
    kind: 'image',
    order: 28,
  },

  // Contact
  ...blocksForSection('contact', 'contact', [
    { field: 'title', label: 'Titre de la page', kind: 'text', order: 1 },
    { field: 'description', label: 'Description', kind: 'richtext', order: 2 },
    { field: 'envoyerEmail', label: 'Bouton envoyer email', kind: 'text', order: 3 },
    { field: 'atelier', label: 'Titre atelier', kind: 'text', order: 4 },
    { field: 'parisFrance', label: 'Ville atelier', kind: 'text', order: 5 },
    { field: 'galerie', label: 'Titre galerie', kind: 'text', order: 6 },
    { field: 'galerieText', label: 'Texte galerie', kind: 'text', order: 7 },
    { field: 'reseaux', label: 'Titre reseaux', kind: 'text', order: 8 },
  ]),
];

export function getBlockByKey(key: string): ContentBlock | undefined {
  return getOeuvreBlockByKey(key) ?? getExpositionBlockByKey(key) ?? CONTENT_REGISTRY.find((b) => b.key === key);
}

export function getBlocksForPage(page: CmsPage, lang?: 'fr' | 'en'): ContentBlock[] {
  return CONTENT_REGISTRY.filter((b) => {
    if (b.page !== page) return false;
    if (!lang) return true;
    if (!b.lang) return true;
    return b.lang === lang;
  }).sort((a, b) => a.order - b.order);
}

export function getKeysForPage(page: CmsPage): string[] {
  if (page === 'oeuvres') {
    return [
      'translations.fr.oeuvres.title',
      'translations.en.oeuvres.title',
      OEUVRES_WORKS_KEY,
    ];
  }
  if (page === 'expositions') {
    return [
      'translations.fr.expositions.title',
      'translations.en.expositions.title',
      'translations.fr.expositions.aVenir',
      'translations.en.expositions.aVenir',
      'translations.fr.expositions.enCours',
      'translations.en.expositions.enCours',
      EXPOSITIONS_ITEMS_KEY,
    ];
  }
  return getBlocksForPage(page).map((b) => b.key);
}

export function getCounterpartKey(key: string): string | null {
  const block = getBlockByKey(key);
  if (!block?.lang) return null;
  const targetLang = block.lang === 'fr' ? 'en' : 'fr';
  if (key.includes('.works.') || key.includes('.items.')) {
    return key.replace(/\.(fr|en)$/, `.${targetLang}`);
  }
  return key.replace(`.${block.lang}.`, `.${targetLang}.`);
}

export function isValidCmsPage(page: string): page is CmsPage {
  return CMS_PAGES.some((p) => p.id === page);
}
