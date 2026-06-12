'use client';

import { ArrowUpRight } from 'lucide-react';
import CmsImage from '@/components/cms/CmsImage';
import InstagramIcon from '@/components/icons/InstagramIcon';
import EditableRegion from '@/components/cms/editor/EditableRegion';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCmsContent } from '@/hooks/useCmsContent';
import { translations } from '@/lib/translations';

const INSTAGRAM_IMAGE_KEYS = [
  'actualites.instagramImage1.src',
  'actualites.instagramImage2.src',
  'actualites.instagramImage3.src',
] as const;

const keys = [
  'title',
  'dernieresPublications',
  'lireSuite',
  'presse',
  'evenement',
  'article1Date',
  'article1Categorie',
  'article1Titre',
  'article1Desc',
  'article1LienTexte',
  'article1Lien',
  'article2Date',
  'article2Categorie',
  'article2Titre',
  'article2Desc',
  'article2LienTexte',
  'article2Lien',
  'article3Date',
  'article3Categorie',
  'article3Titre',
  'article3Desc',
  'article3LienTexte',
  'article3Lien',
  'instagram',
  'suivre',
] as const;

const articles = [
  {
    dateKey: 'article1Date',
    categorieKey: 'article1Categorie',
    titleKey: 'article1Titre',
    descKey: 'article1Desc',
    lienTexteKey: 'article1LienTexte',
    lienKey: 'article1Lien',
  },
  {
    dateKey: 'article2Date',
    categorieKey: 'article2Categorie',
    titleKey: 'article2Titre',
    descKey: 'article2Desc',
    lienTexteKey: 'article2LienTexte',
    lienKey: 'article2Lien',
  },
  {
    dateKey: 'article3Date',
    categorieKey: 'article3Categorie',
    titleKey: 'article3Titre',
    descKey: 'article3Desc',
    lienTexteKey: 'article3LienTexte',
    lienKey: 'article3Lien',
  },
] as const;

function ArticleLink({
  mode,
  base,
  lienTexteKey,
  lienKey,
  v,
  wrap,
}: {
  mode: 'public' | 'studio';
  base: string;
  lienTexteKey: string;
  lienKey: string;
  v: (key: string) => string;
  wrap: (key: string, label: string, kind: 'text' | 'richtext' | 'image', node: React.ReactNode) => React.ReactNode;
}) {
  const href = v(`${base}.${lienKey}`).trim() || '#';
  const label = v(`${base}.${lienTexteKey}`).trim() || v(`${base}.lireSuite`);
  const linkClass =
    'inline-flex items-center text-sm font-medium text-stone-200 hover:underline decoration-1 underline-offset-4 decoration-stone-500';

  if (mode === 'studio') {
    return (
      <div className="space-y-2">
        {wrap(
          `${base}.${lienTexteKey}`,
          'Texte du lien',
          'text',
          <span className={linkClass}>
            {label}
            <ArrowUpRight size={16} className="ml-1 shrink-0" />
          </span>
        )}
        {wrap(
          `${base}.${lienKey}`,
          'URL du lien',
          'text',
          <span className="text-xs text-stone-500 font-mono break-all">{href}</span>
        )}
      </div>
    );
  }

  if (!href || href === '#') return null;

  return (
    <a href={href} className={linkClass}>
      {label}
      <ArrowUpRight size={16} className="ml-1 shrink-0" />
    </a>
  );
}

function buildFallback() {
  const fb: Record<string, string> = {};
  for (const lang of ['fr', 'en'] as const) {
    for (const k of keys) {
      fb[`translations.${lang}.actualites.${k}`] = translations[lang].actualites[k];
    }
  }
  fb['actualites.instagramImage1.src'] =
    '/Images/Oeuvres/La_symphony/1.XimenesYoann,La symphonie des vagabonds.jpg';
  fb['actualites.instagramImage2.src'] = '/Images/Oeuvres/Le Big Bang de Louise/Le Big Bang de Louise.jpg';
  fb['actualites.instagramImage3.src'] = '/Images/Oeuvres/Mantras/1.Mantras.jpg';
  return fb;
}

const fallback = buildFallback();

