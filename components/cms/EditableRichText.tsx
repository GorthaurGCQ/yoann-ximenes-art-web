'use client';

import { useState } from 'react';
import { useAdminMode } from '@/contexts/AdminModeContext';

interface EditableRichTextProps {
  contentKey: string;
  value: string;
  className?: string;
}

export default function EditableRichText({ contentKey, value, className }: EditableRichTextProps) {
  const { isAdmin } = useAdminMode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    const response = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: contentKey,
        value: draft,
        kind: 'richtext',
      }),
    });

    setSaving(false);
    if (response.ok) {
      setEditing(false);
      window.location.reload();
    }
  };

  if (!isAdmin) {
    return <p className={className}>{value}</p>;
  }

  return (
    <div className="relative group">
      {!editing ? (
        <>
          <p className={className}>{value}</p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="absolute -top-3 -right-3 rounded-full bg-stone-100 text-stone-900 text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Modifier
          </button>
        </>
      ) : (
        <div className="space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full min-h-40 bg-stone-950 border border-stone-700 rounded p-3 text-sm text-stone-100"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={onSave}
              className="px-3 py-1.5 rounded bg-stone-100 text-stone-900 text-sm disabled:opacity-60"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(value);
                setEditing(false);
              }}
              className="px-3 py-1.5 rounded border border-stone-700 text-stone-200 text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
