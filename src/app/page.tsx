import { PageShell } from '@/components/layout/PageShell';
import { UploadZone } from '@/components/upload/UploadZone';
import { RecentAnalyses } from '@/components/recent/RecentAnalyses';
import { COPY } from '@/lib/copy';

export default function Home() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="pt-16 pb-10 md:pt-24 md:pb-12">
        <h1 className="font-sans text-4xl md:text-5xl font-bold text-text-primary tracking-tight max-w-[720px]">
          {COPY['hero.headline']}
        </h1>
        <p className="mt-4 text-lg text-text-secondary max-w-[560px]">
          {COPY['hero.subheading']}
        </p>
      </section>

      {/* Upload zone */}
      <section aria-label="Upload image">
        <UploadZone />
      </section>

      {/* Recent analyses */}
      <section className="mt-12" aria-label="Recent analyses">
        <RecentAnalyses />
      </section>
    </PageShell>
  );
}