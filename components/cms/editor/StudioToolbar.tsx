'use client';

import { useRouter } from 'next/navigation';
import LanguageToggle from './LanguageToggle';
import PageSwitcher from './PageSwitcher';
import { useCmsEditor } from '@/contexts/CmsEditorContext';

export default function StudioToolbar() {
  const router = useRouter();
  const { dirtyCount } = useCmsEditor();

  const onLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/studio/login');
  };

  return (
    <header className="h-14 border-b border-stone-800 bg-stone-950 flex items-center justify-between px-4 gap-4 shrink-0">
      <div className="flex items-center gap-4">
        <span className="font-serif text-lg text-stone-100 hidden sm:inline">Studio</span>
        <PageSwitcher />
        <LanguageToggle />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          className="text-xs text-stone-500 border border-stone-800 rounded px-2 py-1 hidden md:inline"
        >
          Ctrl+K
        </button>
        {dirtyCount > 0 && (
          <span className="text-xs text-amber-300">{dirtyCount} modif.</span>
        )}
        <a href="/" target="_blank" rel="noreferrer" className="text-xs text-stone-400 hover:text-stone-200">
          Voir le site
        </a>
        <button
          type="button"
          onClick={onLogout}
          className="text-xs px-3 py-1.5 rounded border border-stone-700 text-stone-300"
        >
          Deconnexion
        </button>
      </div>
    </header>
  );
}
