'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ArtistePage() {
  const { t } = useLanguage();

  return (
    <main className="pt-16 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Portrait */}
          <div className="relative aspect-[3/4] bg-stone-900 border border-stone-800 group overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
              alt="Portrait de l'artiste"
              fill
              className="object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Texte */}
          <div className="pt-8 md:pt-0">
            <h1 className="font-serif text-4xl md:text-5xl mb-8 text-stone-100">
              {t.artiste.title}
            </h1>

            <div className="space-y-6 text-stone-400 font-light leading-relaxed text-lg">
              <h2 className="text-stone-200 font-medium text-xl">{t.artiste.heading}</h2>
              <p>{t.artiste.text1}</p>
              <p>{t.artiste.text2}</p>
              <p className="text-stone-300 italic">{t.artiste.quote}</p>
              <p>{t.artiste.text3}</p>
              <p>{t.artiste.text4}</p>
            </div>

            <div className="mt-12 border-t border-stone-800 pt-8">
              <h3 className="font-serif text-xl mb-4 text-stone-200">
                {t.artiste.distinctions}
              </h3>
              <ul className="space-y-2 text-stone-500 font-light text-sm">
                {[t.artiste.distinction1, t.artiste.distinction2, t.artiste.distinction3].map(
                  (d) => (
                    <li
                      key={d}
                      className="hover:text-stone-300 transition-colors cursor-default"
                    >
                      {d}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
