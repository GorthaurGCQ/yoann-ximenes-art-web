import type { ContentBlock } from '@/lib/cms/registry';
import type { ContentKind } from '@/lib/cms/types';
import { translations } from '@/lib/translations';

export const EXPOSITIONS_ITEMS_KEY = 'expositions.items';

export type ExpositionBadge = 'aVenir' | 'enCours' | null;

export interface ExpositionItem {
  id: string;
  year: string;
  titleFr: string;
  titleEn: string;
  lieuFr: string;
  lieuEn: string;
  dateFr: string;
  dateEn: string;
  badge: ExpositionBadge;
}

const STATIC_EXPOSITIONS: Array<{
  id: string;
  year: string;
  titleKey: 'expo1Titre' | 'expo2Titre' | 'expo3Titre';
  lieuKey: 'expo1Lieu' | 'expo2Lieu' | 'expo3Lieu';
  dateKey: 'expo1Date' | 'expo2Date' | 'expo3Date';
  badge: ExpositionBadge;
}> = [
  { id: 'horizons-futurs', year: '2025', titleKey: 'expo1Titre', lieuKey: 'expo1Lieu', dateKey: 'expo1Date', badge: 'aVenir' },
  { id: 'resonances', year: '2024', titleKey: 'expo2Titre', lieuKey: 'expo2Lieu', dateKey: 'expo2Date', badge: 'enCours' },
  { id: 'matiere-premiere', year: '2023', titleKey: 'expo3Titre', lieuKey: 'expo3Lieu', dateKey: 'expo3Date', badge: null },
];

export function buildDefaultExpositions(): ExpositionItem[] {
  return STATIC_EXPOSITIONS.map(({ id, year, titleKey, lieuKey, dateKey, badge }) => ({
    id,
    year,
    titleFr: translations.fr.expositions[titleKey],
    titleEn: translations.en.expositions[titleKey],
    lieuFr: translations.fr.expositions[lieuKey],
    lieuEn: translations.en.expositions[lieuKey],
    dateFr: translations.fr.expositions[dateKey],
    dateEn: translations.en.expositions[dateKey],
    badge,
  }));
}

export function parseExpositions(raw: string | null | undefined): ExpositionItem[] {
  if (raw === null || raw === undefined) return buildDefaultExpositions();
  if (!raw.trim()) return buildDefaultExpositions();
  try {
    const parsed = JSON.parse(raw) as ExpositionItem[];
    if (!Array.isArray(parsed)) return buildDefaultExpositions();
    // Un tableau vide est un état valide (l'utilisateur a supprimé toutes les expos)
    if (parsed.length === 0) return [];
    return parsed.map((item) => ({
      id: item.id,
      year: item.year ?? '',
      titleFr: item.titleFr ?? '',
      titleEn: item.titleEn ?? '',
      lieuFr: item.lieuFr ?? '',
      lieuEn: item.lieuEn ?? '',
      dateFr: item.dateFr ?? '',
      dateEn: item.dateEn ?? '',
      badge: item.badge === 'aVenir' || item.badge === 'enCours' ? item.badge : null,
    }));
  } catch {
    return buildDefaultExpositions();
  }
}

export function serializeExpositions(items: ExpositionItem[]): string {
  return JSON.stringify(items);
}

export function parseExpositionFieldKey(key: string): {
  id: string;
  field: 'year' | 'title' | 'lieu' | 'date' | 'badge';
  lang?: 'fr' | 'en';
} | null {
  const badgeMatch = key.match(/^expositions\.items\.([a-z0-9-]+)\.badge$/);
  if (badgeMatch) return { id: badgeMatch[1], field: 'badge' };

  const yearMatch = key.match(/^expositions\.items\.([a-z0-9-]+)\.year$/);
  if (yearMatch) return { id: yearMatch[1], field: 'year' };

  const match = key.match(/^expositions\.items\.([a-z0-9-]+)\.(title|lieu|date)\.(fr|en)$/);
  if (!match) return null;
  return { id: match[1], field: match[2] as 'title' | 'lieu' | 'date', lang: match[3] as 'fr' | 'en' };
}

export function isExpositionFieldKey(key: string): boolean {
  return key === EXPOSITIONS_ITEMS_KEY || parseExpositionFieldKey(key) !== null;
}

