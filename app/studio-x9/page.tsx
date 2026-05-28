'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ContentKind } from '@/lib/cms/types';

interface CatalogItem {
  key: string;
  value: string;
  kind: ContentKind;
}

interface ChangeLog {
  id: string;
  key: string;
  oldValue: string;
  newValue: string;
  updatedAt: string;
  updatedBy: string;
}

type PageFilter = 'all' | 'accueil' | 'artiste' | 'oeuvres' | 'expositions' | 'actualites' | 'contact';
type KindFilter = 'all' | ContentKind;
type LangFilter = 'all' | 'fr' | 'en' | 'none';

const PAGE_FILTERS: Array<{ id: PageFilter; label: string }> = [
  { id: 'all', label: 'Tout' },
  { id: 'accueil', label: 'Accueil' },
  { id: 'artiste', label: 'Artiste' },
  { id: 'oeuvres', label: 'Oeuvres' },
  { id: 'expositions', label: 'Expositions' },
  { id: 'actualites', label: 'Actualites' },
  { id: 'contact', label: 'Contact' },
];

const KIND_FILTERS: Array<{ id: KindFilter; label: string }> = [
  { id: 'all', label: 'Tous types' },
  { id: 'text', label: 'Texte' },
  { id: 'richtext', label: 'Description' },
  { id: 'image', label: 'Image' },
];

const LANG_FILTERS: Array<{ id: LangFilter; label: string }> = [
  { id: 'all', label: 'Toutes langues' },
  { id: 'fr', label: 'FR' },
  { id: 'en', label: 'EN' },
  { id: 'none', label: 'Sans langue' },
];

function inferPageFromKey(key: string): PageFilter {
  if (key.includes('.index.') || key.includes('home.') || key.includes('.nav.') || key.includes('.footer.'))
    return 'accueil';
  if (key.includes('.artiste.') || key.startsWith('artiste.')) return 'artiste';
  if (key.includes('.oeuvres.') || key.includes('worksData.')) return 'oeuvres';
  if (key.includes('.expositions.')) return 'expositions';
  if (key.includes('.actualites.')) return 'actualites';
  if (key.includes('.contact.')) return 'contact';
  return 'all';
}

