import { describe, it, expect } from 'vitest';
import { cn, formatBytes, median, toKebabCase } from '@/lib/utils';

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('resolves Tailwind conflicts (last wins)', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles undefined and null gracefully', () => {
    expect(cn(undefined, null, 'foo')).toBe('foo');
  });
});

describe('formatBytes()', () => {
  it('formats 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('formats kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('formats megabytes', () => {
    expect(formatBytes(5 * 1024 * 1024)).toBe('5 MB');
  });

  it('formats fractional MB', () => {
    expect(formatBytes(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });
});

describe('median()', () => {
  it('returns 0 for empty array', () => {
    expect(median([])).toBe(0);
  });

  it('returns the single value for a one-element array', () => {
    expect(median([42])).toBe(42);
  });

  it('returns middle value for odd-length array', () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  it('returns average of two middle values for even-length array', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it('handles duplicate values', () => {
    expect(median([5, 5, 5])).toBe(5);
  });
});

describe('toKebabCase()', () => {
  it('converts spaces to hyphens', () => {
    expect(toKebabCase('Playfair Display')).toBe('playfair-display');
  });

  it('lowercases everything', () => {
    expect(toKebabCase('Inter')).toBe('inter');
  });

  it('strips special characters', () => {
    expect(toKebabCase('JetBrains Mono!')).toBe('jetbrains-mono');
  });
});