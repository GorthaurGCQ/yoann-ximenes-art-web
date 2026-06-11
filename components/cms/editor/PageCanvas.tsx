'use client';

import type { CmsPage } from '@/lib/cms/registry';
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
  const View = VIEWS[page];

  return (
    <div className="flex-1 overflow-auto bg-stone-950" onClick={() => {}}>
      <div className="min-h-full text-stone-100">
        <View mode="studio" />
      </div>
    </div>
  );
}
