/**
 * Flag emoji for an ISO 3166 alpha-2 code (also "EU"), built from regional
 * indicator symbols. Returns a globe for anything that isn't two letters.
 */
export function flagEmoji(code: string | null | undefined): string {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) {
    return '🌐';
  }

  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}
