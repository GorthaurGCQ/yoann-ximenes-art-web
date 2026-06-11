'use client';

import { useState } from 'react';
import Image from 'next/image';
import EditableRegion from '@/components/cms/editor/EditableRegion';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCmsContent } from '@/hooks/useCmsContent';
import { translations } from '@/lib/translations';
import WorkModal from '@/components/WorkModal';

const works = [
  { key: 'La Symphonie', image: '/Images/Oeuvres/La_symphony/1.XimenesYoann,La symphonie des vagabonds.jpg', titleKey: 'oeuvreSymphonie' as const, subKey: 'filtreSymphonie' as const },
  { key: 'Le Big Bang de Louise', image: '/Images/Oeuvres/Le Big Bang de Louise/Le Big Bang de Louise.jpg', titleKey: 'oeuvreBigBang' as const, subKey: 'installation' as const },
  { key: 'Mantras', image: '/Images/Oeuvres/Mantras/1.Mantras.jpg', titleKey: 'oeuvreMantras' as const, subKey: 'sculpture' as const },
  { key: 'Nùn', image: '/Images/Oeuvres/Nùn/DSC_0532.jpg', titleKey: 'oeuvreNun' as const, subKey: 'sculpture' as const },
  { key: 'Souvenir from Earth', image: '/Images/Oeuvres/Souvenir from Earth/Souvenirs from Earth - Copie.jpg', titleKey: 'oeuvreSouvenir' as const, subKey: 'installation' as const },
  { key: 'Speechscape', image: '/Images/Oeuvres/Speechscape/speechscape_1.jpg', titleKey: 'oeuvreSpeechscape' as const, subKey: 'installation' as const },
];

function buildFallback() {
  const fb: Record<string, string> = {};
  for (const lang of ['fr', 'en'] as const) {
    fb[`translations.${lang}.oeuvres.title`] = translations[lang].oeuvres.title;
    for (const w of works) {
      fb[`translations.${lang}.oeuvres.${w.titleKey}`] = translations[lang].oeuvres[w.titleKey];
      fb[`translations.${lang}.oeuvres.${w.subKey}`] = translations[lang].oeuvres[w.subKey];
    }
  }
  return fb;
}

const fallback = buildFallback();

function OeuvresContent({ mode, lang, v }: { mode: 'public' | 'studio'; lang: 'fr' | 'en'; v: (k: string) => string }) {
  const [selectedWork, setSelectedWork] = useState<string | null>(null);
  const base = `translations.${lang}.oeuvres`;
  const wrap = (key: string, label: string, node: React.ReactNode) =>
    mode === 'studio' ? <EditableRegion blockKey={key} label={label} kind="text">{node}</EditableRegion> : node;

  return (
    <main className={mode === 'public' ? 'pt-16 animate-fade-in-up' : 'p-4'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {wrap(`${base}.title`, 'Titre page', <h1 className="font-serif text-4xl md:text-5xl mb-12 text-center text-stone-100">{v(`${base}.title`)}</h1>)}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map(({ key, image, titleKey, subKey }) => (
            <div key={key} className="group cursor-pointer" onClick={() => setSelectedWork(key)}>
              <div className="relative aspect-square bg-stone-900 overflow-hidden mb-4 border border-stone-800 rounded-sm">
                <Image src={image} alt={v(`${base}.${titleKey}`)} fill className="object-cover opacity-90 group-hover:opacity-100" sizes="33vw" />
              </div>
              <div className="text-center">
                {wrap(`${base}.${titleKey}`, 'Titre oeuvre', <h3 className="font-serif text-xl text-stone-200 italic">{v(`${base}.${titleKey}`)}</h3>)}
                <p className="text-stone-500 text-xs uppercase tracking-wider mt-1">{v(`${base}.${subKey}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <WorkModal categoryKey={selectedWork} onClose={() => setSelectedWork(null)} />
    </main>
  );
}

function OeuvresPublicView() {
  const { lang } = useLanguage();
  const cms = useCmsContent(fallback);
  return <OeuvresContent mode="public" lang={lang} v={(k) => cms[k] ?? ''} />;
}

function OeuvresStudioView() {
  const { lang, getValue } = useCmsEditor();
  return <OeuvresContent mode="studio" lang={lang} v={getValue} />;
}

export default function OeuvresView({ mode }: { mode: 'public' | 'studio' }) {
  return mode === 'studio' ? <OeuvresStudioView /> : <OeuvresPublicView />;
}
