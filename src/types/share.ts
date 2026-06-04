import type { ShortId } from './common';

export interface ShareCardPayload {
  id: ShortId;
  identifiedFamily: string;
  designer: string;
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
  license: 'OFL' | 'Apache-2.0' | 'UFL' | 'MIT';
  alternatives: string[];
  v: 1;
}