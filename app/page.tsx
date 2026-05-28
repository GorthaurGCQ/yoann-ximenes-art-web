'use client';

import Link from 'next/link';
import Image from 'next/image';
import HeroSlideshow from '@/components/HeroSlideshow';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="pt-16 animate-fade-in-up">
      <HeroSlideshow />

      {/* Section Dernière Exposition */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-stone-100">
              {t.index.derniereExpo}
            </h2>
            <p className="text-stone-400 mb-8 font-light leading-relaxed">
              {t.index.resonancesSilencieuses}
            </p>
            <Link
              href="/expositions"
              className="text-stone-100 font-medium hover:underline decoration-1 underline-offset-4 decoration-stone-500"
            >
              {t.index.enSavoirPlus}
            </Link>
          </div>
          <div className="aspect-[4/3] bg-stone-900 relative overflow-hidden group border border-stone-800">
            <Image
              src="/Images/Oeuvres/Speechscape/speechscape_1.jpg"
              alt={t.index.expoAlt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
