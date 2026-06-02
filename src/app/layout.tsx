import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({
  src: '../../public/fonts/inter-variable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
});

const jetbrainsMono = localFont({
  src: '../../public/fonts/jetbrains-mono-variable.woff2',
  variable: '--font-mono',
  display: 'swap',
  weight: '100 800',
});

export const metadata: Metadata = {
  title: 'Fontopsy — Identify Any Font',
  description:
    'Drop a screenshot. We\'ll do the autopsy — anatomy, alternatives, and pairings in under five seconds.',
  openGraph: {
    title: 'Fontopsy — Identify Any Font',
    description: 'Font identification, anatomy overlay, free alternatives, and pairings.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-bg-base text-text-primary">
        {children}
      </body>
    </html>
  );
}