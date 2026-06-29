'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCmsEditor } from '@/contexts/CmsEditorContext';
import { getBlockByKey, getCounterpartKey } from '@/lib/cms/registry';
import type { ContentKind } from '@/lib/cms/types';
import { editorValueToRichText, richTextToEditorValue } from '@/lib/cms/richText';

function resolveLangKeys(selectedKey: string): { fr: string; en: string } | null {
  const counterpart = getCounterpartKey(selectedKey);
  if (!counterpart) return null;

  const block = getBlockByKey(selectedKey);
  if (block?.lang === 'fr') return { fr: selectedKey, en: counterpart };
  if (block?.lang === 'en') return { fr: counterpart, en: selectedKey };
  if (selectedKey.endsWith('.fr')) return { fr: selectedKey, en: counterpart };
  if (selectedKey.endsWith('.en')) return { fr: counterpart, en: selectedKey };

  return null;
}

function LangField({
  label,
  fieldKey,
  kind,
  value,
  onChange,
}: {
  label: string;
  fieldKey: string;
  kind: ContentKind;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  const editorValue = kind === 'richtext' ? richTextToEditorValue(value) : value;

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-wider text-stone-500">{label}</label>
      {kind === 'richtext' ? (
        <textarea
          dir="ltr"
          value={editorValue}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="w-full min-h-28 bg-stone-950 border border-stone-700 rounded px-3 py-2 text-sm text-stone-100"
        />
      ) : (
        <input
          dir="ltr"
          value={editorValue}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-sm text-stone-100"
        />
      )}
    </div>
  );
}

export default function InspectorPanel() {
  const {
    lang,
    selectedKey,
    getValue,
    updateDraft,
    revertBlock,
    publishBlock,
    isBlockDirty,
  } = useCmsEditor();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (!selectedKey) {
    return (
      <aside className="hidden lg:flex lg:flex-col border-l border-stone-800 bg-stone-900/60 p-5 text-stone-400 text-sm w-[320px] shrink-0">
        <p>
          Cliquez sur un texte pour l&apos;editer. Le panneau affiche les champs FR et EN. Utilisez le
          selecteur FR/EN en haut pour previsualiser la langue comme sur le site public.
        </p>
      </aside>
    );
  }

  const block = getBlockByKey(selectedKey);
  if (!block) return null;

  const langKeys = resolveLangKeys(selectedKey);
  const value = getValue(selectedKey);
  const keysToManage = langKeys ? [langKeys.fr, langKeys.en] : [selectedKey];
  const isDirty = keysToManage.some((key) => isBlockDirty(key));
  const isUntranslated =
    langKeys !== null &&
    !getValue(langKeys.en).trim() &&
    Boolean(getValue(langKeys.fr).trim());

  const onSave = async () => {
    setSaving(true);
    setNotice(null);
    let allOk = true;
    for (const key of keysToManage) {
      if (isBlockDirty(key)) {
        const ok = await publishBlock(key);
        if (!ok) allOk = false;
      }
    }
    setSaving(false);
    setNotice(allOk ? 'Sauvegarde reussie.' : 'Erreur de sauvegarde.');
  };

  const onRevert = () => {
    for (const key of keysToManage) {
      if (isBlockDirty(key)) revertBlock(key);
    }
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

  const previewKey = langKeys ? (lang === 'fr' ? langKeys.fr : langKeys.en) : selectedKey;
  const previewBlock = getBlockByKey(previewKey) ?? block;
  const previewValue = getValue(previewKey);
  const previewEditorValue =
    previewBlock.kind === 'richtext' ? richTextToEditorValue(previewValue) : previewValue;
  const previewHtml =
    previewBlock.kind === 'richtext' ? editorValueToRichText(previewEditorValue) : null;

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col border-l border-stone-800 bg-stone-900/60 w-[320px] shrink-0 overflow-auto">
        <div className="p-5 space-y-4 sticky top-0">
          <div title={selectedKey}>
            <h2 className="font-serif text-xl text-stone-100">{block.label}</h2>
            {block.description && (
              <p className="text-xs text-stone-500 mt-1">{block.description}</p>
            )}
            {isUntranslated && (
              <p className="text-xs text-rose-400 mt-2">Version EN vide — a completer</p>
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
          ) : langKeys ? (
            <div className="space-y-4">
              <LangField
                label="Francais"
                fieldKey={langKeys.fr}
                kind={block.kind}
                value={getValue(langKeys.fr)}
                onChange={updateDraft}
              />
              <LangField
                label="Anglais"
                fieldKey={langKeys.en}
                kind={block.kind}
                value={getValue(langKeys.en)}
                onChange={updateDraft}
              />
            </div>
          ) : block.kind === 'richtext' ? (
            <textarea
              dir="ltr"
              value={richTextToEditorValue(value)}
              onChange={(e) => updateDraft(selectedKey, e.target.value)}
              className="w-full min-h-40 bg-stone-950 border border-stone-700 rounded px-3 py-2 text-sm text-stone-100"
            />
          ) : (
            <input
              dir="ltr"
              value={value}
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
            {isDirty && (
              <button
                type="button"
                onClick={onRevert}
                className="text-sm px-3 py-1.5 rounded border border-stone-700 text-stone-300"
              >
                Annuler
              </button>
            )}
          </div>

          {notice && <p className="text-xs text-stone-400">{notice}</p>}

          {block.kind !== 'image' && (
            <div className="border border-stone-800 rounded p-3 bg-stone-950/50">
              <p className="text-xs uppercase tracking-wider text-stone-500 mb-2">
                Apercu ({lang.toUpperCase()})
              </p>
              {previewBlock.kind === 'richtext' && previewHtml ? (
                <div
                  className="text-sm text-stone-200 leading-relaxed space-y-2"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <p className="text-sm text-stone-200">{previewEditorValue}</p>
              )}
            </div>
          )}
        </div>
      </aside>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-900 border-t border-stone-700 max-h-[50vh] overflow-auto p-4">
        <p className="font-medium text-stone-100 mb-2">{block.label}</p>
        {block.kind === 'image' ? (
          <p className="text-xs text-stone-400 break-all mb-2">{value}</p>
        ) : langKeys ? (
          <div className="space-y-3 mb-2">
            <LangField
              label="Francais"
              fieldKey={langKeys.fr}
              kind={block.kind}
              value={getValue(langKeys.fr)}
              onChange={updateDraft}
            />
            <LangField
              label="Anglais"
              fieldKey={langKeys.en}
              kind={block.kind}
              value={getValue(langKeys.en)}
              onChange={updateDraft}
            />
          </div>
        ) : (
          <textarea
            dir="ltr"
            value={block.kind === 'richtext' ? richTextToEditorValue(value) : value}
            onChange={(e) => updateDraft(selectedKey, e.target.value)}
            className="w-full min-h-24 bg-stone-950 border border-stone-700 rounded px-3 py-2 text-sm text-stone-100 mb-2"
          />
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
