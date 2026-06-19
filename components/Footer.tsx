'use client';

import InstagramIcon from '@/components/icons/InstagramIcon';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="https://www.instagram.com/yoann.ximenes/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-500 hover:text-stone-300 transition-colors hover:scale-110 transform duration-300"
            aria-label="Instagram"
          >
            <InstagramIcon size={20} />
          </a>
        </div>
        <p className="mt-8 text-center text-xs tracking-widest text-stone-600 uppercase">
          &copy; 2026 Yoann Ximenes. {t.footer.droitsReserves}
        </p>
      </div>
    </footer>
  );
}
