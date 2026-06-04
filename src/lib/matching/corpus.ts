import corpusData from '@/lib/fonts/corpus.json';
import type { FontMetadata } from '@/types';

const typed = corpusData as {
  generatedAt: string;
  count: number;
  fonts: FontMetadata[];
};

export const CORPUS: FontMetadata[] = typed.fonts;