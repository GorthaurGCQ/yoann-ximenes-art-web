'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CmsPage } from '@/lib/cms/registry';
import { getBlockByKey, getCounterpartKey, getKeysForPage } from '@/lib/cms/registry';
import { getDefaultContentValue } from '@/lib/cms/defaults';
import {
  createEmptyExposition,
  EXPOSITIONS_ITEMS_KEY,
  getExpositionFieldValue,
  isExpositionFieldKey,
  parseExpositions,
  serializeExpositions,
  setExpositionFieldValue,
  type ExpositionItem,
} from '@/lib/cms/expositions';
import {
  createEmptyOeuvre,
  getOeuvreFieldValue,
  isOeuvreFieldKey,
  OEUVRES_WORKS_KEY,
  parseOeuvresWorks,
  serializeOeuvresWorks,
  setOeuvreFieldValue,
  type OeuvreItem,
} from '@/lib/cms/oeuvres';
import { editorValueToRichText } from '@/lib/cms/richText';
import type { ContentKind } from '@/lib/cms/types';

interface CmsEditorContextValue {
  page: CmsPage;
  lang: 'fr' | 'en';
  selectedKey: string | null;
  saved: Record<string, string>;
  drafts: Record<string, string>;
  dirtyKeys: Set<string>;
  dirtyCount: number;
  setPage: (page: CmsPage) => void;
  setLang: (lang: 'fr' | 'en') => void;
  selectBlock: (key: string | null) => void;
  initContent: (values: Record<string, string>) => void;
  getValue: (key: string) => string;
  updateDraft: (key: string, value: string) => void;
  revertBlock: (key: string) => void;
  revertAll: () => void;
  publishBlock: (key: string) => Promise<boolean>;
  publishAll: () => Promise<boolean>;
  hasDirtyChanges: () => boolean;
  isBlockDirty: (key: string) => boolean;
  getOeuvresWorks: () => OeuvreItem[];
  addOeuvre: () => void;
  removeOeuvre: (id: string) => void;
  getExpositions: () => ExpositionItem[];
  addExposition: () => void;
  removeExposition: (id: string) => void;
}

const CmsEditorContext = createContext<CmsEditorContextValue | null>(null);

function buildInitialContent(page: CmsPage): Record<string, string> {
  return getKeysForPage(page).reduce<Record<string, string>>((acc, key) => {
    acc[key] = getDefaultContentValue(key) ?? '';
    return acc;
  }, {});
}

function valueForSave(key: string, value: string, kind: ContentKind): string {
  return kind === 'richtext' ? editorValueToRichText(value) : value;
}

function resolveStorageKey(key: string): string {
  if (isOeuvreFieldKey(key) && key !== OEUVRES_WORKS_KEY) return OEUVRES_WORKS_KEY;
  if (isExpositionFieldKey(key) && key !== EXPOSITIONS_ITEMS_KEY) return EXPOSITIONS_ITEMS_KEY;
  return key;
}

function readWorksJson(source: Record<string, string>): string {
  return source[OEUVRES_WORKS_KEY] ?? getDefaultContentValue(OEUVRES_WORKS_KEY) ?? serializeOeuvresWorks([]);
}

function readExpositionsJson(source: Record<string, string>): string {
  return (
    source[EXPOSITIONS_ITEMS_KEY] ??
    getDefaultContentValue(EXPOSITIONS_ITEMS_KEY) ??
    serializeExpositions([])
  );
}

