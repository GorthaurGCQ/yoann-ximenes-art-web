'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CmsPage } from '@/lib/cms/registry';
import { getBlockByKey, getCounterpartKey, getKeysForPage } from '@/lib/cms/registry';
import { getDefaultContentValue } from '@/lib/cms/defaults';
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
  translateBlock: (key: string) => Promise<boolean>;
  hasDirtyChanges: () => boolean;
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

export function CmsEditorProvider({
  children,
  initialPage,
}: {
  children: ReactNode;
  initialPage: CmsPage;
}) {
  const [page, setPage] = useState<CmsPage>(initialPage);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [saved, setSaved] = useState<Record<string, string>>(() => buildInitialContent(initialPage));
  const [drafts, setDrafts] = useState<Record<string, string>>(() => buildInitialContent(initialPage));

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
    (key: string) => drafts[key] ?? saved[key] ?? getDefaultContentValue(key) ?? '',
    [drafts, saved]
  );

  const updateDraft = useCallback((key: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [key]: value }));
  }, []);

  const revertBlock = useCallback(
    (key: string) => {
      setDrafts((prev) => ({ ...prev, [key]: saved[key] ?? '' }));
    },
    [saved]
  );

  const revertAll = useCallback(() => {
    setDrafts({ ...saved });
  }, [saved]);

  const publishBlock = useCallback(
    async (key: string): Promise<boolean> => {
      const block = getBlockByKey(key);
      if (!block) return false;
      const raw = drafts[key] ?? saved[key] ?? '';
      const value = valueForSave(key, raw, block.kind);

      const response = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, kind: block.kind }),
      });

      if (!response.ok) return false;
      setSaved((prev) => ({ ...prev, [key]: raw }));
      return true;
    },
    [drafts, saved]
  );

  const publishAll = useCallback(async (): Promise<boolean> => {
    const updates = Array.from(dirtyKeys)
      .map((key) => {
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

  const translateBlock = useCallback(
    async (key: string): Promise<boolean> => {
      const block = getBlockByKey(key);
      const targetKey = getCounterpartKey(key);
      const targetBlock = targetKey ? getBlockByKey(targetKey) : null;
      if (!block?.lang || !targetKey || !targetBlock) return false;

      const sourceText = drafts[key] ?? saved[key] ?? '';
      const sourceLang = block.lang === 'fr' ? 'FR' : 'EN';
      const targetLang = block.lang === 'fr' ? 'EN' : 'FR';

      const translateResponse = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, sourceLang, targetLang }),
      });

      if (!translateResponse.ok) return false;
      const data = (await translateResponse.json()) as { translatedText?: string };
      const translated = data.translatedText ?? '';
      updateDraft(targetKey, translated);

      const value = valueForSave(targetKey, translated, targetBlock.kind);
      const saveResponse = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: targetKey, value, kind: targetBlock.kind }),
      });

      if (!saveResponse.ok) return false;
      setSaved((prev) => ({ ...prev, [targetKey]: translated }));
      return true;
    },
    [drafts, saved, updateDraft]
  );

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
      translateBlock,
      hasDirtyChanges: () => dirtyKeys.size > 0,
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
      translateBlock,
    ]
  );

  return <CmsEditorContext.Provider value={value}>{children}</CmsEditorContext.Provider>;
}

export function useCmsEditor() {
  const ctx = useContext(CmsEditorContext);
  if (!ctx) throw new Error('useCmsEditor must be used inside CmsEditorProvider');
  return ctx;
}
