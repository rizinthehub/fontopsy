'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  getRecentEntries,
  addRecentEntry,
  type RecentEntry,
} from '@/lib/storage/recentAnalyses';

export function useRecentAnalyses() {
  const [entries, setEntries] = useState<RecentEntry[]>([]);

  // Load on mount (client-only)
  useEffect(() => {
    setEntries(getRecentEntries());
  }, []);

  const add = useCallback((entry: RecentEntry) => {
    addRecentEntry(entry);
    setEntries(getRecentEntries());
  }, []);

  const clear = useCallback(() => {
    setEntries([]);
  }, []);

  return { entries, add, clear };
}