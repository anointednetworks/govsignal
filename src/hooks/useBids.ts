import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Bid {
  id: string;
  sam_id: string;
  title: string;
  notice_type: string | null;
  agency: string | null;
  sub_agency: string | null;
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
  category?: string;
  state?: string;
  status?: string;
}

export function useBids(opts: UseBidsOptions = {}) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('bids')
        .select('*', { count: 'exact' })
        .eq('status', opts.status ?? 'active')
        .order('response_deadline', { ascending: true });

      if (opts.category) query = query.eq('category', opts.category);
      if (opts.state)    query = query.eq('state_code', opts.state);
      if (opts.limit)    query = query.limit(opts.limit);

      const { data, error: err, count } = await query;

      if (cancelled) return;

      if (err) {
        setError(err.message);
      } else {
        setBids(data ?? []);
        setTotal(count);
      }
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [opts.limit, opts.category, opts.state, opts.status]);

  return { bids, loading, error, total };
}
