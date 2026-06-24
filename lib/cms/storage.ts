import 'server-only';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { getDefaultContentValue } from '@/lib/cms/defaults';
import type { CmsStore, ContentEntry, ContentKind } from '@/lib/cms/types';

const CMS_DATA_PATH = join(process.cwd(), 'data', 'cms-store.json');
const BLOB_PATHNAME = 'cms-store.json';

const initialStore: CmsStore = {
  entries: {},
  logs: [],
};

function usesBlob(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

// URL publique du blob, mise en cache après la première écriture
let cachedBlobUrl: string | null = null;

async function readStore(): Promise<CmsStore> {
  if (usesBlob()) {
    // Récupérer l'URL depuis le cache ou via list() au cold start
    if (!cachedBlobUrl) {
      const { list } = await import('@vercel/blob');
      const { blobs } = await list({ prefix: BLOB_PATHNAME });
      const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME);
      if (!blob) return initialStore;
      cachedBlobUrl = blob.url;
    }

    const res = await fetch(cachedBlobUrl, { cache: 'no-store' });
    if (!res.ok) return initialStore;
    const parsed = (await res.json()) as CmsStore;
    return {
      entries: parsed.entries ?? {},
      logs: parsed.logs ?? [],
    };
  }

  // Fallback filesystem local (développement sans BLOB_READ_WRITE_TOKEN)
  try {
    const raw = await readFile(CMS_DATA_PATH, 'utf8');
    const parsed = JSON.parse(raw) as CmsStore;
    return {
      entries: parsed.entries ?? {},
      logs: parsed.logs ?? [],
    };
  } catch {
    await ensureFileStore(initialStore);
    return initialStore;
  }
}

async function ensureFileStore(store: CmsStore): Promise<void> {
  await mkdir(join(process.cwd(), 'data'), { recursive: true });
  await writeFile(CMS_DATA_PATH, JSON.stringify(store, null, 2), 'utf8');
}

async function writeStore(store: CmsStore): Promise<void> {
  if (usesBlob()) {
    const { put } = await import('@vercel/blob');
    const blob = await put(BLOB_PATHNAME, JSON.stringify(store), {
      access: 'public',
      addRandomSuffix: false,
    });
    cachedBlobUrl = blob.url;
    return;
  }

  await ensureFileStore(store);
}

export async function getContentValue(key: string): Promise<string | null> {
  const store = await readStore();
  const existing = store.entries[key];
  if (existing) return existing.value;
  return getDefaultContentValue(key);
}

export async function getContentValues(keys: string[]): Promise<Record<string, string>> {
  const values = await Promise.all(
    keys.map(async (key) => {
      const value = await getContentValue(key);
      return [key, value] as const;
    })
  );

  return values.reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string') acc[key] = value;
    return acc;
  }, {});
}

export async function setContentValue(params: {
  key: string;
  value: string;
  kind: ContentKind;
  updatedBy: string;
}): Promise<ContentEntry> {
  const store = await readStore();
  const now = new Date().toISOString();
  const previousValue = store.entries[params.key]?.value ?? (await getContentValue(params.key)) ?? '';

  const entry: ContentEntry = {
    key: params.key,
    kind: params.kind,
    value: params.value,
    updatedAt: now,
    updatedBy: params.updatedBy,
  };

  store.entries[params.key] = entry;
  store.logs.unshift({
    id: randomUUID(),
    key: params.key,
    oldValue: previousValue,
    newValue: params.value,
    updatedAt: now,
    updatedBy: params.updatedBy,
  });

  if (store.logs.length > 500) {
    store.logs.length = 500;
  }

  await writeStore(store);
  return entry;
}

export async function getRecentLogs(limit = 50) {
  const store = await readStore();
  return store.logs.slice(0, limit);
}
