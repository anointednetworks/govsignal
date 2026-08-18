import { useEffect, useState } from 'react';

export interface Bid {
  id: number;
  sam_id: string;
  title: string;
  notice_type: string | null;
  agency: string | null;
  state_code: string | null;
  naics_code: string | null;
  set_aside: string | null;
  posted_date: string | null;
  response_deadline: string | null;
  sam_url: string | null;
  category: string | null;
  status: string;
}

interface UseBidsOptions {
  limit?: number;
  offset?: number;
  category?: string;
  state?: string;
  status?: string;
  search?: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? '';

export function useBids(opts: UseBidsOptions = {}) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    if (!API_URL) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (opts.status)   params.set('status',   opts.status);
      if (opts.category) params.set('category', opts.category);
      if (opts.state)    params.set('state',    opts.state);
      if (opts.search)   params.set('search',   opts.search);
      if (opts.limit)    params.set('limit',    String(opts.limit));
      if (opts.offset)   params.set('offset',   String(opts.offset));

      try {
        const res  = await fetch(`${API_URL}/bids?${params}`);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();

        if (cancelled) return;
        setBids(data.bids ?? []);
        setTotal(data.total ?? null);
      } catch (err: unknown) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [opts.limit, opts.offset, opts.category, opts.state, opts.status, opts.search]);

  return { bids, loading, error, total };
}
