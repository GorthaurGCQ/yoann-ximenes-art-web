'use client';

import { useState } from 'react';
import { useCmsEditor } from '@/contexts/CmsEditorContext';

export default function UnsavedChangesBar() {
  const { dirtyCount, revertAll, publishAll } = useCmsEditor();
  const [publishing, setPublishing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (dirtyCount === 0) return null;

  const onPublishAll = async () => {
    setPublishing(true);
    setNotice(null);
    const ok = await publishAll();
    setPublishing(false);
    setNotice(ok ? 'Toutes les modifications ont ete publiees.' : 'Erreur lors de la publication.');
  };

  return (
    <div className="bg-amber-950/80 border-b border-amber-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm text-amber-200">
        {dirtyCount} modification(s) non sauvegardee(s)
        {notice && <span className="ml-2 text-amber-100/80">— {notice}</span>}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={revertAll}
          className="text-xs px-3 py-1.5 rounded border border-amber-700 text-amber-100"
        >
          Annuler tout
        </button>
        <button
          type="button"
          onClick={onPublishAll}
          disabled={publishing}
          className="text-xs px-3 py-1.5 rounded bg-amber-100 text-amber-950 disabled:opacity-60"
        >
          {publishing ? 'Publication...' : 'Publier tout'}
        </button>
      </div>
    </div>
  );
}
