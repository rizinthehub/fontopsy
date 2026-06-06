export type AnatomyTerm =
  | 'baseline'
  | 'xHeight'
  | 'capHeight'
  | 'ascender'
  | 'descender';

export const ANATOMY_TERMS: Record<
  AnatomyTerm,
  { label: string; definition: string; color: string }
> = {
  baseline: {
    label: 'BASELINE',
    definition:
      'The invisible line letters sit on. The foundation of every typeface.',
    color: '--color-anatomy-baseline',
  },
  xHeight: {
    label: 'X-HEIGHT',
    definition:
      'The height of lowercase letters without ascenders. Larger x-heights feel more readable.',
    color: '--color-anatomy-xheight',
  },
  capHeight: {
    label: 'CAP HEIGHT',
    definition:
      'The height of uppercase letters. Often shorter than ascenders in modern fonts.',
    color: '--color-anatomy-capheight',
  },
  ascender: {
    label: 'ASCENDER',
    definition:
      'The part of a letter that extends above the x-height (the top of h, k, b).',
    color: '--color-anatomy-ascender',
  },
  descender: {
    label: 'DESCENDER',
    definition:
      'The part of a letter that drops below the baseline (the tail of g, p, y).',
    color: '--color-anatomy-descender',
  },
};

export const ANATOMY_TERM_ORDER: AnatomyTerm[] = [
  'ascender',
  'capHeight',
  'xHeight',
  'baseline',
  'descender',
];