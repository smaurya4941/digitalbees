'use client';

import { useState } from 'react';
import { Check, Link2, Mail } from 'lucide-react';
import { LinkedinIcon, TwitterIcon } from '@/components/ui/SocialIcons';
import { cn } from '@/lib/utils/cn';

/** Share links (LinkedIn, X, email) plus copy-to-clipboard for the post URL. */
export function ShareButtons({ url, title, className }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context / permissions) — fail quietly.
    }
  };

  const button =
    'flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-ink-muted transition-colors hover:border-[#C6963A] hover:text-[#0B1F3A]';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="mr-1 text-xs font-bold uppercase tracking-wider text-ink-subtle">Share</span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={button}
      >
        <LinkedinIcon className="h-4 w-4" />
      </a>
      <a
        href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={button}
      >
        <TwitterIcon className="h-3.5 w-3.5" />
      </a>
      <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`} aria-label="Share by email" className={button}>
        <Mail className="h-4 w-4" aria-hidden />
      </a>
      <button type="button" onClick={copy} aria-label={copied ? 'Link copied' : 'Copy link'} className={button}>
        {copied ? <Check className="h-4 w-4 text-emerald-600" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );
}
