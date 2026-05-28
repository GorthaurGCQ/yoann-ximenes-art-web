'use client';

import { ArrowRight } from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <main className="pt-16 animate-fade-in-up min-h-[80vh] flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-serif text-4xl md:text-5xl mb-8 text-stone-100">
          {t.contact.title}
        </h1>

        <p className="text-stone-400 font-light text-lg mb-12 max-w-2xl mx-auto">
          {t.contact.description}
        </p>

        <a href="mailto:contact@yoannximenes.art" className="inline-block group">
          <span className="font-serif text-2xl md:text-4xl text-stone-200 border-b border-stone-800 group-hover:border-stone-100 group-hover:text-white transition-all duration-300 pb-2">
            contact@yoannximenes.art
          </span>
          <div className="mt-4 text-sm uppercase tracking-widest text-stone-500 group-hover:text-stone-400 transition-colors flex items-center justify-center">
            {t.contact.envoyerEmail}
            <ArrowRight
              size={16}
              className="ml-1 transition-transform group-hover:translate-x-1"
            />
          </div>
        </a>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-stone-800 pt-12">
          <div>
            <h3 className="text-stone-100 font-medium mb-2">{t.contact.atelier}</h3>
            <p className="text-stone-500 font-light text-sm">{t.contact.parisFrance}</p>
          </div>
          <div>
            <h3 className="text-stone-100 font-medium mb-2">{t.contact.galerie}</h3>
            <p className="text-stone-500 font-light text-sm">{t.contact.galerieText}</p>
          </div>
          <div>
            <h3 className="text-stone-100 font-medium mb-2">{t.contact.reseaux}</h3>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="text-stone-500 hover:text-stone-300" aria-label="Instagram">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
