'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { heroSlides } from '@/lib/worksData';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeroSlideshow({ subtitle }: { subtitle?: string }) {
  const { t } = useLanguage();
  const displaySubtitle = subtitle ?? t.index.subtitle;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-[85vh] w-full relative bg-stone-900 overflow-hidden flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-stone-950/10 z-10" />

      {/* Slides */}
      <div className="absolute inset-0 w-full h-full">
        {heroSlides.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="Background Art"
            fill
            className={`object-cover transition-opacity duration-[2000ms] animate-slow-zoom ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
            loading={i === current ? 'eager' : 'lazy'}
            sizes="100vw"
          />
        ))}
      </div>

      {/* Titre central */}
      <div className="relative z-20 text-center px-4">
        <h1 className="font-serif text-5xl md:text-7xl text-stone-50 mb-4 px-8 py-2 inline-block rounded-full transition-all duration-500 bg-white/10 backdrop-blur-sm hover:bg-white/40 hover:scale-105 hover:shadow-lg cursor-default">
          YOANN XIMENES
        </h1>
        <div className="block">
          <p className="font-sans text-lg text-stone-300 max-w-xl mx-auto font-light tracking-wide px-6 py-1 rounded-full inline-block transition-all duration-500 bg-white/10 backdrop-blur-sm hover:bg-white/40 hover:scale-105 hover:shadow-lg cursor-default">
            {displaySubtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
