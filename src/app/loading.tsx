import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg-base">
      <Spinner size="lg" />
    </div>
  );
}