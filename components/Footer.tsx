'use client';

import InstagramIcon from '@/components/icons/InstagramIcon';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 border-t-2 border-accent/30 mt-20">
      <div className="max-w-7xl mx-auto py-16 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6 mb-10">
          <a
            href="https://www.instagram.com/yoann.ximenes/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-600 hover:text-accent transition-colors duration-300"
            aria-label="Instagram"
          >
            <InstagramIcon size={20} />
          </a>
        </div>
        <div className="w-8 h-[1px] bg-accent/40 mx-auto mb-8" />
        <p className="text-center text-xs tracking-wide text-stone-600">
          &copy; 2026 Yoann Ximenes. {t.footer.droitsReserves}
        </p>
      </div>
    </footer>
  );
}
