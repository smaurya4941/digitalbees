export type VideoSource =
  | { kind: 'iframe'; src: string }
  | { kind: 'file'; src: string }
  | { kind: 'link'; src: string };

/**
 * Turns an admin-pasted video URL into something the page can play inline:
 * YouTube / Vimeo become autoplaying embeds, direct files use <video>, and
 * anything else falls back to opening the link in a new tab.
 */
export function toVideoSource(raw: string | null | undefined): VideoSource | null {
  const value = raw?.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  const host = url.hostname.replace(/^(www\.|m\.)/, '');

  if (host === 'youtube.com' || host === 'youtu.be' || host === 'youtube-nocookie.com') {
    const id =
      host === 'youtu.be'
        ? url.pathname.slice(1)
        : url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
    if (id && /^[\w-]{6,20}$/.test(id)) {
      const start = parseInt(url.searchParams.get('t') ?? url.searchParams.get('start') ?? '', 10);
      return {
        kind: 'iframe',
        src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${start > 0 ? `&start=${start}` : ''}`,
      };
    }
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = url.pathname.match(/(\d{6,})/)?.[1];
    if (id) return { kind: 'iframe', src: `https://player.vimeo.com/video/${id}?autoplay=1` };
  }

  if (/\.(mp4|webm|ogg|mov)$/i.test(url.pathname)) return { kind: 'file', src: url.toString() };

  return { kind: 'link', src: url.toString() };
}
