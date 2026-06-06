'use client';

import { useState, useEffect } from 'react';
import { FONT_LOAD_TIMEOUT_MS } from '@/lib/constants';

const loadedFamilies = new Set<string>();

export function useFontLoader(family: string) {
  const [loaded, setLoaded] = useState(() => loadedFamilies.has(family));

  useEffect(() => {
    if (loadedFamilies.has(family)) {
      setLoaded(true);
      return;
    }

    // Inject Google Fonts CSS link
    const encoded = family.replace(/ /g, '+');
    const href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;700&display=swap`;

    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }

    // Wait for font to be available
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) setLoaded(true); // fallback after timeout
    }, FONT_LOAD_TIMEOUT_MS);

    document.fonts
      .load(`1em "${family}"`)
      .then(() => {
        if (!cancelled) {
          loadedFamilies.add(family);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true); // show something on error
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [family]);

  return { loaded };
}