'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const navLinks = [
  { href: '/', key: 'accueil' as const },
  { href: '/artiste', key: 'artiste' as const },
  { href: '/oeuvres', key: 'oeuvres' as const },
  { href: '/expositions', key: 'expositions' as const },
  { href: '/actualites', key: 'actualites' as const },
  { href: '/contact', key: 'contact' as const },
];

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const LangSelector = () => (
    <div className="flex items-center space-x-1">
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`text-xs tracking-wide px-2 py-1 rounded transition-colors ${
            lang === l
              ? 'bg-accent/15 text-accent font-medium'
              : 'text-stone-500 hover:text-stone-200'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="fixed top-0 w-full bg-stone-950/95 backdrop-blur-sm z-50 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <div className="flex-shrink-0">
            <Link
              href="/"
              className="font-serif text-2xl tracking-wider text-stone-100 hover:text-accent transition-colors duration-300 inline-block"
            >
              Yoann Ximenes
            </Link>
          </div>

          <div className="hidden md:flex space-x-10 items-center">
            {navLinks.map(({ href, key }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-sm tracking-wide pb-0.5 transition-colors duration-200 group ${
                    active
                      ? 'text-stone-100'
                      : 'text-stone-500 hover:text-stone-200'
                  }`}
                >
                  {t.nav[key]}
                  <span
                    className={`absolute bottom-0 left-0 h-[1px] bg-accent transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
            <div className="ml-4">
              <LangSelector />
            </div>
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <LangSelector />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-stone-400 hover:text-stone-100 p-2"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-stone-900 border-b border-stone-800 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            {navLinks.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-4 text-base tracking-wide ${
                  isActive(href)
                    ? 'text-stone-100 font-medium'
                    : 'text-stone-500'
                }`}
              >
                {t.nav[key]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