export function CmsEditorProvider({
  children,
  initialPage,
}: {
  children: ReactNode;
  initialPage: CmsPage;
}) {
  const [page, setPage] = useState<CmsPage>(initialPage);
  const [lang, setLangState] = useState<'fr' | 'en'>('fr');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [saved, setSaved] = useState<Record<string, string>>(() => buildInitialContent(initialPage));
  const [drafts, setDrafts] = useState<Record<string, string>>(() => buildInitialContent(initialPage));

  useEffect(() => {
    const stored = localStorage.getItem('language');
    if (stored === 'fr' || stored === 'en') {
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((next: 'fr' | 'en') => {
    setLangState(next);
    localStorage.setItem('language', next);
  }, []);

  const dirtyKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const key of Object.keys(drafts)) {
      if (drafts[key] !== saved[key]) keys.add(key);
    }
    return keys;
  }, [drafts, saved]);

  const initContent = useCallback((values: Record<string, string>) => {
    setSaved(values);
    setDrafts(values);
  }, []);

  const getValue = useCallback(
    (key: string) => {
      if (isOeuvreFieldKey(key)) {
        const works = parseOeuvresWorks(readWorksJson(drafts));
        return getOeuvreFieldValue(works, key) ?? '';
      }
      if (isExpositionFieldKey(key)) {
        const items = parseExpositions(readExpositionsJson(drafts));
        return getExpositionFieldValue(items, key) ?? '';
      }
      return drafts[key] ?? saved[key] ?? getDefaultContentValue(key) ?? '';
    },
    [drafts, saved]
  );

  const updateDraft = useCallback((key: string, value: string) => {
    if (isOeuvreFieldKey(key) && key !== OEUVRES_WORKS_KEY) {
      setDrafts((prev) => {
        const works = parseOeuvresWorks(readWorksJson(prev));
        return {
          ...prev,
          [OEUVRES_WORKS_KEY]: serializeOeuvresWorks(setOeuvreFieldValue(works, key, value)),
        };
      });
      return;
    }
    if (isExpositionFieldKey(key) && key !== EXPOSITIONS_ITEMS_KEY) {
      setDrafts((prev) => {
        const items = parseExpositions(readExpositionsJson(prev));
        return {
          ...prev,
          [EXPOSITIONS_ITEMS_KEY]: serializeExpositions(setExpositionFieldValue(items, key, value)),
        };
      });
      return;
    }
    setDrafts((prev) => ({ ...prev, [key]: value }));
  }, []);

  const revertBlock = useCallback(
    (key: string) => {
      if (isOeuvreFieldKey(key)) {
        setDrafts((prev) => ({
          ...prev,
          [OEUVRES_WORKS_KEY]: saved[OEUVRES_WORKS_KEY] ?? readWorksJson(saved),
        }));
        return;
      }
      if (isExpositionFieldKey(key)) {
        setDrafts((prev) => ({
          ...prev,
          [EXPOSITIONS_ITEMS_KEY]: saved[EXPOSITIONS_ITEMS_KEY] ?? readExpositionsJson(saved),
        }));
        return;
      }
      setDrafts((prev) => ({ ...prev, [key]: saved[key] ?? '' }));
    },
    [saved]
  );

  const getOeuvresWorks = useCallback(
    () => parseOeuvresWorks(readWorksJson(drafts)),
    [drafts]
  );

  const addOeuvre = useCallback(() => {
    setDrafts((prev) => {
      const works = parseOeuvresWorks(readWorksJson(prev));
      return {
        ...prev,
        [OEUVRES_WORKS_KEY]: serializeOeuvresWorks([...works, createEmptyOeuvre()]),
      };
    });
  }, []);

  const removeOeuvre = useCallback((id: string) => {
    setDrafts((prev) => {
      const works = parseOeuvresWorks(readWorksJson(prev));
      return {
        ...prev,
        [OEUVRES_WORKS_KEY]: serializeOeuvresWorks(works.filter((work) => work.id !== id)),
      };
    });
  }, []);

  const getExpositions = useCallback(
    () => parseExpositions(readExpositionsJson(drafts)),
    [drafts]
  );

  const addExposition = useCallback(() => {
    setDrafts((prev) => {
      const items = parseExpositions(readExpositionsJson(prev));
      return {
        ...prev,
        [EXPOSITIONS_ITEMS_KEY]: serializeExpositions([...items, createEmptyExposition()]),
      };
    });
  }, []);

  const removeExposition = useCallback((id: string) => {
    setDrafts((prev) => {
      const items = parseExpositions(readExpositionsJson(prev));
      return {
        ...prev,
        [EXPOSITIONS_ITEMS_KEY]: serializeExpositions(items.filter((item) => item.id !== id)),
      };
    });
  }, []);

  const isBlockDirty = useCallback(
    (key: string) => {
      if (isOeuvreFieldKey(key)) return dirtyKeys.has(OEUVRES_WORKS_KEY);
      if (isExpositionFieldKey(key)) return dirtyKeys.has(EXPOSITIONS_ITEMS_KEY);
      return dirtyKeys.has(key);
    },
    [dirtyKeys]
  );

  const revertAll = useCallback(() => {
    setDrafts({ ...saved });
  }, [saved]);

  const publishBlock = useCallback(
    async (key: string): Promise<boolean> => {
      const storageKey = resolveStorageKey(key);
      const block = getBlockByKey(key);
      if (!block) return false;
      const raw = drafts[storageKey] ?? saved[storageKey] ?? '';
      const isJsonCollection = storageKey === OEUVRES_WORKS_KEY || storageKey === EXPOSITIONS_ITEMS_KEY;
      const value = isJsonCollection ? raw : valueForSave(key, getValue(key), block.kind);

      const response = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: storageKey,
          value,
          kind: isJsonCollection ? 'text' : block.kind,
        }),
      });

      if (!response.ok) return false;
      setSaved((prev) => ({ ...prev, [storageKey]: drafts[storageKey] ?? raw }));
      return true;
    },
    [drafts, saved, getValue]
  );

  const publishAll = useCallback(async (): Promise<boolean> => {
    const updates = Array.from(dirtyKeys)
      .map((key) => {
        if (key === OEUVRES_WORKS_KEY || key === EXPOSITIONS_ITEMS_KEY) {
          return { key, value: drafts[key] ?? '', kind: 'text' as ContentKind };
        }
        const block = getBlockByKey(key);
        if (!block) return null;
        const raw = drafts[key] ?? '';
        return {
          key,
          value: valueForSave(key, raw, block.kind),
          kind: block.kind,
        };
      })
      .filter(Boolean);

    if (updates.length === 0) return true;

    const response = await fetch('/api/admin/content/batch', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    });

    if (!response.ok) return false;

    setSaved((prev) => {
      const next = { ...prev };
      for (const key of dirtyKeys) {
        next[key] = drafts[key] ?? '';
      }
      return next;
    });
    return true;
  }, [dirtyKeys, drafts]);

  const value = useMemo(
    () => ({
      page,
      lang,
      selectedKey,
      saved,
      drafts,
      dirtyKeys,
      dirtyCount: dirtyKeys.size,
      setPage,
      setLang,
      selectBlock: setSelectedKey,
      initContent,
      getValue,
      updateDraft,
      revertBlock,
      revertAll,
      publishBlock,
      publishAll,
      hasDirtyChanges: () => dirtyKeys.size > 0,
      isBlockDirty,
      getOeuvresWorks,
      addOeuvre,
      removeOeuvre,
      getExpositions,
      addExposition,
      removeExposition,
    }),
    [
      page,
      lang,
      selectedKey,
      saved,
      drafts,
      dirtyKeys,
      initContent,
      getValue,
      updateDraft,
      revertBlock,
      revertAll,
      publishBlock,
      publishAll,
      isBlockDirty,
      getOeuvresWorks,
      addOeuvre,
      removeOeuvre,
      getExpositions,
      addExposition,
      removeExposition,
    ]
  );

  return <CmsEditorContext.Provider value={value}>{children}</CmsEditorContext.Provider>;
}

export function useCmsEditor() {
  const ctx = useContext(CmsEditorContext);
  if (!ctx) throw new Error('useCmsEditor must be used inside CmsEditorProvider');
  return ctx;
}
