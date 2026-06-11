'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CONTENT_REGISTRY } from '@/lib/cms/registry';
import { useCmsEditor } from '@/contexts/CmsEditorContext';

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { selectBlock, setLang, hasDirtyChanges, revertAll } = useCmsEditor();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CONTENT_REGISTRY.slice(0, 12);
    return CONTENT_REGISTRY.filter(
      (b) =>
        b.label.toLowerCase().includes(q) ||
        b.key.toLowerCase().includes(q) ||
        (b.description?.toLowerCase().includes(q) ?? false)
    ).slice(0, 20);
  }, [query]);

  const goToBlock = (page: string, key: string, lang?: 'fr' | 'en') => {
    if (hasDirtyChanges()) {
      const ok = window.confirm('Modifications non sauvegardees. Continuer ?');
      if (!ok) return;
      revertAll();
    }
    if (lang) setLang(lang);
    router.push(`/studio-x9/edit/${page}`);
    setTimeout(() => selectBlock(key), 300);
    setOpen(false);
    setQuery('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-[15vh] px-4">
      <div className="w-full max-w-lg bg-stone-900 border border-stone-700 rounded-xl shadow-2xl overflow-hidden">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un contenu... (Esc pour fermer)"
          className="w-full bg-stone-950 border-b border-stone-800 px-4 py-3 text-stone-100 outline-none"
        />
        <ul className="max-h-72 overflow-auto">
          {results.map((block) => (
            <li key={block.key}>
              <button
                type="button"
                onClick={() => goToBlock(block.page, block.key, block.lang)}
                className="w-full text-left px-4 py-3 hover:bg-stone-800 border-b border-stone-800/50"
              >
                <p className="text-sm text-stone-100">{block.label}</p>
                <p className="text-xs text-stone-500">
                  {block.page}
                  {block.lang ? ` • ${block.lang.toUpperCase()}` : ''}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
