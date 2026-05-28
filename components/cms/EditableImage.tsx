'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdminMode } from '@/contexts/AdminModeContext';

interface EditableImageProps {
  srcKey: string;
  altKey: string;
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

export default function EditableImage({
  srcKey,
  altKey,
  src,
  alt,
  className,
  sizes,
}: EditableImageProps) {
  const { isAdmin } = useAdminMode();
  const [editing, setEditing] = useState(false);
  const [draftSrc, setDraftSrc] = useState(src);
  const [draftAlt, setDraftAlt] = useState(alt);
  const [saving, setSaving] = useState(false);

  const saveField = async (key: string, value: string) =>
    fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        value,
        kind: 'image',
      }),
    });

  const onSave = async () => {
    setSaving(true);
    const [srcResponse, altResponse] = await Promise.all([
      saveField(srcKey, draftSrc),
      saveField(altKey, draftAlt),
    ]);
    setSaving(false);

    if (srcResponse.ok && altResponse.ok) {
      setEditing(false);
      window.location.reload();
    }
  };

  return (
    <div className="relative group h-full w-full">
      <Image src={src} alt={alt} fill className={className} sizes={sizes} />

      {isAdmin && (
        <>
          <button
            type="button"
            onClick={() => setEditing((prev) => !prev)}
            className="absolute top-2 right-2 rounded-full bg-stone-100 text-stone-900 text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            {editing ? 'Fermer' : 'Modifier image'}
          </button>

          {editing && (
            <div className="absolute left-2 right-2 bottom-2 z-20 bg-stone-950/95 border border-stone-700 rounded p-3 space-y-2">
              <input
                value={draftSrc}
                onChange={(e) => setDraftSrc(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1.5 text-xs text-stone-100"
                placeholder="Chemin image (ex: /Images/...)"
              />
              <input
                value={draftAlt}
                onChange={(e) => setDraftAlt(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1.5 text-xs text-stone-100"
                placeholder="Texte alternatif"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={onSave}
                  className="px-3 py-1 rounded bg-stone-100 text-stone-900 text-xs disabled:opacity-60"
                >
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
