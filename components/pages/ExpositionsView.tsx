'use client';

import EditableRegion from '@/components/cms/editor/EditableRegion';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCmsContent } from '@/hooks/useCmsContent';
import { translations } from '@/lib/translations';

const expoKeys = ['expo1Titre', 'expo1Lieu', 'expo1Date', 'expo2Titre', 'expo2Lieu', 'expo2Date', 'expo3Titre', 'expo3Lieu', 'expo3Date'] as const;
const baseKeys = ['title', 'aVenir', 'enCours'] as const;

function buildFallback() {
  const fb: Record<string, string> = {};
  for (const lang of ['fr', 'en'] as const) {
    for (const k of [...baseKeys, ...expoKeys]) {
      fb[`translations.${lang}.expositions.${k}`] = translations[lang].expositions[k];
    }
  }
  return fb;
}

const fallback = buildFallback();

const expos = [
  { year: '2025', titleKey: 'expo1Titre', lieuKey: 'expo1Lieu', dateKey: 'expo1Date', badgeKey: 'aVenir' as const },
  { year: '2024', titleKey: 'expo2Titre', lieuKey: 'expo2Lieu', dateKey: 'expo2Date', badgeKey: 'enCours' as const },
  { year: '2023', titleKey: 'expo3Titre', lieuKey: 'expo3Lieu', dateKey: 'expo3Date', badgeKey: null },
];

function ExpositionsContent({ mode, lang, v }: { mode: 'public' | 'studio'; lang: 'fr' | 'en'; v: (k: string) => string }) {
  const base = `translations.${lang}.expositions`;
  const wrap = (key: string, label: string, node: React.ReactNode) =>
    mode === 'studio' ? <EditableRegion blockKey={key} label={label} kind="text">{node}</EditableRegion> : node;

  return (
    <main className={mode === 'public' ? 'pt-16 animate-fade-in-up' : 'p-4'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {wrap(`${base}.title`, 'Titre page', <h1 className="font-serif text-4xl md:text-5xl mb-16 text-center text-stone-100">{v(`${base}.title`)}</h1>)}
        <div className="space-y-12">
          {expos.map(({ year, titleKey, lieuKey, dateKey, badgeKey }) => (
            <div key={year} className="flex flex-col md:flex-row md:items-baseline border-b border-stone-800 pb-12 p-4 rounded-lg">
              <div className="md:w-1/4 mb-2 md:mb-0">
                <span className="font-serif text-2xl text-stone-500">{year}</span>
              </div>
              <div className="md:w-3/4 flex flex-col md:flex-row md:justify-between md:items-baseline">
                <div>
                  {wrap(`${base}.${titleKey}`, 'Titre', <h3 className="text-xl font-medium text-stone-200 mb-1">{v(`${base}.${titleKey}`)}</h3>)}
                  {wrap(`${base}.${lieuKey}`, 'Lieu', <p className="text-stone-400 italic font-serif">{v(`${base}.${lieuKey}`)}</p>)}
                </div>
                <div className="mt-2 md:mt-0 text-right">
                  {wrap(`${base}.${dateKey}`, 'Date', <p className="text-sm text-stone-500 tracking-wide">{v(`${base}.${dateKey}`)}</p>)}
                  {badgeKey && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-widest bg-stone-800 text-stone-300">
                      {v(`${base}.${badgeKey}`)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function ExpositionsPublicView() {
  const { lang } = useLanguage();
  const cms = useCmsContent(fallback);
  return <ExpositionsContent mode="public" lang={lang} v={(k) => cms[k] ?? ''} />;
}

function ExpositionsStudioView() {
  const { lang, getValue } = useCmsEditor();
  return <ExpositionsContent mode="studio" lang={lang} v={getValue} />;
}

export default function ExpositionsView({ mode }: { mode: 'public' | 'studio' }) {
  return mode === 'studio' ? <ExpositionsStudioView /> : <ExpositionsPublicView />;
}
