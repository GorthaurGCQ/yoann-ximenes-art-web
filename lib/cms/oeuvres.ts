import type { ContentBlock } from '@/lib/cms/registry';
import type { ContentKind } from '@/lib/cms/types';
import { editorValueToRichText, richTextToEditorValue } from '@/lib/cms/richText';
import { translations } from '@/lib/translations';
import { worksData } from '@/lib/worksData';

export const OEUVRES_WORKS_KEY = 'oeuvres.works';

export interface OeuvreItem {
  id: string;
  image: string;
  images: string[];
  titleFr: string;
  titleEn: string;
  categoryFr: string;
  categoryEn: string;
  descriptionFr: string;
  descriptionEn: string;
}

const STATIC_WORKS: Array<{
  id: string;
  dataKey: keyof typeof worksData;
  titleKey: keyof (typeof translations)['fr']['oeuvres'];
  categoryKey: keyof (typeof translations)['fr']['oeuvres'];
}> = [
  { id: 'la-symphonie', dataKey: 'La Symphonie', titleKey: 'oeuvreSymphonie', categoryKey: 'filtreSymphonie' },
  { id: 'le-big-bang-de-louise', dataKey: 'Le Big Bang de Louise', titleKey: 'oeuvreBigBang', categoryKey: 'installation' },
  { id: 'mantras', dataKey: 'Mantras', titleKey: 'oeuvreMantras', categoryKey: 'sculpture' },
  { id: 'nun', dataKey: 'Nùn', titleKey: 'oeuvreNun', categoryKey: 'sculpture' },
  { id: 'souvenir-from-earth', dataKey: 'Souvenir from Earth', titleKey: 'oeuvreSouvenir', categoryKey: 'installation' },
  { id: 'speechscape', dataKey: 'Speechscape', titleKey: 'oeuvreSpeechscape', categoryKey: 'installation' },
];

export function buildDefaultOeuvresWorks(): OeuvreItem[] {
  return STATIC_WORKS.map(({ id, dataKey, titleKey, categoryKey }) => {
    const data = worksData[dataKey];
    return {
      id,
      image: data.images[0] ?? '',
      images: data.images,
      titleFr: translations.fr.oeuvres[titleKey],
      titleEn: translations.en.oeuvres[titleKey],
      categoryFr: translations.fr.oeuvres[categoryKey],
      categoryEn: translations.en.oeuvres[categoryKey],
      descriptionFr: richTextToEditorValue(data.description.trim()),
      descriptionEn: richTextToEditorValue(data.description.trim()),
    };
  });
}

export function parseOeuvresWorks(raw: string | null | undefined): OeuvreItem[] {
  if (!raw?.trim()) return buildDefaultOeuvresWorks();
  try {
    const parsed = JSON.parse(raw) as OeuvreItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return buildDefaultOeuvresWorks();
    return parsed.map((work) => ({
      id: work.id,
      image: work.image ?? '',
      images: Array.isArray(work.images) && work.images.length > 0 ? work.images : work.image ? [work.image] : [],
      titleFr: work.titleFr ?? '',
      titleEn: work.titleEn ?? '',
      categoryFr: work.categoryFr ?? '',
      categoryEn: work.categoryEn ?? '',
      descriptionFr: work.descriptionFr ?? '',
      descriptionEn: work.descriptionEn ?? '',
    }));
  } catch {
    return buildDefaultOeuvresWorks();
  }
}

export function serializeOeuvresWorks(works: OeuvreItem[]): string {
  return JSON.stringify(works);
}

export function parseOeuvreFieldKey(key: string): {
  id: string;
  field: 'image' | 'title' | 'category' | 'description';
  lang?: 'fr' | 'en';
} | null {
  const imageMatch = key.match(/^oeuvres\.works\.([a-z0-9-]+)\.image$/);
  if (imageMatch) return { id: imageMatch[1], field: 'image' };

  const match = key.match(/^oeuvres\.works\.([a-z0-9-]+)\.(title|category|description)\.(fr|en)$/);
  if (!match) return null;
  return { id: match[1], field: match[2] as 'title' | 'category' | 'description', lang: match[3] as 'fr' | 'en' };
}

export function isOeuvreFieldKey(key: string): boolean {
  return key === OEUVRES_WORKS_KEY || parseOeuvreFieldKey(key) !== null;
}