function ActualitesContent({
  mode,
  lang,
  v,
}: {
  mode: 'public' | 'studio';
  lang: 'fr' | 'en';
  v: (k: string) => string;
}) {
  const base = `translations.${lang}.actualites`;
  const wrap = (key: string, label: string, kind: 'text' | 'richtext' | 'image', node: React.ReactNode) =>
    mode === 'studio' ? (
      <EditableRegion blockKey={key} label={label} kind={kind}>
        {node}
      </EditableRegion>
    ) : (
      node
    );

  return (
    <main className={mode === 'public' ? 'pt-16 animate-fade-in-up' : 'p-4'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {wrap(
          `${base}.title`,
          'Titre',
          'text',
          <h1 className="font-serif text-4xl md:text-5xl mb-16 text-center text-stone-100">{v(`${base}.title`)}</h1>
        )}

        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            <div className="lg:col-span-2">
              {wrap(
                `${base}.dernieresPublications`,
                'Titre publications',
                'text',
                <h2 className="font-serif text-2xl border-b border-stone-800 pb-4 text-stone-200">
                  {v(`${base}.dernieresPublications`)}
                </h2>
              )}
            </div>
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              {wrap(
                `${base}.instagram`,
                'Instagram',
                'text',
                <h2 className="font-serif text-2xl text-stone-200">{v(`${base}.instagram`)}</h2>
              )}
              <InstagramIcon size={20} />
            </div>
          </div>

          {articles.map(({ dateKey, categorieKey, titleKey, descKey, lienTexteKey, lienKey }, index) => {
            const imageKey = INSTAGRAM_IMAGE_KEYS[index];
            return (
              <div
                key={titleKey}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 lg:items-stretch"
              >
                <article className="lg:col-span-2 p-6 rounded-lg border border-stone-800">
                  <div className="flex items-center space-x-4 text-xs tracking-widest text-stone-500 mb-2 uppercase">
                    {wrap(
                      `${base}.${dateKey}`,
                      'Date',
                      'text',
                      <span>{v(`${base}.${dateKey}`)}</span>
                    )}
                    <span className="w-8 h-[1px] bg-stone-700 shrink-0" />
                    {wrap(
                      `${base}.${categorieKey}`,
                      'Categorie',
                      'text',
                      <span>{v(`${base}.${categorieKey}`)}</span>
                    )}
                  </div>
                  {wrap(
                    `${base}.${titleKey}`,
                    'Titre article',
                    'text',
                    <h3 className="text-xl font-medium text-stone-100 mb-3">{v(`${base}.${titleKey}`)}</h3>
                  )}
                  {wrap(
                    `${base}.${descKey}`,
                    'Description',
                    'richtext',
                    <p className="text-stone-400 font-light leading-relaxed mb-4">{v(`${base}.${descKey}`)}</p>
                  )}
                  <ArticleLink
                    mode={mode}
                    base={base}
                    lienTexteKey={lienTexteKey}
                    lienKey={lienKey}
                    v={v}
                    wrap={wrap}
                  />
                </article>

                <div className="relative min-h-[200px] lg:min-h-0 lg:h-full bg-stone-900 overflow-hidden border border-stone-800 rounded-sm">
                  {wrap(
                    imageKey,
                    `Instagram ${index + 1}`,
                    'image',
                    <CmsImage
                      src={v(imageKey)}
                      alt={`Instagram ${index + 1}`}
                      fill
                      className="object-cover opacity-80"
                      sizes="(max-width: 1024px) 100vw, 280px"
                    />
                  )}
                </div>
              </div>
            );
          })}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            <div className="hidden lg:block lg:col-span-2" />
            <p className="text-center text-xs uppercase tracking-widest text-stone-500">
              {v(`${base}.suivre`)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function ActualitesPublicView() {
  const { lang } = useLanguage();
  const cms = useCmsContent(fallback);
  return <ActualitesContent mode="public" lang={lang} v={(k) => (cms as Record<string, string>)[k] ?? ''} />;
}

function ActualitesStudioView() {
  const { lang, getValue } = useCmsEditor();
  return <ActualitesContent mode="studio" lang={lang} v={getValue} />;
}

export default function ActualitesView({ mode }: { mode: 'public' | 'studio' }) {
  return mode === 'studio' ? <ActualitesStudioView /> : <ActualitesPublicView />;
}
