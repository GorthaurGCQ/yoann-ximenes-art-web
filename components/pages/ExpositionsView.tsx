'use client';

import { useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import EditableRegion from '@/components/cms/editor/EditableRegion';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCmsContent } from '@/hooks/useCmsContent';
import {
  buildDefaultExpositions,
  createEmptyExposition,
  expositionFieldKey,
  EXPOSITIONS_ITEMS_KEY,
  parseExpositions,
  serializeExpositions,
  type ExpositionBadge,
  type ExpositionItem,
} from '@/lib/cms/expositions';
import { translations } from '@/lib/translations';

const fallback = {
  'translations.fr.expositions.title': translations.fr.expositions.title,
  'translations.en.expositions.title': translations.en.expositions.title,
  'translations.fr.expositions.aVenir': translations.fr.expositions.aVenir,
  'translations.en.expositions.aVenir': translations.en.expositions.aVenir,
  'translations.fr.expositions.enCours': translations.fr.expositions.enCours,
  'translations.en.expositions.enCours': translations.en.expositions.enCours,
  [EXPOSITIONS_ITEMS_KEY]: serializeExpositions(buildDefaultExpositions()),
};

function badgeLabel(badge: ExpositionBadge, v: (key: string) => string, base: string) {
  if (badge === 'aVenir') return v(`${base}.aVenir`);
  if (badge === 'enCours') return v(`${base}.enCours`);
  return null;
}

function ExpositionsContent({
  mode,
  lang,
  v,
  items,
  onAdd,
  onRemove,
  onBadgeChange,
}: {
  mode: 'public' | 'studio';
  lang: 'fr' | 'en';
  v: (key: string) => string;
  items: ExpositionItem[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onBadgeChange?: (id: string, badge: string) => void;
}) {
  const base = `translations.${lang}.expositions`;

  const wrap = (key: string, label: string, node: React.ReactNode) =>
    mode === 'studio' ? (
      <EditableRegion blockKey={key} label={label} kind="text">
        {node}
      </EditableRegion>
    ) : (
      node
    );

  return (
    <main className={mode === 'public' ? 'pt-16 animate-fade-in-up' : 'p-4'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {wrap(
          `${base}.title`,
          'Titre page',
          <h1 className="font-serif text-4xl md:text-5xl mb-16 text-center text-stone-100">{v(`${base}.title`)}</h1>
        )}

        {mode === 'studio' && onAdd && (
          <div className="mb-8 flex justify-end">
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded border border-stone-700 text-stone-200 hover:bg-stone-900"
            >
              <Plus size={16} />
              Ajouter une exposition
            </button>
          </div>
        )}

        <div className="space-y-12">
          {items.map((item) => {
            const title = lang === 'fr' ? item.titleFr : item.titleEn;
            const lieu = lang === 'fr' ? item.lieuFr : item.lieuEn;
            const date = lang === 'fr' ? item.dateFr : item.dateEn;
            const yearKey = expositionFieldKey(item.id, 'year');
            const titleKey = expositionFieldKey(item.id, 'title', lang);
            const lieuKey = expositionFieldKey(item.id, 'lieu', lang);
            const dateKey = expositionFieldKey(item.id, 'date', lang);
            const badgeKey = expositionFieldKey(item.id, 'badge');
            const label = badgeLabel(item.badge, v, base);

            return (
              <article
                key={item.id}
                className="relative flex flex-col md:flex-row md:items-baseline border-b border-accent/20 pb-12 p-4 rounded-lg"
              >
                {mode === 'studio' && onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="absolute top-2 right-2 z-20 p-1.5 rounded bg-stone-900/90 border border-stone-700 text-stone-400 hover:text-red-300"
                    title="Supprimer cette exposition"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div className="md:w-1/4 mb-2 md:mb-0">
                  {mode === 'studio' ? (
                    wrap(
                      yearKey,
                      'Annee',
                      <span className="font-serif text-2xl text-stone-500">{v(yearKey)}</span>
                    )
                  ) : (
                    <span className="font-serif text-2xl text-stone-500">{item.year}</span>
                  )}
                </div>

                <div className="md:w-3/4 flex flex-col md:flex-row md:justify-between md:items-baseline gap-4">
                  <div>
                    {mode === 'studio' ? (
                      wrap(
                        titleKey,
                        'Titre',
                        <h3 className="text-xl font-medium text-stone-200 mb-1">{v(titleKey)}</h3>
                      )
                    ) : (
                      <h3 className="text-xl font-medium text-stone-200 mb-1">{title}</h3>
                    )}
                    {mode === 'studio' ? (
                      wrap(
                        lieuKey,
                        'Lieu',
                        <p className="text-stone-400 italic font-serif">{v(lieuKey)}</p>
                      )
                    ) : (
                      <p className="text-stone-400 italic font-serif">{lieu}</p>
                    )}
                  </div>

                  <div className="mt-2 md:mt-0 md:text-right">
                    {mode === 'studio' ? (
                      wrap(
                        dateKey,
                        'Date',
                        <p className="text-sm text-stone-500 tracking-wide">{v(dateKey)}</p>
                      )
                    ) : (
                      <p className="text-sm text-stone-500 tracking-wide">{date}</p>
                    )}

                    {mode === 'studio' && onBadgeChange ? (
                      <div className="mt-2">
                        <label className="text-[10px] uppercase tracking-wider text-stone-600 block mb-1">
                          Badge
                        </label>
                        <select
                          value={v(badgeKey)}
                          onChange={(e) => onBadgeChange(item.id, e.target.value)}
                          className="text-xs bg-stone-900 border border-stone-700 rounded px-2 py-1 text-stone-300"
                        >
                          <option value="">Aucun</option>
                          <option value="aVenir">{v(`${base}.aVenir`)}</option>
                          <option value="enCours">{v(`${base}.enCours`)}</option>
                        </select>
                      </div>
                    ) : (
                      label && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-widest bg-accent text-stone-950 rounded-[2px]">
                          {label}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function ExpositionsPublicView() {
  const { lang } = useLanguage();
  const cms = useCmsContent(fallback);
  const items = useMemo(() => parseExpositions(cms[EXPOSITIONS_ITEMS_KEY]), [cms]);
  return (
    <ExpositionsContent
      mode="public"
      lang={lang}
      v={(k) => (cms as Record<string, string>)[k] ?? ''}
      items={items}
    />
  );
}

function ExpositionsStudioView() {
  const { lang, getValue, updateDraft, drafts } = useCmsEditor();
  const items = useMemo(() => parseExpositions(drafts[EXPOSITIONS_ITEMS_KEY]), [drafts]);

  const handleAdd = () => {
    updateDraft(
      EXPOSITIONS_ITEMS_KEY,
      serializeExpositions([...items, createEmptyExposition()])
    );
  };

  const handleRemove = (id: string) => {
    updateDraft(
      EXPOSITIONS_ITEMS_KEY,
      serializeExpositions(items.filter((item) => item.id !== id))
    );
  };

  return (
    <ExpositionsContent
      mode="studio"
      lang={lang}
      v={getValue}
      items={items}
      onAdd={handleAdd}
      onRemove={handleRemove}
      onBadgeChange={(id, badge) => updateDraft(expositionFieldKey(id, 'badge'), badge)}
    />
  );
}

export default function ExpositionsView({ mode }: { mode: 'public' | 'studio' }) {
  return mode === 'studio' ? <ExpositionsStudioView /> : <ExpositionsPublicView />;
}
