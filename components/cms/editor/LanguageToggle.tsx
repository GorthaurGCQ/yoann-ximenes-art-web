'use client';

import { useCmsEditor } from '@/contexts/CmsEditorContext';

export default function LanguageToggle() {
  const { lang, setLang, hasDirtyChanges, revertAll } = useCmsEditor();

  const switchLang = (next: 'fr' | 'en') => {
    if (next === lang) return;
    if (hasDirtyChanges()) {
      const ok = window.confirm(
        'Des modifications non sauvegardees existent. Continuer sans publier ?'
      );
      if (!ok) return;
      revertAll();
    }
    setLang(next);
  };

  return (
    <div className="flex rounded-full border border-stone-700 overflow-hidden text-xs">
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchLang(l)}
          className={`px-3 py-1.5 uppercase tracking-wider transition ${
            lang === l ? 'bg-stone-100 text-stone-900' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
