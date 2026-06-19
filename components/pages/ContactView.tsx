'use client';

import { ArrowRight } from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import EditableRegion from '@/components/cms/editor/EditableRegion';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCmsContent } from '@/hooks/useCmsContent';
import { translations } from '@/lib/translations';

function buildFallback() {
  const keys = ['title', 'description', 'envoyerEmail', 'atelier', 'parisFrance', 'galerie', 'galerieText', 'reseaux'] as const;
  const fb: Record<string, string> = {};
  for (const lang of ['fr', 'en'] as const) {
    for (const k of keys) {
      fb[`translations.${lang}.contact.${k}`] = translations[lang].contact[k];
    }
  }
  return fb;
}

const fallback = buildFallback();

function ContactContent({ mode, lang, v }: { mode: 'public' | 'studio'; lang: 'fr' | 'en'; v: (k: string) => string }) {
  const base = `translations.${lang}.contact`;
  const wrap = (key: string, label: string, kind: 'text' | 'richtext', node: React.ReactNode) =>
    mode === 'studio' ? <EditableRegion blockKey={key} label={label} kind={kind}>{node}</EditableRegion> : node;

  return (
    <main className={`${mode === 'public' ? 'pt-16 animate-fade-in-up min-h-[80vh]' : 'p-4'} flex items-center justify-center`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {wrap(`${base}.title`, 'Titre', 'text', <h1 className="font-serif text-4xl md:text-5xl mb-8 text-stone-100">{v(`${base}.title`)}</h1>)}
        {wrap(`${base}.description`, 'Description', 'richtext', <p className="text-stone-400 font-light text-lg mb-12 max-w-2xl mx-auto">{v(`${base}.description`)}</p>)}
        <a href="mailto:contact@yoannximenes.art" className="inline-block group">
          <span className="font-serif text-2xl md:text-4xl text-stone-200 border-b border-stone-800 group-hover:border-stone-100 group-hover:text-white transition-all duration-300 pb-2">
            contact@yoannximenes.art
          </span>
          <div className="mt-4 text-sm uppercase tracking-widest text-stone-500 group-hover:text-stone-400 transition-colors flex items-center justify-center">
            {v(`${base}.envoyerEmail`)}
            <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </a>
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-stone-800 pt-12">
          <div>
            {wrap(`${base}.atelier`, 'Atelier', 'text', <h3 className="text-stone-100 font-medium mb-2">{v(`${base}.atelier`)}</h3>)}
            {wrap(`${base}.parisFrance`, 'Ville', 'text', <p className="text-stone-500 font-light text-sm">{v(`${base}.parisFrance`)}</p>)}
          </div>
          <div>
            {wrap(`${base}.galerie`, 'Galerie', 'text', <h3 className="text-stone-100 font-medium mb-2">{v(`${base}.galerie`)}</h3>)}
            {wrap(`${base}.galerieText`, 'Texte galerie', 'text', <p className="text-stone-500 font-light text-sm">{v(`${base}.galerieText`)}</p>)}
          </div>
          <div>
            {wrap(`${base}.reseaux`, 'Reseaux', 'text', <h3 className="text-stone-100 font-medium mb-2">{v(`${base}.reseaux`)}</h3>)}
            <div className="flex justify-center space-x-4 mt-2">
              <a
                href="https://www.instagram.com/yoann.ximenes/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-stone-300"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactPublicView() {
  const { lang } = useLanguage();
  const cms = useCmsContent(fallback);
  return <ContactContent mode="public" lang={lang} v={(k) => cms[k] ?? ''} />;
}

function ContactStudioView() {
  const { lang, getValue } = useCmsEditor();
  return <ContactContent mode="studio" lang={lang} v={getValue} />;
}

export default function ContactView({ mode }: { mode: 'public' | 'studio' }) {
  return mode === 'studio' ? <ContactStudioView /> : <ContactPublicView />;
}
