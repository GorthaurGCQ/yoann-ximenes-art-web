'use client';

import Link from 'next/link';
import CmsImage from '@/components/cms/CmsImage';
import HeroSlideshow from '@/components/HeroSlideshow';
import EditableRegion from '@/components/cms/editor/EditableRegion';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCmsContent } from '@/hooks/useCmsContent';
import { translations } from '@/lib/translations';

const fallback = {
  'translations.fr.index.subtitle': translations.fr.index.subtitle,
  'translations.fr.index.derniereExpo': translations.fr.index.derniereExpo,
  'translations.fr.index.resonancesSilencieuses': translations.fr.index.resonancesSilencieuses,
  'translations.fr.index.enSavoirPlus': translations.fr.index.enSavoirPlus,
  'translations.fr.index.expoAlt': translations.fr.index.expoAlt,
  'translations.en.index.subtitle': translations.en.index.subtitle,
  'translations.en.index.derniereExpo': translations.en.index.derniereExpo,
  'translations.en.index.resonancesSilencieuses': translations.en.index.resonancesSilencieuses,
  'translations.en.index.enSavoirPlus': translations.en.index.enSavoirPlus,
  'translations.en.index.expoAlt': translations.en.index.expoAlt,
  'accueil.expoImage.src': '/Images/Oeuvres/Speechscape/speechscape_1.jpg',
};

function HomeContent({
  mode,
  lang,
  v,
}: {
  mode: 'public' | 'studio';
  lang: 'fr' | 'en';
  v: (key: string) => string;
}) {
  const base = `translations.${lang}.index`;
  const wrap = (key: string, label: string, kind: 'text' | 'richtext' | 'image', node: React.ReactNode) =>
    mode === 'studio' ? (
      <EditableRegion blockKey={key} label={label} kind={kind}>
        {node}
      </EditableRegion>
    ) : (
      node
    );

  return (
    <main className={mode === 'public' ? 'pt-16 animate-fade-in-up' : ''}>
      <HeroSlideshow subtitle={v(`${base}.subtitle`)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            {wrap(
              `${base}.derniereExpo`,
              'Titre section exposition',
              'text',
              <h2 className="font-serif text-3xl md:text-4xl mb-6 text-stone-100">{v(`${base}.derniereExpo`)}</h2>
            )}
            {wrap(
              `${base}.resonancesSilencieuses`,
              'Description exposition',
              'richtext',
              <p className="text-stone-400 mb-8 font-light leading-relaxed">{v(`${base}.resonancesSilencieuses`)}</p>
            )}
            {wrap(
              `${base}.enSavoirPlus`,
              'Lien en savoir plus',
              'text',
              <Link href="/expositions" className="text-stone-100 font-medium hover:underline decoration-1 underline-offset-4 decoration-stone-500">
                {v(`${base}.enSavoirPlus`)}
              </Link>
            )}
          </div>
          <div className="aspect-[4/3] bg-stone-900 relative overflow-hidden group border border-stone-800">
            {wrap(
              'accueil.expoImage.src',
              'Image exposition',
              'image',
              <CmsImage
                src={v('accueil.expoImage.src')}
                alt={v(`${base}.expoAlt`)}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function HomeView({ mode }: { mode: 'public' | 'studio' }) {
  if (mode === 'studio') {
    return <HomeStudio />;
  }
  return <HomePublic />;
}

function HomePublic() {
  const { lang } = useLanguage();
  const cms = useCmsContent(fallback);
  return <HomeContent mode="public" lang={lang} v={(k) => cms[k as keyof typeof cms] ?? ''} />;
}

function HomeStudio() {
  const { lang, getValue } = useCmsEditor();
  return <HomeContent mode="studio" lang={lang} v={getValue} />;
}
