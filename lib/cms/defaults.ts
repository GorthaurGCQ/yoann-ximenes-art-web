import {
  buildDefaultExpositions,
  EXPOSITIONS_ITEMS_KEY,
  serializeExpositions,
} from '@/lib/cms/expositions';
import { serializeOeuvresWorks, buildDefaultOeuvresWorks, OEUVRES_WORKS_KEY } from '@/lib/cms/oeuvres';
import { translations } from '@/lib/translations';
import { worksData } from '@/lib/worksData';

function getByPath(source: unknown, path: string[]): unknown {
  return path.reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[part];
  }, source);
}

export function getDefaultContentValue(key: string): string | null {
  if (key.startsWith('translations.')) {
    const parts = key.split('.');
    const value = getByPath(translations, parts.slice(1));
    return typeof value === 'string' ? value : null;
  }

  if (key.startsWith('worksData.')) {
    const parts = key.split('.');
    const value = getByPath(worksData, parts.slice(1));
    return typeof value === 'string' ? value : null;
  }

  const staticDefaults: Record<string, string> = {
    'artiste.profileImage.src': '/Images/yoann-ximenes-portrait.jpeg',
    'artiste.profileImage.alt': "Portrait de l'artiste",
    'accueil.expoImage.src': '/Images/Oeuvres/Speechscape/speechscape_1.jpg',
    'actualites.instagramImage1.src':
      '/Images/Oeuvres/La_symphony/1.XimenesYoann,La symphonie des vagabonds.jpg',
    'actualites.instagramImage2.src': '/Images/Oeuvres/Le Big Bang de Louise/Le Big Bang de Louise.jpg',
    'actualites.instagramImage3.src': '/Images/Oeuvres/Mantras/1.Mantras.jpg',
    [OEUVRES_WORKS_KEY]: serializeOeuvresWorks(buildDefaultOeuvresWorks()),
    [EXPOSITIONS_ITEMS_KEY]: serializeExpositions(buildDefaultExpositions()),
  };

  return staticDefaults[key] ?? null;
}