export function getOeuvreFieldValue(works: OeuvreItem[], key: string): string | null {
  if (key === OEUVRES_WORKS_KEY) return serializeOeuvresWorks(works);
  const parsed = parseOeuvreFieldKey(key);
  if (!parsed) return null;

  const work = works.find((w) => w.id === parsed.id);
  if (!work) return '';

  if (parsed.field === 'image') return work.image;
  if (parsed.field === 'title') return parsed.lang === 'fr' ? work.titleFr : work.titleEn;
  if (parsed.field === 'category') return parsed.lang === 'fr' ? work.categoryFr : work.categoryEn;
  return parsed.lang === 'fr' ? work.descriptionFr : work.descriptionEn;
}

export function setOeuvreFieldValue(works: OeuvreItem[], key: string, value: string): OeuvreItem[] {
  const parsed = parseOeuvreFieldKey(key);
  if (!parsed) return works;

  return works.map((work) => {
    if (work.id !== parsed.id) return work;
    const next = { ...work };
    if (parsed.field === 'image') {
      next.image = value;
      if (!next.images.length || next.images[0] === work.image) {
        next.images = value ? [value, ...next.images.filter((src) => src !== value)] : next.images;
      }
    } else if (parsed.field === 'title') {
      if (parsed.lang === 'fr') next.titleFr = value;
      else next.titleEn = value;
    } else if (parsed.field === 'category') {
      if (parsed.lang === 'fr') next.categoryFr = value;
      else next.categoryEn = value;
    } else if (parsed.lang === 'fr') next.descriptionFr = value;
    else next.descriptionEn = value;
    return next;
  });
}

export function oeuvreFieldKey(
  id: string,
  field: 'image' | 'title' | 'category' | 'description',
  lang?: 'fr' | 'en'
) {
  if (field === 'image') return `oeuvres.works.${id}.image`;
  return `oeuvres.works.${id}.${field}.${lang ?? 'fr'}`;
}

export function getOeuvreBlockByKey(key: string): ContentBlock | undefined {
  const parsed = parseOeuvreFieldKey(key);
  if (!parsed) {
    if (key === OEUVRES_WORKS_KEY) {
      return {
        key,
        label: 'Liste des oeuvres',
        page: 'oeuvres',
        section: 'works',
        kind: 'text',
        order: 50,
      };
    }
    return undefined;
  }

  const defaults = buildDefaultOeuvresWorks();
  const work = defaults.find((w) => w.id === parsed.id);
  const workLabel = work?.titleFr ?? parsed.id;

  const labelMap: Record<string, string> = {
    image: 'Image',
    title: 'Titre',
    category: 'Categorie',
    description: 'Description',
  };

  const kindMap: Record<string, ContentKind> = {
    image: 'image',
    title: 'text',
    category: 'text',
    description: 'richtext',
  };

  return {
    key,
    label: `${workLabel} — ${labelMap[parsed.field]}`,
    page: 'oeuvres',
    section: 'works',
    kind: kindMap[parsed.field],
    lang: parsed.lang,
    order: 100,
  };
}

export function getOeuvreRegistryBlocks(): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  for (const work of buildDefaultOeuvresWorks()) {
    const imageBlock = getOeuvreBlockByKey(oeuvreFieldKey(work.id, 'image'));
    if (imageBlock) blocks.push(imageBlock);
    for (const lang of ['fr', 'en'] as const) {
      for (const field of ['title', 'category', 'description'] as const) {
        const block = getOeuvreBlockByKey(oeuvreFieldKey(work.id, field, lang));
        if (block) blocks.push(block);
      }
    }
  }
  return blocks;
}

export function oeuvreToWorkData(work: OeuvreItem, lang: 'fr' | 'en') {
  const description = lang === 'fr' ? work.descriptionFr : work.descriptionEn;
  return {
    title: lang === 'fr' ? work.titleFr : work.titleEn,
    category: lang === 'fr' ? work.categoryFr : work.categoryEn,
    description: editorValueToRichText(description),
    images: work.images.length > 0 ? work.images : work.image ? [work.image] : [],
  };
}

export function createEmptyOeuvre(): OeuvreItem {
  return {
    id: `oeuvre-${Date.now()}`,
    image: '',
    images: [],
    titleFr: 'Nouvelle oeuvre',
    titleEn: 'New artwork',
    categoryFr: 'Installation',
    categoryEn: 'Installation',
    descriptionFr: '',
    descriptionEn: '',
  };
}
