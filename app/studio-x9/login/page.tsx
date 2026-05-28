'use client';

import { FormEvent, useState } from 'react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? 'Connexion impossible');
      return;
    }

    window.location.href = '/studio-x9';
  };

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-stone-800 rounded-lg p-6 bg-stone-900/50 space-y-4"
      >
        <h1 className="font-serif text-2xl">Connexion administration</h1>
        <p className="text-sm text-stone-400">
          Cette page est privée. Utilise tes identifiants admin.
        </p>

        <div className="space-y-2">
          <label className="text-sm text-stone-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-stone-300" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-stone-100 text-stone-900 py-2 font-medium disabled:opacity-60"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </main>
  );
}
