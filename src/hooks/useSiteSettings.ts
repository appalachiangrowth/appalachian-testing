import { useState, useEffect, useRef } from 'react';

export interface SiteSettings {
  [key: string]: string;
}

const CACHE_TTL_MS = 10_000; // 10 seconds

let cachedData: SiteSettings | null = null;
let cachedAt = 0;
let cachedPromise: Promise<SiteSettings> | null = null;

function fetchSettings(): Promise<SiteSettings> {
  if (cachedPromise) return cachedPromise;

  cachedPromise = fetch('/api/public/settings')
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      return res.json();
    })
    .then((result: SiteSettings) => {
      cachedData = result;
      cachedAt = Date.now();
      cachedPromise = null;
      return result;
    })
    .catch((err) => {
      cachedPromise = null;
      throw err;
    });

  return cachedPromise;
}

export function useSiteSettings() {
  const [data, setData] = useState<SiteSettings | null>(cachedData);
  const [isLoading, setIsLoading] = useState(() => !cachedData);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const refresh = () => {
      if (!mountedRef.current) return;
      fetchSettings()
        .then((result) => {
          if (!mountedRef.current) return;
          setData(result);
          setIsLoading(false);
          setError(null);
        })
        .catch((err) => {
          if (!mountedRef.current) return;
          setError(err);
          setIsLoading(false);
        });
    };

    if (cachedData && (Date.now() - cachedAt) < CACHE_TTL_MS) {
      const interval = setInterval(refresh, 30_000);
      return () => { mountedRef.current = false; clearInterval(interval); };
    }

    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => { mountedRef.current = false; clearInterval(interval); };
  }, []);

  return { data, isLoading, error };
}
