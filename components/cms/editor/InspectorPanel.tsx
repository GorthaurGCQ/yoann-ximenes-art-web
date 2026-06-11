'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { getBlockByKey, getCounterpartKey } from '@/lib/cms/registry';
import { editorValueToRichText, richTextToEditorValue } from '@/lib/cms/richText';

export default function InspectorPanel() {
  const {
    selectedKey,
    drafts,
    getValue,
    updateDraft,
    revertBlock,
    publishBlock,
    translateBlock,
    dirtyKeys,
  } = useCmsEditor();
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (!selectedKey) {
    return (
      <aside className="hidden lg:flex lg:flex-col border-l border-stone-800 bg-stone-900/60 p-6 text-stone-400 text-sm">
        <p>Cliquez sur un element de la page pour le modifier.</p>
      </aside>
    );
  }

  const block = getBlockByKey(selectedKey);
  if (!block) return null;

  const value = drafts[selectedKey] ?? getValue(selectedKey);
  const isDirty = dirtyKeys.has(selectedKey);
  const counterpart = getCounterpartKey(selectedKey);
  const isUntranslated =
    block.lang === 'en' &&
    !value.trim() &&
    Boolean(counterpart && getValue(counterpart).trim());

  const onSave = async () => {
    setSaving(true);
    setNotice(null);
    const ok = await publishBlock(selectedKey);
    setSaving(false);
    setNotice(ok ? 'Sauvegarde reussie.' : 'Erreur de sauvegarde.');
  };

  const onTranslate = async () => {
    if (!counterpart) return;
    setTranslating(true);
    setNotice(null);
    const ok = await translateBlock(selectedKey);
    setTranslating(false);
    setNotice(ok ? `Traduit et sauvegarde vers ${counterpart}.` : 'Erreur DeepL.');
  };

  const onImportImage = async (file: File) => {
    setUploading(true);
    setNotice(null);
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
    setUploading(false);
    if (!response.ok) {
      setNotice("Erreur d'import image.");
      return;
    }
    const data = (await response.json()) as { path?: string };
    if (data.path) {
      updateDraft(selectedKey, data.path);
      setNotice(`Image importee: ${data.path}`);
    }
  };

  const editorValue =
    block.kind === 'richtext' ? richTextToEditorValue(value) : value;

  const previewHtml =
    block.kind === 'richtext' ? editorValueToRichText(editorValue) : null;

  return (
    <>
      {/* Desktop inspector */}
      <aside className="hidden lg:flex lg:flex-col border-l border-stone-800 bg-stone-900/60 w-[380px] shrink-0 overflow-auto">
        <div className="p-5 space-y-4 sticky top-0">
          <div title={selectedKey}>
            <h2 className="font-serif text-xl text-stone-100">{block.label}</h2>
            {block.description && (
              <p className="text-xs text-stone-500 mt-1">{block.description}</p>
            )}
            {isUntranslated && (
              <p className="text-xs text-rose-400 mt-2">Non traduit — version FR disponible</p>
            )}
          </div>

          {block.kind === 'image' ? (
            <div className="space-y-3">
              <div className="relative aspect-[4/3] bg-stone-950 border border-stone-800 rounded overflow-hidden">
                {value && (
                  <Image src={value} alt={block.label} fill className="object-cover" sizes="380px" />
                )}
              </div>
              <p className="text-xs text-stone-500 break-all">{value}</p>
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer text-xs px-3 py-1.5 rounded border border-stone-700 text-stone-200">
                  {uploading ? 'Import...' : 'Importer image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onImportImage(file);
                      e.currentTarget.value = '';
                    }}
                  />
                </label>
                {value && (
                  <a
                    href={value}
                    download
                    className="text-xs px-3 py-1.5 rounded border border-stone-700 text-stone-200"
                  >
                    Exporter
                  </a>
                )}
              </div>
            </div>
          ) : block.kind === 'richtext' ? (
            <textarea
              value={editorValue}
              onChange={(e) => updateDraft(selectedKey, e.target.value)}
              className="w-full min-h-40 bg-stone-950 border border-stone-700 rounded px-3 py-2 text-sm text-stone-100"
            />
          ) : (
            <input
              value={editorValue}
              onChange={(e) => updateDraft(selectedKey, e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-sm text-stone-100"
            />
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={saving || !isDirty}
              className="text-sm px-3 py-1.5 rounded bg-stone-100 text-stone-900 disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            {counterpart && block.kind !== 'image' && (
              <button
                type="button"
                onClick={onTranslate}
                disabled={translating}
                className="text-sm px-3 py-1.5 rounded border border-stone-600 text-stone-200 disabled:opacity-50"
              >
                {translating ? 'Traduction...' : `Traduire -> ${counterpart.includes('.en.') ? 'EN' : 'FR'}`}
              </button>
            )}
            {isDirty && (
              <button
                type="button"
                onClick={() => revertBlock(selectedKey)}
                className="text-sm px-3 py-1.5 rounded border border-stone-700 text-stone-300"
              >
                Annuler
              </button>
            )}
          </div>

          {notice && <p className="text-xs text-stone-400">{notice}</p>}

          <div className="border border-stone-800 rounded p-3 bg-stone-950/50">
            <p className="text-xs uppercase tracking-wider text-stone-500 mb-2">Apercu actuel</p>
            {block.kind === 'richtext' && previewHtml ? (
              <div
                className="text-sm text-stone-200 leading-relaxed space-y-2"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : block.kind === 'image' ? (
              <div className="relative aspect-[3/4] max-w-[200px] bg-stone-900 rounded overflow-hidden">
                {value && (
                  <Image src={value} alt="" fill className="object-cover grayscale opacity-90" sizes="200px" />
                )}
              </div>
            ) : (
              <p className="text-sm text-stone-200">{editorValue}</p>
            )}
          </div>
        </div>
      </aside>

      {/* Tablet bottom sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-900 border-t border-stone-700 max-h-[50vh] overflow-auto p-4">
        <p className="font-medium text-stone-100 mb-2">{block.label}</p>
        {block.kind !== 'image' ? (
          <textarea
            value={editorValue}
            onChange={(e) => updateDraft(selectedKey, e.target.value)}
            className="w-full min-h-24 bg-stone-950 border border-stone-700 rounded px-3 py-2 text-sm text-stone-100 mb-2"
          />
        ) : (
          <p className="text-xs text-stone-400 break-all mb-2">{value}</p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={saving || !isDirty}
            className="text-xs px-3 py-1.5 rounded bg-stone-100 text-stone-900"
          >
            Sauvegarder
          </button>
          {block.kind === 'image' && (
            <label className="text-xs px-3 py-1.5 rounded border border-stone-700 cursor-pointer">
              Importer
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImportImage(file);
                }}
              />
            </label>
          )}
        </div>
      </div>
    </>
  );
}
