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

export default function AdminDashboardPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [logs, setLogs] = useState<ChangeLog[]>([]);
  const [query, setQuery] = useState('');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const [catalogResponse, logsResponse] = await Promise.all([
        fetch('/api/admin/catalog', { cache: 'no-store' }),
        fetch('/api/admin/content', { cache: 'no-store' }),
      ]);

      if (catalogResponse.ok) {
        const data = (await catalogResponse.json()) as { items: CatalogItem[] };
        setItems(data.items ?? []);
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
    if (!q) return items;
    return items.filter(
      (item) =>
        item.key.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q) ||
        item.kind.toLowerCase().includes(q)
    );
  }, [items, query]);

  const updateValue = (key: string, value: string) => {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, value } : item)));
  };

  const saveItem = async (item: CatalogItem) => {
    setSavingKey(item.key);
    setNotice(null);

    const response = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: item.key,
        value: item.value,
        kind: item.kind,
      }),
    });

    setSavingKey(null);
    if (!response.ok) {
      setNotice(`Erreur lors de la sauvegarde de ${item.key}`);
      return;
    }

    setNotice(`Sauvegardé: ${item.key}`);
    const logsResponse = await fetch('/api/admin/content', { cache: 'no-store' });
    if (logsResponse.ok) {
      const logsData = (await logsResponse.json()) as { logs: ChangeLog[] };
      setLogs(logsData.logs ?? []);
    }
  };

  return (
    <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="font-serif text-4xl text-stone-100">Dashboard CMS</h1>
        <p className="text-stone-400 mt-2">
          Modifie les contenus du site (textes, descriptions, images) depuis cette page privée.
        </p>
      </header>

      <section className="mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une clé, un texte, un type..."
          className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-stone-100"
        />
        {notice && <p className="text-sm text-stone-300 mt-3">{notice}</p>}
      </section>

      <section className="space-y-3">
        {filteredItems.map((item) => (
          <article key={item.key} className="border border-stone-800 bg-stone-900/50 rounded p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <p className="text-sm text-stone-200 break-all">{item.key}</p>
              <span className="text-xs uppercase tracking-wider text-stone-500">{item.kind}</span>
            </div>

            {item.kind === 'text' ? (
              <input
                value={item.value}
                onChange={(e) => updateValue(item.key, e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-stone-100"
              />
            ) : (
              <textarea
                value={item.value}
                onChange={(e) => updateValue(item.key, e.target.value)}
                className="w-full min-h-24 bg-stone-950 border border-stone-700 rounded px-3 py-2 text-stone-100"
              />
            )}

            <div className="mt-3">
              <button
                type="button"
                onClick={() => saveItem(item)}
                disabled={savingKey === item.key}
                className="rounded bg-stone-100 text-stone-900 text-sm px-3 py-1.5 disabled:opacity-60"
              >
                {savingKey === item.key ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-12">
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
