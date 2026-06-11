'use client';

import { useEffect } from 'react';
import type { CmsPage } from '@/lib/cms/registry';
import { getKeysForPage } from '@/lib/cms/registry';
import { getDefaultContentValue } from '@/lib/cms/defaults';
import { CmsEditorProvider, useCmsEditor } from '@/contexts/CmsEditorContext';
import StudioToolbar from './StudioToolbar';
import UnsavedChangesBar from './UnsavedChangesBar';
import PageCanvas from './PageCanvas';
import InspectorPanel from './InspectorPanel';
import SearchPalette from './SearchPalette';

function StudioContentLoader({ page }: { page: CmsPage }) {
  const { initContent, setPage } = useCmsEditor();

  useEffect(() => {
    setPage(page);
  }, [page, setPage]);

  useEffect(() => {
    const keys = getKeysForPage(page);
    const fallbacks = keys.reduce<Record<string, string>>((acc, key) => {
      acc[key] = getDefaultContentValue(key) ?? '';
      return acc;
    }, {});

    initContent(fallbacks);

    const load = async () => {
      const params = new URLSearchParams({ keys: keys.join(',') });
      const response = await fetch(`/api/cms/content?${params}`);
      if (!response.ok) return;
      const data = (await response.json()) as { values?: Record<string, string> };
      initContent({ ...fallbacks, ...data.values });
    };

    load().catch(() => {});
  }, [page, initContent]);

  return (
    <>
      <div className="md:hidden flex flex-col items-center justify-center min-h-screen bg-stone-950 text-stone-300 px-6 text-center">
        <p className="font-serif text-xl mb-2">Studio X9</p>
        <p className="text-sm text-stone-500">
          L&apos;editeur visuel necessite une tablette ou un ordinateur (ecran &ge; 768px).
        </p>
      </div>
      <div className="hidden md:flex flex-col h-screen bg-stone-950">
        <StudioToolbar />
        <UnsavedChangesBar />
        <div className="flex flex-1 min-h-0">
          <PageCanvas page={page} />
          <InspectorPanel />
        </div>
        <SearchPalette />
      </div>
    </>
  );
}

export default function StudioShell({ page }: { page: CmsPage }) {
  return (
    <CmsEditorProvider initialPage={page}>
      <StudioContentLoader page={page} />
    </CmsEditorProvider>
  );
}
