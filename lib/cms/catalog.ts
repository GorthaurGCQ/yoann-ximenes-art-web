import 'server-only';

import { translations } from '@/lib/translations';
import { worksData } from '@/lib/worksData';
import { getContentValues } from '@/lib/cms/storage';
import type { ContentKind } from '@/lib/cms/types';

function flattenStringLeaves(
  source: unknown,
  prefix: string,
  acc: string[] = []
): string[] {
  if (typeof source === 'string') {
    acc.push(prefix);
    return acc;
  }

  if (Array.isArray(source)) {
    source.forEach((item, index) => {
      flattenStringLeaves(item, `${prefix}.${index}`, acc);
    });
    return acc;
  }

  if (source && typeof source === 'object') {
    Object.entries(source).forEach(([key, value]) => {
      flattenStringLeaves(value, `${prefix}.${key}`, acc);
    });
  }

  return acc;
}

function kindFromKey(key: string, value: string): ContentKind {
  if (key.endsWith('.src') || value.startsWith('/Images/') || value.startsWith('http')) {
    return 'image';
  }
  if (value.includes('<p>') || value.includes('<br>')) return 'richtext';
  return 'text';
}

export async function getCmsCatalog() {
  const staticKeys = ['artiste.profileImage.src', 'artiste.profileImage.alt'];
  const translationKeys = flattenStringLeaves(translations, 'translations');
  const workKeys = flattenStringLeaves(worksData, 'worksData');
  const allKeys = [...staticKeys, ...translationKeys, ...workKeys];

  const uniqueKeys = Array.from(new Set(allKeys)).sort();
  const values = await getContentValues(uniqueKeys);

  return uniqueKeys.map((key) => {
    const value = values[key] ?? '';
    return {
      key,
      value,
      kind: kindFromKey(key, value),
    };
  });
}
