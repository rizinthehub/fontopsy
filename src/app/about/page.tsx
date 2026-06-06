import { PageShell } from '@/components/layout/PageShell';

export default function AboutPage() {
  return (
    <PageShell>
      <div className="max-w-[720px] mx-auto py-16 space-y-10">
        {/* Header */}
        <div>
          <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-3">
            About
          </p>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight mb-4">
            Font Autopsy, not just Font ID.
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            Fontopsy is a free font identification and analysis tool that turns
            any image containing text into a complete typographic breakdown —
            anatomy, free alternatives, and pairing suggestions in under five
            seconds.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border-subtle" />

        {/* What it does */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            What Fontopsy does
          </h2>
          <ul className="space-y-3 text-text-secondary">
            {[
              'Extracts text from your image using Google Cloud Vision OCR.',
              'Identifies the closest matching font from a curated library of 200 Google Fonts.',
              'Renders an interactive typographic anatomy overlay — baseline, x-height, cap height, ascenders, and descenders — labeled like a clinical diagram.',
              'Suggests three free Google Fonts alternatives with live previews.',
              'Provides curated font pairing suggestions for complete type systems.',
              'Exports a shareable 1200×630 PNG card for client decks and social posts.',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-accent mt-0.5 shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-border-subtle" />

        {/* What it isn't */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            What it isn&apos;t
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Fontopsy is not a font search engine, a font store, or a design
            tool. It doesn&apos;t support paid or custom fonts, real-time camera
            capture, or non-Latin scripts. It&apos;s a focused, single-purpose
            tool for the specific moment you see a font in the wild and need to
            know what it is.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border-subtle" />

        {/* Credits */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Credits & Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Google Cloud Vision API', role: 'OCR text extraction' },
              { name: 'Google Fonts', role: 'Font library & delivery' },
              { name: 'Uploadthing', role: 'Image upload CDN' },
              { name: 'Vercel', role: 'Hosting & edge rendering' },
              { name: 'Next.js 14', role: 'App framework' },
              { name: 'Tailwind CSS', role: 'Styling system' },
              { name: 'Radix UI', role: 'Accessible primitives' },
              { name: 'Framer Motion', role: 'Animations' },
            ].map((credit) => (
              <div
                key={credit.name}
                className="bg-bg-elevated border border-border rounded-md px-4 py-3"
              >
                <p className="text-sm font-medium text-text-primary">
                  {credit.name}
                </p>
                <p className="font-mono text-xs text-text-tertiary mt-0.5">
                  {credit.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border-subtle" />

        {/* Privacy */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Privacy
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Images you upload are stored temporarily on Uploadthing&apos;s CDN
            and used only for OCR analysis. They are automatically deleted after
            7 days. No user accounts, no tracking beyond anonymous analytics,
            no data sold to third parties.
          </p>
        </div>
      </div>
    </PageShell>
  );
}