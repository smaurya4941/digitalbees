import { cn } from '@/lib/utils/cn';

/**
 * Post cover image with a branded fallback when the editor has not set one,
 * so grids stay visually even.
 */
export function PostCover({
  src,
  alt,
  className,
  eager = false,
}: {
  src?: string;
  alt?: string;
  className?: string;
  eager?: boolean;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image on an arbitrary host
      <img
        src={src}
        alt={alt ?? ''}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        className={cn('h-full w-full object-cover', className)}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        'relative h-full min-h-[160px] w-full overflow-hidden bg-gradient-to-br from-[#0B1F3A] via-[#132B4F] to-[#071527]',
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: 'radial-gradient(rgba(198,150,58,0.35) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
      />
      <span className="absolute bottom-4 left-4 font-extrabold tracking-tight text-[#C6963A]/80">TeamBees</span>
    </div>
  );
}
