'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import CmsImage from '@/components/cms/CmsImage';
import EditableRegion from '@/components/cms/editor/EditableRegion';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCmsContent } from '@/hooks/useCmsContent';
import {
  buildDefaultOeuvresWorks,
  oeuvreFieldKey,
  oeuvreToWorkData,
  OEUVRES_WORKS_KEY,
  parseOeuvresWorks,
  serializeOeuvresWorks,
  type OeuvreItem,
} from '@/lib/cms/oeuvres';
import { translations } from '@/lib/translations';
import { richTextToEditorValue } from '@/lib/cms/richText';
import WorkModal from '@/components/WorkModal';

const fallback = {
  'translations.fr.oeuvres.title': translations.fr.oeuvres.title,
  'translations.en.oeuvres.title': translations.en.oeuvres.title,
  [OEUVRES_WORKS_KEY]: serializeOeuvresWorks(buildDefaultOeuvresWorks()),
};

function descriptionPreview(html: string) {
  const text = richTextToEditorValue(html).trim();
  if (!text) return 'Cliquez pour ajouter une description...';
  return text.length > 160 ? `${text.slice(0, 160)}...` : text;
}

function OeuvresContent({
  mode,
  lang,
  v,
  works,
  onAddWork,
  onRemoveWork,
}: {
  mode: 'public' | 'studio';
  lang: 'fr' | 'en';
  v: (key: string) => string;
  works: OeuvreItem[];
  onAddWork?: () => void;
  onRemoveWork?: (id: string) => void;
}) {
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const base = `translations.${lang}.oeuvres`;

  const wrap = (key: string, label: string, kind: 'text' | 'richtext' | 'image', node: React.ReactNode) =>
    mode === 'studio' ? (
      <EditableRegion blockKey={key} label={label} kind={kind}>
        {node}
      </EditableRegion>
    ) : (
      node
    );

  const selectedWork = works.find((work) => work.id === selectedWorkId) ?? null;
  const modalData = selectedWork ? oeuvreToWorkData(selectedWork, lang) : null;

  return (
    <main className={mode === 'public' ? 'pt-16 animate-fade-in-up' : 'p-4'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {wrap(
          `${base}.title`,
          'Titre page',
          'text',
          <h1 className="font-serif text-4xl md:text-5xl mb-12 text-center text-stone-100">{v(`${base}.title`)}</h1>
        )}

        {mode === 'studio' && onAddWork && (
          <div className="mb-8 flex justify-end">
            <button
              type="button"
              onClick={onAddWork}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded border border-stone-700 text-stone-200 hover:bg-stone-900"
            >
              <Plus size={16} />
              Ajouter une oeuvre
            </button>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-8">
          {works.map((work) => {
            const titleKey = oeuvreFieldKey(work.id, 'title', lang);
            const categoryKey = oeuvreFieldKey(work.id, 'category', lang);
            const descriptionKey = oeuvreFieldKey(work.id, 'description', lang);
            const imageKey = oeuvreFieldKey(work.id, 'image');
            const title = lang === 'fr' ? work.titleFr : work.titleEn;
            const category = lang === 'fr' ? work.categoryFr : work.categoryEn;
            const description = lang === 'fr' ? work.descriptionFr : work.descriptionEn;

            return (
              <article
                key={work.id}
                className={`group relative w-full max-w-[360px] rounded-lg border border-stone-800/80 bg-stone-950/40 p-3 ${
                  mode === 'public' ? 'cursor-pointer' : ''
                }`}
                onClick={mode === 'public' ? () => setSelectedWorkId(work.id) : undefined}
              >
                {mode === 'studio' && onRemoveWork && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveWork(work.id);
                    }}
                    className="absolute top-2 right-2 z-20 p-1.5 rounded bg-stone-900/90 border border-stone-700 text-stone-400 hover:text-red-300"
                    title="Supprimer cette oeuvre"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div className="relative aspect-square bg-stone-900 overflow-hidden mb-4 border border-stone-800 rounded-sm">
                  {mode === 'studio' ? (
                    wrap(
                      imageKey,
                      'Image de couverture',
                      'image',
                      <CmsImage
                        src={v(imageKey)}
                        alt={title}
                        fill
                        className="object-cover opacity-90 group-hover:opacity-100"
                        sizes="33vw"
                      />
                    )
                  ) : (
                    <CmsImage
                      src={work.image}
                      alt={title}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100"
                      sizes="33vw"
                    />
                  )}
                </div>

                <div className="text-center space-y-2">
                  {mode === 'studio' ? (
                    wrap(
                      titleKey,
                      'Titre',
                      'text',
                      <h3 className="font-serif text-xl text-stone-200 italic">{v(titleKey)}</h3>
                    )
                  ) : (
                    <h3 className="font-serif text-xl text-stone-200 italic">{title}</h3>
                  )}

                  {mode === 'studio' ? (
                    wrap(
                      categoryKey,
                      'Categorie',
                      'text',
                      <p className="text-stone-500 text-xs uppercase tracking-wider">{v(categoryKey)}</p>
                    )
                  ) : (
                    <p className="text-stone-500 text-xs uppercase tracking-wider">{category}</p>
                  )}

                  {mode === 'studio' ? (
                    wrap(
                      descriptionKey,
                      'Description',
                      'richtext',
                      <p className="text-stone-400 text-sm font-light leading-relaxed text-left min-h-[3rem] px-1">
                        {descriptionPreview(v(descriptionKey))}
                      </p>
                    )
                  ) : (
                    <p className="text-stone-400 text-sm font-light leading-relaxed text-left line-clamp-3">
                      {descriptionPreview(description)}
                    </p>
                  )}

                  {mode === 'studio' && (
                    <button
                      type="button"
                      onClick={() => setSelectedWorkId(work.id)}
                      className="text-xs text-stone-500 hover:text-stone-300 underline underline-offset-2"
                    >
                      Apercu detaille
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <WorkModal data={modalData} onClose={() => setSelectedWorkId(null)} />
    </main>
  );
}

function OeuvresPublicView() {
  const { lang } = useLanguage();
  const cms = useCmsContent(fallback);
  const works = useMemo(() => parseOeuvresWorks(cms[OEUVRES_WORKS_KEY]), [cms]);
  return <OeuvresContent mode="public" lang={lang} v={(k) => (cms as Record<string, string>)[k] ?? ''} works={works} />;
}

function OeuvresStudioView() {
  const { lang, getValue, getOeuvresWorks, addOeuvre, removeOeuvre } = useCmsEditor();
  const works = getOeuvresWorks();
  return (
    <OeuvresContent
      mode="studio"
      lang={lang}
      v={getValue}
      works={works}
      onAddWork={addOeuvre}
      onRemoveWork={removeOeuvre}
    />
  );
}

export default function OeuvresView({ mode }: { mode: 'public' | 'studio' }) {
  return mode === 'studio' ? <OeuvresStudioView /> : <OeuvresPublicView />;
}
