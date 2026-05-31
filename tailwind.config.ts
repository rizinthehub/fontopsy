import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     'var(--color-bg-base)',
          elevated: 'var(--color-bg-elevated)',
          overlay:  'var(--color-bg-overlay)',
          sunken:   'var(--color-bg-sunken)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover:   'var(--color-surface-hover)',
        },
        border: {
          subtle:  'var(--color-border-subtle)',
          DEFAULT: 'var(--color-border-default)',
          strong:  'var(--color-border-strong)',
        },
        text: {
          primary:   'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary:  'var(--color-text-tertiary)',
          disabled:  'var(--color-text-disabled)',
          inverse:   'var(--color-text-inverse)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover:   'var(--color-accent-hover)',
          pressed: 'var(--color-accent-pressed)',
          muted:   'var(--color-accent-muted)',
          glow:    'var(--color-accent-glow)',
        },
        anatomy: {
          baseline:   'var(--color-anatomy-baseline)',
          xheight:    'var(--color-anatomy-xheight)',
          capheight:  'var(--color-anatomy-capheight)',
          ascender:   'var(--color-anatomy-ascender)',
          descender:  'var(--color-anatomy-descender)',
          bbox:       'var(--color-anatomy-bbox)',
        },
        success:      'var(--color-success)',
        'success-bg': 'var(--color-success-bg)',
        warning:      'var(--color-warning)',
        'warning-bg': 'var(--color-warning-bg)',
        error:        'var(--color-error)',
        'error-bg':   'var(--color-error-bg)',
        info:         'var(--color-info)',
        'info-bg':    'var(--color-info-bg)',
        'conf-high':   'var(--color-conf-high)',
        'conf-medium': 'var(--color-conf-medium)',
        'conf-low':    'var(--color-conf-low)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
      },
      maxWidth: {
        container: '1280px',
        content:   '960px',
      },
    },
  },
  plugins: [],
} satisfies Config;