function inferLangFromKey(key: string): LangFilter {
  if (key.startsWith('translations.fr.')) return 'fr';
  if (key.startsWith('translations.en.')) return 'en';
  return 'none';
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function richTextToEditorValue(value: string): string {
  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(value);
  if (!hasHtmlTags) return value;

  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .trim();
}

function editorValueToRichText(value: string): string {
  const paragraphs = value
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return '<p></p>';

  return paragraphs
    .map((paragraph) => {
      const withBreaks = paragraph
        .split('\n')
        .map((line) => escapeHtml(line))
        .join('<br>');
      return `<p>${withBreaks}</p>`;
    })
    .join('\n');
}

function renderLivePreview(key: string, value: string, kind: ContentKind) {
  if (key === 'artiste.profileImage.src') {
    return (
      <div className="relative aspect-[3/4] bg-stone-900 border border-stone-800 overflow-hidden rounded">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value}
          alt="Portrait artiste"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
        />
      </div>
    );
  }

  if (key.startsWith('translations.') && key.includes('.artiste.title')) {
    return <h1 className="font-serif text-3xl text-stone-100">{value}</h1>;
  }

  if (key.startsWith('translations.') && key.includes('.artiste.heading')) {
    return <h2 className="text-stone-200 font-medium text-xl">{value}</h2>;
  }

  if (kind === 'image') {
    return (
      <div className="space-y-2">
        <p className="text-xs text-stone-400 break-all">{value}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value}
          alt="Preview"
          className="w-full max-h-56 object-cover rounded border border-stone-800"
        />
      </div>
    );
  }

  if (kind === 'richtext') {
    const html = editorValueToRichText(richTextToEditorValue(value));
    return (
      <div
        className="text-sm text-stone-200 leading-relaxed space-y-3"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <p className="text-sm text-stone-200 whitespace-pre-wrap">{value}</p>;
}

export default function AdminDashboardPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [initialValues, setInitialValues] = useState<Record<string, string>>({});
  const [logs, setLogs] = useState<ChangeLog[]>([]);
  const [query, setQuery] = useState('');
  const [pageFilter, setPageFilter] = useState<PageFilter>('all');
  const [kindFilter, setKindFilter] = useState<KindFilter>('all');
  const [langFilter, setLangFilter] = useState<LangFilter>('all');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const [catalogResponse, logsResponse] = await Promise.all([
        fetch('/api/admin/catalog', { cache: 'no-store' }),
        fetch('/api/admin/content', { cache: 'no-store' }),
      ]);

      if (catalogResponse.ok) {
        const data = (await catalogResponse.json()) as { items: CatalogItem[] };
        setItems(data.items ?? []);
        setInitialValues(
          (data.items ?? []).reduce<Record<string, string>>((acc, item) => {
            acc[item.key] = item.value;
            return acc;
          }, {})
        );
        setActiveKey(data.items?.[0]?.key ?? null);
      }

      if (logsResponse.ok) {
        const data = (await logsResponse.json()) as { logs: ChangeLog[] };
        setLogs(data.logs ?? []);
      }
    };

    run().catch(() => undefined);
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const page = inferPageFromKey(item.key);
      const lang = inferLangFromKey(item.key);
      const matchQuery =
        !q ||
        item.key.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q) ||
        item.kind.toLowerCase().includes(q);
      const matchPage = pageFilter === 'all' || page === pageFilter;
      const matchKind = kindFilter === 'all' || item.kind === kindFilter;
      const matchLang = langFilter === 'all' || lang === langFilter;
      return matchQuery && matchPage && matchKind && matchLang;
    });
  }, [items, kindFilter, langFilter, pageFilter, query]);

  const activeItem = useMemo(
    () => filteredItems.find((item) => item.key === activeKey) ?? filteredItems[0] ?? null,
    [activeKey, filteredItems]
  );
  const activeInitialValue = activeItem ? (initialValues[activeItem.key] ?? '') : '';

  const dirtyCount = useMemo(
    () => items.filter((item) => item.value !== initialValues[item.key]).length,
    [initialValues, items]
  );

  const updateValue = (key: string, value: string) => {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, value } : item)));
  };

  const saveItem = async (item: CatalogItem) => {
    setSavingKey(item.key);
    setNotice(null);
    const valueToSave = item.kind === 'richtext' ? editorValueToRichText(item.value) : item.value;

    const response = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: item.key,
        value: valueToSave,
        kind: item.kind,
      }),
    });

    setSavingKey(null);
    if (!response.ok) {
      setNotice(`Erreur lors de la sauvegarde de ${item.key}`);
      return;
    }

    setNotice(`Sauvegardé: ${item.key}`);
    setInitialValues((prev) => ({ ...prev, [item.key]: item.value }));
    const logsResponse = await fetch('/api/admin/content', { cache: 'no-store' });
    if (logsResponse.ok) {
      const logsData = (await logsResponse.json()) as { logs: ChangeLog[] };
      setLogs(logsData.logs ?? []);
    }
  };

  const translateActiveItem = async () => {
    if (!activeItem) return;
    const lang = inferLangFromKey(activeItem.key);
    if (lang !== 'fr' && lang !== 'en') {
      setNotice('Traduction auto disponible uniquement sur les clés translations FR/EN.');
      return;
    }
    if (activeItem.kind === 'image') {
      setNotice('Traduction indisponible pour les images.');
      return;
    }

    const targetLang = lang === 'fr' ? 'en' : 'fr';
    const targetKey = activeItem.key.replace(`translations.${lang}.`, `translations.${targetLang}.`);
    const targetItem = items.find((item) => item.key === targetKey);
    if (!targetItem) {
      setNotice(`Clé cible introuvable: ${targetKey}`);
      return;
    }

    const sourceText =
      activeItem.kind === 'richtext' ? richTextToEditorValue(activeItem.value) : activeItem.value;

    setTranslating(true);
    setNotice(null);
    const translateResponse = await fetch('/api/admin/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: sourceText,
        sourceLang: lang === 'fr' ? 'FR' : 'EN',
        targetLang: targetLang === 'fr' ? 'FR' : 'EN',
      }),
    });

    setTranslating(false);
    if (!translateResponse.ok) {
      const errorData = (await translateResponse.json()) as { error?: string };
      setNotice(errorData.error ?? 'Erreur de traduction DeepL');
      return;
    }

    const data = (await translateResponse.json()) as { translatedText?: string };
    const translatedText = data.translatedText ?? '';
    updateValue(targetKey, translatedText);

    const targetKind = targetItem.kind;
    const valueToSave = targetKind === 'richtext' ? editorValueToRichText(translatedText) : translatedText;

    const saveResponse = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: targetKey,
        value: valueToSave,
        kind: targetKind,
      }),
    });

    if (!saveResponse.ok) {
      setNotice(`Traduction OK mais sauvegarde KO pour ${targetKey}`);
      return;
    }

    setInitialValues((prev) => ({ ...prev, [targetKey]: translatedText }));
    setNotice(`Traduit et sauvegardé vers ${targetKey}`);
  };

  const importImageForActiveItem = async (file: File) => {
    if (!activeItem || activeItem.kind !== 'image') return;
    setUploading(true);
    setNotice(null);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/media/upload', {
      method: 'POST',
      body: formData,
    });

    setUploading(false);
    if (!response.ok) {
      setNotice("Erreur d'import image");
      return;
    }

    const data = (await response.json()) as { path?: string };
    if (!data.path) {
      setNotice("Erreur d'import image");
      return;
    }

    updateValue(activeItem.key, data.path);
    setNotice(`Image importee: ${data.path}`);
  };

  return (
    <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <header className="mb-6 border border-stone-800 bg-stone-900/40 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-4xl text-stone-100">Dashboard CMS</h1>
            <p className="text-stone-400 mt-2">
              Gère ton contenu en 3 étapes: filtre, modifie, sauvegarde.
            </p>
          </div>
          <div className="text-sm rounded-full border border-stone-700 px-3 py-1 text-stone-300">
            {dirtyCount} modification(s) non sauvegardée(s)
          </div>
        </div>
      </header>

      <section className="mb-6 border border-stone-800 bg-stone-900/40 rounded-xl p-4 space-y-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une clé ou un contenu..."
          className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-stone-100"
        />

        <div className="flex flex-wrap gap-2">
          {PAGE_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setPageFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                pageFilter === filter.id
                  ? 'bg-stone-100 text-stone-900 border-stone-100'
                  : 'border-stone-700 text-stone-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {KIND_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setKindFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                kindFilter === filter.id
                  ? 'bg-stone-100 text-stone-900 border-stone-100'
                  : 'border-stone-700 text-stone-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {LANG_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setLangFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                langFilter === filter.id
                  ? 'bg-stone-100 text-stone-900 border-stone-100'
                  : 'border-stone-700 text-stone-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {notice && <p className="text-sm text-stone-300">{notice}</p>}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <aside className="lg:col-span-1 border border-stone-800 bg-stone-900/40 rounded-xl p-3 max-h-[70vh] overflow-auto">
          <h2 className="text-sm uppercase tracking-wider text-stone-400 mb-3">
            Champs ({filteredItems.length})
          </h2>
          <div className="space-y-2">
            {filteredItems.map((item) => {
              const isDirty = item.value !== initialValues[item.key];
              const isActive = activeItem?.key === item.key;
              const lang = inferLangFromKey(item.key);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveKey(item.key)}
                  className={`w-full text-left rounded p-2 border transition ${
                    isActive
                      ? 'border-stone-200 bg-stone-800'
                      : 'border-stone-800 hover:border-stone-600'
                  }`}
                >
                  <p className="text-xs text-stone-500 mb-1">
                    {item.kind} {lang !== 'none' ? `• ${lang.toUpperCase()}` : ''}
                  </p>
                  <p className="text-sm text-stone-200 break-all">{item.key}</p>
                  {isDirty && <p className="text-xs text-amber-300 mt-1">Modifié</p>}
                </button>
              );
            })}
          </div>
        </aside>

        <article className="lg:col-span-2 border border-stone-800 bg-stone-900/40 rounded-xl p-4">
          {!activeItem ? (
            <p className="text-stone-400">Aucun champ ne correspond aux filtres.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <p className="text-sm text-stone-200 break-all">{activeItem.key}</p>
                <span className="text-xs uppercase tracking-wider text-stone-500">
                  {activeItem.kind}
                </span>
              </div>

              {activeItem.kind === 'text' ? (
                <input
                  value={activeItem.value}
                  onChange={(e) => updateValue(activeItem.key, e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-stone-100"
                />
              ) : activeItem.kind === 'image' ? (
                <div className="border border-stone-800 rounded px-3 py-2 bg-stone-950 text-sm text-stone-300 break-all">
                  {activeItem.value}
                </div>
              ) : (
                <textarea
                  value={richTextToEditorValue(activeItem.value)}
                  onChange={(e) => updateValue(activeItem.key, e.target.value)}
                  className="w-full min-h-44 bg-stone-950 border border-stone-700 rounded px-3 py-2 text-stone-100"
                />
              )}

              <div className="mt-3 flex gap-2">
                {activeItem.kind === 'image' && (
                  <>
                    <label className="rounded border border-stone-700 text-stone-200 text-sm px-3 py-1.5 cursor-pointer">
                      {uploading ? 'Import...' : 'Importer image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            importImageForActiveItem(file).catch(() => {
                              setNotice("Erreur d'import image");
                            });
                          }
                          e.currentTarget.value = '';
                        }}
                      />
                    </label>
                    <a
                      href={activeItem.value}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="rounded border border-stone-700 text-stone-200 text-sm px-3 py-1.5"
                    >
                      Exporter image
                    </a>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => saveItem(activeItem)}
                  disabled={savingKey === activeItem.key}
                  className="rounded bg-stone-100 text-stone-900 text-sm px-3 py-1.5 disabled:opacity-60"
                >
                  {savingKey === activeItem.key ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                {(inferLangFromKey(activeItem.key) === 'fr' ||
                  inferLangFromKey(activeItem.key) === 'en') &&
                  activeItem.kind !== 'image' && (
                    <button
                      type="button"
                      onClick={() => {
                        translateActiveItem().catch(() => {
                          setNotice('Erreur de traduction DeepL');
                        });
                      }}
                      disabled={translating}
                      className="rounded border border-stone-600 text-stone-100 text-sm px-3 py-1.5 disabled:opacity-60"
                    >
                      {translating
                        ? 'Traduction...'
                        : `Traduire vers ${inferLangFromKey(activeItem.key) === 'fr' ? 'EN' : 'FR'}`}
                    </button>
                  )}
                {activeItem.kind !== 'image' && (
                  <button
                    type="button"
                    onClick={() => updateValue(activeItem.key, activeInitialValue)}
                    className="rounded border border-stone-700 text-stone-200 text-sm px-3 py-1.5"
                  >
                    Annuler les changements
                  </button>
                )}
              </div>

              <div className="mt-5 border border-stone-800 rounded p-3 bg-stone-950/50">
                <h3 className="text-sm uppercase tracking-wider text-stone-400 mb-2">
                  Aperçu actuel
                </h3>
                {renderLivePreview(activeItem.key, activeItem.value, activeItem.kind)}
              </div>
            </>
          )}
        </article>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl text-stone-100 mb-4">Historique récent</h2>
        <div className="space-y-2">
          {logs.slice(0, 20).map((log) => (
            <div key={log.id} className="text-xs text-stone-400 border border-stone-800 rounded p-3">
              <p className="text-stone-200 break-all">{log.key}</p>
              <p>Par {log.updatedBy}</p>
              <p>{new Date(log.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