export function getExpositionFieldValue(items: ExpositionItem[], key: string): string | null {
  if (key === EXPOSITIONS_ITEMS_KEY) return serializeExpositions(items);
  const parsed = parseExpositionFieldKey(key);
  if (!parsed) return null;

  const item = items.find((e) => e.id === parsed.id);
  if (!item) return '';

  if (parsed.field === 'year') return item.year;
  if (parsed.field === 'badge') return item.badge ?? '';
  if (parsed.field === 'title') return parsed.lang === 'fr' ? item.titleFr : item.titleEn;
  if (parsed.field === 'lieu') return parsed.lang === 'fr' ? item.lieuFr : item.lieuEn;
  return parsed.lang === 'fr' ? item.dateFr : item.dateEn;
}

export function setExpositionFieldValue(items: ExpositionItem[], key: string, value: string): ExpositionItem[] {
  const parsed = parseExpositionFieldKey(key);
  if (!parsed) return items;

  return items.map((item) => {
    if (item.id !== parsed.id) return item;
    const next = { ...item };
    if (parsed.field === 'year') next.year = value;
    else if (parsed.field === 'badge') {
      next.badge = value === 'aVenir' || value === 'enCours' ? value : null;
    } else if (parsed.field === 'title') {
      if (parsed.lang === 'fr') next.titleFr = value;
      else next.titleEn = value;
    } else if (parsed.field === 'lieu') {
      if (parsed.lang === 'fr') next.lieuFr = value;
      else next.lieuEn = value;
    } else if (parsed.lang === 'fr') next.dateFr = value;
    else next.dateEn = value;
    return next;
  });
}

export function expositionFieldKey(
  id: string,
  field: 'year' | 'title' | 'lieu' | 'date' | 'badge',
  lang?: 'fr' | 'en'
) {
  if (field === 'badge') return `expositions.items.${id}.badge`;
  if (field === 'year') return `expositions.items.${id}.year`;
  return `expositions.items.${id}.${field}.${lang ?? 'fr'}`;
}

export function getExpositionBlockByKey(key: string): ContentBlock | undefined {
  const parsed = parseExpositionFieldKey(key);
  if (!parsed) {
    if (key === EXPOSITIONS_ITEMS_KEY) {
      return {
        key,
        label: 'Liste des expositions',
        page: 'expositions',
        section: 'items',
        kind: 'text',
        order: 50,
      };
    }
    return undefined;
  }

  const defaults = buildDefaultExpositions();
  const item = defaults.find((e) => e.id === parsed.id);
  const itemLabel = item?.titleFr ?? parsed.id;

  const labelMap: Record<string, string> = {
    year: 'Annee',
    title: 'Titre',
    lieu: 'Lieu',
    date: 'Date',
    badge: 'Badge',
  };

  const kindMap: Record<string, ContentKind> = {
    year: 'text',
    title: 'text',
    lieu: 'text',
    date: 'text',
    badge: 'text',
  };

  return {
    key,
    label: `${itemLabel} — ${labelMap[parsed.field]}`,
    page: 'expositions',
    section: 'items',
    kind: kindMap[parsed.field],
    lang: parsed.lang,
    order: 100,
  };
}

export function getExpositionRegistryBlocks(): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  for (const item of buildDefaultExpositions()) {
    const fields: Array<{ field: 'year' | 'title' | 'lieu' | 'date' | 'badge'; lang?: 'fr' | 'en' }> = [
      { field: 'year' },
      { field: 'badge' },
      { field: 'title', lang: 'fr' },
      { field: 'title', lang: 'en' },
      { field: 'lieu', lang: 'fr' },
      { field: 'lieu', lang: 'en' },
      { field: 'date', lang: 'fr' },
      { field: 'date', lang: 'en' },
    ];
    for (const { field, lang } of fields) {
      const block = getExpositionBlockByKey(expositionFieldKey(item.id, field, lang));
      if (block) blocks.push(block);
    }
  }
  return blocks;
}

export function createEmptyExposition(): ExpositionItem {
  return {
    id: `expo-${Date.now()}`,
    year: new Date().getFullYear().toString(),
    titleFr: 'Nouvelle exposition',
    titleEn: 'New exhibition',
    lieuFr: 'Paris, France',
    lieuEn: 'Paris, France',
    dateFr: '01 Janvier - 28 Fevrier',
    dateEn: 'January 1 - February 28',
    badge: 'aVenir',
  };
}
