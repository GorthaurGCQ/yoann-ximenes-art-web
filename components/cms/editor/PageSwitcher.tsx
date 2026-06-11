'use client';

import { useRouter } from 'next/navigation';
import { CMS_PAGES } from '@/lib/cms/registry';
import { useCmsEditor } from '@/contexts/CmsEditorContext';

export default function PageSwitcher() {
  const router = useRouter();
  const { page, hasDirtyChanges, revertAll } = useCmsEditor();

  const onChange = (nextPage: string) => {
    if (nextPage === page) return;
    if (hasDirtyChanges()) {
      const ok = window.confirm(
        'Des modifications non sauvegardees existent. Changer de page sans publier ?'
      );
      if (!ok) return;
      revertAll();
    }
    router.push(`/studio-x9/edit/${nextPage}`);
  };

  return (
    <select
      value={page}
      onChange={(e) => onChange(e.target.value)}
      className="bg-stone-900 border border-stone-700 rounded px-3 py-1.5 text-sm text-stone-100"
    >
      {CMS_PAGES.map((p) => (
        <option key={p.id} value={p.id}>
          {p.label}
        </option>
      ))}
    </select>
  );
}
