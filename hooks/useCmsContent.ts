'use client';

import { useEffect, useMemo, useState } from 'react';

export function useCmsContent<T extends Record<string, string>>(fallbackValues: T): T {
  const [values, setValues] = useState<Record<string, string>>(fallbackValues);

  const keys = useMemo(() => Object.keys(fallbackValues), [fallbackValues]);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      const params = new URLSearchParams({
        keys: keys.join(','),
      });

      const response = await fetch(`/api/cms/content?${params.toString()}`, {
        signal: controller.signal,
        cache: 'no-store',
      });

      if (!response.ok) return;
      const data = (await response.json()) as { values?: Record<string, string> };
      if (!data.values) return;
      setValues((prev) => ({ ...prev, ...data.values }));
    };

    run().catch(() => undefined);
    return () => controller.abort();
  }, [keys]);

  return values as T;
}
