'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { worksData } from '@/lib/worksData';
import WorkModal from '@/components/WorkModal';

const works = [
  {
    key: 'La Symphonie',
    image: '/Images/Oeuvres/La_symphony/1.XimenesYoann,La symphonie des vagabonds.jpg',
    titleKey: 'oeuvreSymphonie' as const,
    subKey: 'filtreSymphonie' as const,
  },
  {
    key: 'Le Big Bang de Louise',
    image: '/Images/Oeuvres/Le Big Bang de Louise/Le Big Bang de Louise.jpg',
    titleKey: 'oeuvreBigBang' as const,
    subKey: 'installation' as const,
  },
  {
    key: 'Mantras',
    image: '/Images/Oeuvres/Mantras/1.Mantras.jpg',
    titleKey: 'oeuvreMantras' as const,
    subKey: 'sculpture' as const,
  },
  {
    key: 'Nùn',
    image: '/Images/Oeuvres/Nùn/DSC_0532.jpg',
    titleKey: 'oeuvreNun' as const,
    subKey: 'sculpture' as const,
  },
  {
    key: 'Souvenir from Earth',
    image: '/Images/Oeuvres/Souvenir from Earth/Souvenirs from Earth - Copie.jpg',
    titleKey: 'oeuvreSouvenir' as const,
    subKey: 'installation' as const,
  },
  {
    key: 'Speechscape',
    image: '/Images/Oeuvres/Speechscape/speechscape_1.jpg',
    titleKey: 'oeuvreSpeechscape' as const,
    subKey: 'installation' as const,
  },
];

const filters = [
  { key: 'all', labelKey: 'tous' as const },
  { key: 'La Symphonie', labelKey: 'filtreSymphonie' as const },
  { key: 'Le Big Bang de Louise', labelKey: 'filtreBigBang' as const },
  { key: 'Mantras', labelKey: 'filtreMantras' as const },
  { key: 'Nùn', labelKey: 'filtreNun' as const },
  { key: 'Souvenir from Earth', labelKey: 'filtreSouvenir' as const },
  { key: 'Speechscape', labelKey: 'filtreSpeechscape' as const },
];

export default function OeuvresPage() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedWork, setSelectedWork] = useState<string | null>(null);

  const visible = works.filter(
    (w) => activeFilter === 'all' || w.key === activeFilter
  );

  return (
    <main className="pt-16 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-4xl md:text-5xl mb-12 text-center text-stone-100">
          {t.oeuvres.title}
        </h1>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {filters.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`uppercase tracking-widest text-xs py-2 px-3 rounded-full transition-all duration-300 hover:scale-105 ${
                activeFilter === key
                  ? 'bg-stone-100 text-stone-950'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-600'
              }`}
            >
              {t.oeuvres[labelKey]}
            </button>
          ))}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map(({ key, image, titleKey, subKey }) => (
            <div
              key={key}
              className="group cursor-pointer"
              onClick={() => setSelectedWork(key)}
            >
              <div className="relative aspect-square bg-stone-900 overflow-hidden mb-4 border border-stone-800 rounded-sm">
                <Image
                  src={image}
                  alt={t.oeuvres[titleKey]}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="text-center transform transition-transform duration-300 group-hover:-translate-y-1">
                <h3 className="font-serif text-xl text-stone-200 italic">
                  {t.oeuvres[titleKey]}
                </h3>
                <p className="text-stone-500 text-xs uppercase tracking-wider mt-1">
                  {t.oeuvres[subKey]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WorkModal
        categoryKey={selectedWork}
        onClose={() => setSelectedWork(null)}
      />
    </main>
  );
}
