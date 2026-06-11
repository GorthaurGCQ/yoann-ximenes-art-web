'use client';

import type { CmsPage } from '@/lib/cms/registry';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import ArtisteView from '@/components/pages/ArtisteView';
import HomeView from '@/components/pages/HomeView';
import OeuvresView from '@/components/pages/OeuvresView';
import ExpositionsView from '@/components/pages/ExpositionsView';
import ActualitesView from '@/components/pages/ActualitesView';
import ContactView from '@/components/pages/ContactView';

const VIEWS: Record<CmsPage, React.ComponentType<{ mode: 'studio' }>> = {
  accueil: HomeView,
  artiste: ArtisteView,
  oeuvres: OeuvresView,
  expositions: ExpositionsView,
  actualites: ActualitesView,
  contact: ContactView,
};

export default function PageCanvas({ page }: { page: CmsPage }) {
  const { selectBlock } = useCmsEditor();
  const View = VIEWS[page];

  return (
    <div
      className="flex-[2] min-w-0 overflow-auto bg-stone-900/90 p-4 md:p-8"
      onClick={() => selectBlock(null)}
    >
      <div className="mx-auto w-full max-w-[1320px] min-h-full bg-stone-950 shadow-2xl border border-stone-800/80 rounded-xl overflow-hidden">
        <div className="min-h-full text-stone-100">
          <View mode="studio" />
        </div>
      </div>
    </div>
  );
}
