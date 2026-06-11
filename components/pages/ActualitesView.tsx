'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import EditableRegion from '@/components/cms/editor/EditableRegion';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCmsContent } from '@/hooks/useCmsContent';
import { translations } from '@/lib/translations';

const instagramImages = [
  '/Images/Oeuvres/La_symphony/1.XimenesYoann,La symphonie des vagabonds.jpg',
  '/Images/Oeuvres/Le Big Bang de Louise/Le Big Bang de Louise.jpg',
  '/Images/Oeuvres/Mantras/1.Mantras.jpg',
  '/Images/Oeuvres/Nùn/DSC_0532.jpg',
];

const keys = [
  'title', 'dernieresPublications', 'lireSuite', 'presse', 'evenement',
  'article1Titre', 'article1Desc', 'article2Titre', 'article2Desc', 'instagram', 'suivre',
] as const;

function buildFallback() {
  const fb: Record<string, string> = {};
  for (const lang of ['fr', 'en'] as const) {
    for (const k of keys) {
      fb[`translations.${lang}.actualites.${k}`] = translations[lang].actualites[k];
    }
  }
  return fb;
}

const fallback = buildFallback();

function ActualitesContent({ mode, lang, v }: { mode: 'public' | 'studio'; lang: 'fr' | 'en'; v: (k: string) => string }) {
  const base = `translations.${lang}.actualites`;
  const wrap = (key: string, label: string, kind: 'text' | 'richtext', node: React.ReactNode) =>
    mode === 'studio' ? <EditableRegion blockKey={key} label={label} kind={kind}>{node}</EditableRegion> : node;

  return (
    <main className={mode === 'public' ? 'pt-16 animate-fade-in-up' : 'p-4'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {wrap(`${base}.title`, 'Titre', 'text', <h1 className="font-serif text-4xl md:text-5xl mb-16 text-center text-stone-100">{v(`${base}.title`)}</h1>)}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            {wrap(`${base}.dernieresPublications`, 'Titre publications', 'text', <h2 className="font-serif text-2xl mb-8 border-b border-stone-800 pb-4 text-stone-200">{v(`${base}.dernieresPublications`)}</h2>)}
            {[
              { date: '12 Janvier 2025', tagKey: 'presse', titleKey: 'article1Titre', descKey: 'article1Desc' },
              { date: '05 Decembre 2024', tagKey: 'evenement', titleKey: 'article2Titre', descKey: 'article2Desc' },
            ].map(({ date, tagKey, titleKey, descKey }) => (
              <article key={titleKey} className="p-6 rounded-lg border border-stone-800">
                <div className="flex items-center space-x-4 text-xs tracking-widest text-stone-500 mb-2 uppercase">
                  <span>{date}</span>
                  <span className="w-8 h-[1px] bg-stone-700" />
                  <span>{v(`${base}.${tagKey}`)}</span>
                </div>
                {wrap(`${base}.${titleKey}`, 'Titre article', 'text', <h3 className="text-xl font-medium text-stone-100 mb-3">{v(`${base}.${titleKey}`)}</h3>)}
                {wrap(`${base}.${descKey}`, 'Description', 'richtext', <p className="text-stone-400 font-light leading-relaxed mb-4">{v(`${base}.${descKey}`)}</p>)}
                <span className="inline-flex items-center text-sm font-medium text-stone-200">
                  {v(`${base}.lireSuite`)}
                  <ArrowUpRight size={16} className="ml-1" />
                </span>
              </article>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between mb-8 border-b border-stone-800 pb-4">
              {wrap(`${base}.instagram`, 'Instagram', 'text', <h2 className="font-serif text-2xl text-stone-200">{v(`${base}.instagram`)}</h2>)}
              <InstagramIcon size={20} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {instagramImages.map((src, i) => (
                <div key={src} className="relative aspect-square bg-stone-900 overflow-hidden border border-stone-800 rounded-sm">
                  <Image src={src} alt={`Instagram ${i + 1}`} fill className="object-cover opacity-80" sizes="200px" />
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs uppercase tracking-widest text-stone-500">{v(`${base}.suivre`)}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function ActualitesPublicView() {
  const { lang } = useLanguage();
  const cms = useCmsContent(fallback);
  return <ActualitesContent mode="public" lang={lang} v={(k) => cms[k] ?? ''} />;
}

function ActualitesStudioView() {
  const { lang, getValue } = useCmsEditor();
  return <ActualitesContent mode="studio" lang={lang} v={getValue} />;
}

export default function ActualitesView({ mode }: { mode: 'public' | 'studio' }) {
  return mode === 'studio' ? <ActualitesStudioView /> : <ActualitesPublicView />;
}
