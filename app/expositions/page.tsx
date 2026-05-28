'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function ExpositionsPage() {
  const { t } = useLanguage();

  const expos = [
    {
      year: '2025',
      titleKey: 'expo1Titre' as const,
      lieuKey: 'expo1Lieu' as const,
      dateKey: 'expo1Date' as const,
      badge: t.expositions.aVenir,
      badgeClass: 'bg-stone-800 text-stone-300',
    },
    {
      year: '2024',
      titleKey: 'expo2Titre' as const,
      lieuKey: 'expo2Lieu' as const,
      dateKey: 'expo2Date' as const,
      badge: t.expositions.enCours,
      badgeClass: 'bg-stone-100 text-stone-900',
    },
    {
      year: '2023',
      titleKey: 'expo3Titre' as const,
      lieuKey: 'expo3Lieu' as const,
      dateKey: 'expo3Date' as const,
      badge: null,
      badgeClass: '',
    },
  ];

  return (
    <main className="pt-16 animate-fade-in-up">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-4xl md:text-5xl mb-16 text-center text-stone-100">
          {t.expositions.title}
        </h1>

        <div className="space-y-12">
          {expos.map(({ year, titleKey, lieuKey, dateKey, badge, badgeClass }) => (
            <div
              key={year}
              className="flex flex-col md:flex-row md:items-baseline border-b border-stone-800 pb-12 group cursor-default hover:bg-stone-900/50 transition-colors duration-300 p-4 rounded-lg"
            >
              <div className="md:w-1/4 mb-2 md:mb-0">
                <span className="font-serif text-2xl text-stone-500 group-hover:text-stone-100 transition-colors duration-300">
                  {year}
                </span>
              </div>
              <div className="md:w-3/4 flex flex-col md:flex-row md:justify-between md:items-baseline">
                <div>
                  <h3 className="text-xl font-medium text-stone-200 mb-1 group-hover:translate-x-2 transition-transform duration-300">
                    {t.expositions[titleKey]}
                  </h3>
                  <p className="text-stone-400 italic font-serif group-hover:text-stone-300 transition-colors">
                    {t.expositions[lieuKey]}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 text-right">
                  <p className="text-sm text-stone-500 tracking-wide">
                    {t.expositions[dateKey]}
                  </p>
                  {badge && (
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-widest ${badgeClass}`}
                    >
                      {badge}
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
