'use client';

import CmsImage from '@/components/cms/CmsImage';
import EditableRegion from '@/components/cms/editor/EditableRegion';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCmsContent } from '@/hooks/useCmsContent';
import { translations } from '@/lib/translations';

interface ArtisteViewProps {
  mode: 'public' | 'studio';
}

const fallbackValues = {
  'artiste.profileImage.src': '/Images/yoann-ximenes-portrait.jpeg',
  'artiste.profileImage.alt': "Portrait de l'artiste",
  'translations.fr.artiste.title': translations.fr.artiste.title,
  'translations.fr.artiste.heading': translations.fr.artiste.heading,
  'translations.fr.artiste.text1': translations.fr.artiste.text1,
  'translations.fr.artiste.text2': translations.fr.artiste.text2,
  'translations.fr.artiste.quote': translations.fr.artiste.quote,
  'translations.fr.artiste.text3': translations.fr.artiste.text3,
  'translations.fr.artiste.text4': translations.fr.artiste.text4,
  'translations.fr.artiste.distinctions': translations.fr.artiste.distinctions,
  'translations.fr.artiste.distinction1': translations.fr.artiste.distinction1,
  'translations.fr.artiste.distinction2': translations.fr.artiste.distinction2,
  'translations.fr.artiste.distinction3': translations.fr.artiste.distinction3,
  'translations.en.artiste.title': translations.en.artiste.title,
  'translations.en.artiste.heading': translations.en.artiste.heading,
  'translations.en.artiste.text1': translations.en.artiste.text1,
  'translations.en.artiste.text2': translations.en.artiste.text2,
  'translations.en.artiste.quote': translations.en.artiste.quote,
  'translations.en.artiste.text3': translations.en.artiste.text3,
  'translations.en.artiste.text4': translations.en.artiste.text4,
  'translations.en.artiste.distinctions': translations.en.artiste.distinctions,
  'translations.en.artiste.distinction1': translations.en.artiste.distinction1,
  'translations.en.artiste.distinction2': translations.en.artiste.distinction2,
  'translations.en.artiste.distinction3': translations.en.artiste.distinction3,
};

function ArtisteContent({
  mode,
  lang,
  v,
}: {
  mode: 'public' | 'studio';
  lang: 'fr' | 'en';
  v: (key: string) => string;
}) {
  const baseKey = `translations.${lang}.artiste`;

  const wrap = (
    key: string,
    label: string,
    kind: 'text' | 'richtext' | 'image',
    children: React.ReactNode
  ) =>
    mode === 'studio' ? (
      <EditableRegion blockKey={key} label={label} kind={kind}>
        {children}
      </EditableRegion>
    ) : (
      <>{children}</>
    );

  return (
    <main className={`${mode === 'public' ? 'pt-16 animate-fade-in-up' : 'p-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="relative aspect-[3/4] bg-stone-900 border border-stone-800 group overflow-hidden">
            {wrap(
              'artiste.profileImage.src',
              'Portrait',
              'image',
              <CmsImage
                src={v('artiste.profileImage.src')}
                alt={v('artiste.profileImage.alt')}
                fill
                className="object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>

          <div className="pt-8 md:pt-0">
            {wrap(
              `${baseKey}.title`,
              'Titre de la page',
              'text',
              <h1 className="font-serif text-4xl md:text-5xl mb-8 text-stone-100">{v(`${baseKey}.title`)}</h1>
            )}

            <div className="space-y-6 text-stone-400 font-light leading-relaxed text-lg">
              {wrap(
                `${baseKey}.heading`,
                'Sous-titre',
                'text',
                <h2 className="text-stone-200 font-medium text-xl">{v(`${baseKey}.heading`)}</h2>
              )}
              {wrap(`${baseKey}.text1`, 'Paragraphe 1', 'richtext', <p>{v(`${baseKey}.text1`)}</p>)}
              {wrap(`${baseKey}.text2`, 'Paragraphe 2', 'richtext', <p>{v(`${baseKey}.text2`)}</p>)}
              {wrap(
                `${baseKey}.quote`,
                'Citation',
                'text',
                <p className="text-stone-300 italic">{v(`${baseKey}.quote`)}</p>
              )}
              {wrap(`${baseKey}.text3`, 'Paragraphe 3', 'richtext', <p>{v(`${baseKey}.text3`)}</p>)}
              {wrap(`${baseKey}.text4`, 'Paragraphe 4', 'richtext', <p>{v(`${baseKey}.text4`)}</p>)}
            </div>

            <div className="mt-12 border-t border-stone-800 pt-8">
              {wrap(
                `${baseKey}.distinctions`,
                'Titre distinctions',
                'text',
                <h3 className="font-serif text-xl mb-4 text-stone-200">{v(`${baseKey}.distinctions`)}</h3>
              )}
              <ul className="space-y-2 text-stone-500 font-light text-sm">
                {[1, 2, 3].map((i) => {
                  const distinctionKey = `${baseKey}.distinction${i}`;
                  const item = <li>{v(distinctionKey)}</li>;
                  return mode === 'studio' ? (
                    <EditableRegion
                      key={distinctionKey}
                      blockKey={distinctionKey}
                      label={`Distinction ${i}`}
                      kind="text"
                      className="contents"
                    >
                      {item}
                    </EditableRegion>
                  ) : (
                    <li key={distinctionKey}>{v(distinctionKey)}</li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ArtistePublicView() {
  const { lang } = useLanguage();
  const cms = useCmsContent(fallbackValues);
  const v = (key: string) => cms[key as keyof typeof cms] ?? '';
  return <ArtisteContent mode="public" lang={lang} v={v} />;
}

function ArtisteStudioView() {
  const { lang, getValue } = useCmsEditor();
  const v = (key: string) => getValue(key);
  return <ArtisteContent mode="studio" lang={lang} v={v} />;
}

export default function ArtisteView({ mode }: ArtisteViewProps) {
  return mode === 'studio' ? <ArtisteStudioView /> : <ArtistePublicView />;
}
