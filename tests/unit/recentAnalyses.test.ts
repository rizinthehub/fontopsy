import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Import after mock is set up
import {
  getRecentEntries,
  addRecentEntry,
  type RecentEntry,
} from '@/lib/storage/recentAnalyses';

function makeEntry(id: string): RecentEntry {
  return {
    id,
    family: `Font ${id}`,
    category: 'sans-serif',
    thumbnailUrl: `https://utfs.io/f/${id}`,
    createdAt: new Date().toISOString(),
  };
}

describe('recentAnalyses storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('starts with an empty list', () => {
    expect(getRecentEntries()).toEqual([]);
  });

  it('adds an entry to the front of the list', () => {
    addRecentEntry(makeEntry('aaa'));
    addRecentEntry(makeEntry('bbb'));
    const entries = getRecentEntries();
    expect(entries[0]?.id).toBe('bbb');
    expect(entries[1]?.id).toBe('aaa');
  });

  it('caps the list at 5 entries', () => {
    for (let i = 0; i < 7; i++) {
      addRecentEntry(makeEntry(`id${i}`));
    }
    expect(getRecentEntries().length).toBe(5);
  });

  it('keeps the most recent entries when capping', () => {
    for (let i = 0; i < 7; i++) {
      addRecentEntry(makeEntry(`id${i}`));
    }
    const entries = getRecentEntries();
    expect(entries[0]?.id).toBe('id6');
    expect(entries[4]?.id).toBe('id2');
  });

  it('deduplicates by id — moves existing entry to front', () => {
    addRecentEntry(makeEntry('aaa'));
    addRecentEntry(makeEntry('bbb'));
    addRecentEntry(makeEntry('aaa')); // duplicate
    const entries = getRecentEntries();
    expect(entries[0]?.id).toBe('aaa');
    expect(entries.filter((e) => e.id === 'aaa').length).toBe(1);
  });

  it('tolerates corrupt JSON in localStorage', () => {
    localStorageMock.setItem('fontopsy.recent', 'NOT_VALID_JSON{{{{');
    expect(() => getRecentEntries()).not.toThrow();
    expect(getRecentEntries()).toEqual([]);
  });

  it('tolerates wrong schema version', () => {
    localStorageMock.setItem(
      'fontopsy.recent',
      JSON.stringify({ v: 99, entries: [makeEntry('x')] }),
    );
    // v !== 1 → reset to empty
    expect(getRecentEntries()).toEqual([]);
  });
});