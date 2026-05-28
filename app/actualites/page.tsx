'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { useLanguage } from '@/contexts/LanguageContext';

const instagramImages = [
  '/Images/Oeuvres/La_symphony/1.XimenesYoann,La symphonie des vagabonds.jpg',
  '/Images/Oeuvres/Le Big Bang de Louise/Le Big Bang de Louise.jpg',
  '/Images/Oeuvres/Mantras/1.Mantras.jpg',
  '/Images/Oeuvres/Nùn/DSC_0532.jpg',
];

export default function ActualitesPage() {
  const { t } = useLanguage();

  const articles = [
    {
      date: '12 Janvier 2025',
      tagKey: 'presse' as const,
      titleKey: 'article1Titre' as const,
      descKey: 'article1Desc' as const,
    },
    {
      date: '05 Décembre 2024',
      tagKey: 'evenement' as const,
      titleKey: 'article2Titre' as const,
      descKey: 'article2Desc' as const,
    },
  ];

  return (
    <main className="pt-16 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-4xl md:text-5xl mb-16 text-center text-stone-100">
          {t.actualites.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Articles */}
          <div className="lg:col-span-2 space-y-12">
            <h2 className="font-serif text-2xl mb-8 border-b border-stone-800 pb-4 text-stone-200">
              {t.actualites.dernieresPublications}
            </h2>

            {articles.map(({ date, tagKey, titleKey, descKey }) => (
              <article
                key={titleKey}
                className="group p-6 rounded-lg hover:bg-stone-900/50 transition-colors duration-300 border border-transparent hover:border-stone-800"
              >
                <div className="flex items-center space-x-4 text-xs tracking-widest text-stone-500 mb-2 uppercase">
                  <span>{date}</span>
                  <span className="w-8 h-[1px] bg-stone-700" />
                  <span>{t.actualites[tagKey]}</span>
                </div>
                <h3 className="text-xl font-medium text-stone-100 mb-3 group-hover:text-stone-300 transition-colors">
                  <a href="#">{t.actualites[titleKey]}</a>
                </h3>
                <p className="text-stone-400 font-light leading-relaxed mb-4">
                  {t.actualites[descKey]}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-sm font-medium text-stone-200 hover:underline decoration-1 underline-offset-4 group-hover:translate-x-1 transition-transform"
                >
                  {t.actualites.lireSuite}
                  <ArrowUpRight size={16} className="ml-1" />
                </a>
              </article>
            ))}
          </div>

          {/* Instagram */}
          <div>
            <div className="flex items-center justify-between mb-8 border-b border-stone-800 pb-4">
              <h2 className="font-serif text-2xl text-stone-200">
                {t.actualites.instagram}
              </h2>
              <a
                href="#"
                className="text-stone-500 hover:text-stone-100 transition-colors hover:rotate-12 transform duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {instagramImages.map((src, i) => (
                <a
                  key={src}
                  href="#"
                  className="block group relative aspect-square bg-stone-900 overflow-hidden border border-stone-800 rounded-sm"
                >
                  <Image
                    src={src}
                    alt={`Instagram post ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    sizes="(max-width: 1024px) 50vw, 15vw"
                  />
                  {i === 0 && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white font-medium flex items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="mr-1">♥</span> 245
                      </span>
                    </div>
                  )}
                </a>
              ))}
            </div>

            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-100 border-b border-transparent hover:border-stone-100 transition-all pb-1"
              >
                {t.actualites.suivre}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
