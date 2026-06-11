'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAdminMode } from '@/contexts/AdminModeContext';

const PATH_TO_STUDIO: Record<string, string> = {
  '/': '/studio-x9/edit/accueil',
  '/artiste': '/studio-x9/edit/artiste',
  '/oeuvres': '/studio-x9/edit/oeuvres',
  '/expositions': '/studio-x9/edit/expositions',
  '/actualites': '/studio-x9/edit/actualites',
  '/contact': '/studio-x9/edit/contact',
};

export default function AdminFloatingControls() {
  const { isAdmin, setIsAdmin } = useAdminMode();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  if (!isAdmin) return null;

  const studioHref = PATH_TO_STUDIO[pathname ?? ''] ?? '/studio-x9/edit/accueil';

  const onLogout = async () => {
    setLoading(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAdmin(false);
    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <a
        href={studioHref}
        className="rounded-full bg-stone-100 text-stone-900 px-4 py-2 text-xs uppercase tracking-wider shadow-lg"
      >
        Studio
      </a>
      <button
        type="button"
        onClick={onLogout}
        disabled={loading}
        className="rounded-full bg-stone-800 border border-stone-600 text-stone-100 px-4 py-2 text-xs uppercase tracking-wider shadow-lg disabled:opacity-70"
      >
        {loading ? 'Déconnexion...' : 'Déconnexion'}
      </button>
    </div>
  );
}
