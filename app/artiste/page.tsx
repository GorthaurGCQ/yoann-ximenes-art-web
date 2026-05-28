'use client';

import { useMemo } from 'react';
import EditableImage from '@/components/cms/EditableImage';
import EditableRichText from '@/components/cms/EditableRichText';
import EditableText from '@/components/cms/EditableText';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCmsContent } from '@/hooks/useCmsContent';
import { translations } from '@/lib/translations';

export default function ArtistePage() {
  const { lang } = useLanguage();
  const fallbackValues = useMemo(
    () => ({
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
    }),
    []
  );
  const cmsValues = useCmsContent(fallbackValues);
  const baseKey = `translations.${lang}.artiste`;

  return (
    <main className="pt-16 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Portrait */}
          <div className="relative aspect-[3/4] bg-stone-900 border border-stone-800 group overflow-hidden">
            <EditableImage
              srcKey="artiste.profileImage.src"
              altKey="artiste.profileImage.alt"
              src={cmsValues['artiste.profileImage.src']}
              alt={cmsValues['artiste.profileImage.alt']}
              className="object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Texte */}
          <div className="pt-8 md:pt-0">
            <EditableText
              as="h1"
              contentKey={`${baseKey}.title`}
              value={cmsValues[`${baseKey}.title`]}
              className="font-serif text-4xl md:text-5xl mb-8 text-stone-100"
            />

            <div className="space-y-6 text-stone-400 font-light leading-relaxed text-lg">
              <EditableText
                as="h2"
                contentKey={`${baseKey}.heading`}
                value={cmsValues[`${baseKey}.heading`]}
                className="text-stone-200 font-medium text-xl"
              />
              <EditableRichText
                contentKey={`${baseKey}.text1`}
                value={cmsValues[`${baseKey}.text1`]}
              />
              <EditableRichText
                contentKey={`${baseKey}.text2`}
                value={cmsValues[`${baseKey}.text2`]}
              />
              <EditableText
                as="p"
                contentKey={`${baseKey}.quote`}
                value={cmsValues[`${baseKey}.quote`]}
                className="text-stone-300 italic"
              />
              <EditableRichText
                contentKey={`${baseKey}.text3`}
                value={cmsValues[`${baseKey}.text3`]}
              />
              <EditableRichText
                contentKey={`${baseKey}.text4`}
                value={cmsValues[`${baseKey}.text4`]}
              />
            </div>

            <div className="mt-12 border-t border-stone-800 pt-8">
              <EditableText
                as="h3"
                contentKey={`${baseKey}.distinctions`}
                value={cmsValues[`${baseKey}.distinctions`]}
                className="font-serif text-xl mb-4 text-stone-200"
              />
              <ul className="space-y-2 text-stone-500 font-light text-sm">
                {[
                  cmsValues[`${baseKey}.distinction1`],
                  cmsValues[`${baseKey}.distinction2`],
                  cmsValues[`${baseKey}.distinction3`],
                ].map((d, index) => (
                  <EditableText
                    key={`${index}-${d}`}
                    as="li"
                    contentKey={`${baseKey}.distinction${index + 1}`}
                    value={d}
                    className="hover:text-stone-300 transition-colors cursor-default"
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
