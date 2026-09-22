import fs from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Automated WCAG 2.2 AA gate (blueprint §19.2 / §19.3: "axe-core on every
 * deploy"). Automated scanning catches roughly a third of issues, so the
 * manual keyboard / screen-reader walkthroughs in §19.3 still apply — this is
 * the floor, not the ceiling.
 *
 * Ratchet model: only serious/critical violations count. Debt that existed
 * when the gate was introduced is recorded in `a11y-baseline.json`
 * (page -> rule id -> max affected nodes). The build fails when a page shows a
 * rule that is not baselined, or more nodes than the baseline allows — so
 * regressions are blocked while the backlog is paid down. When you fix
 * something, run `UPDATE_A11Y_BASELINE=1 pnpm test:a11y` to lower the baseline
 * and commit the result; the numbers should only ever go down.
 */
const PAGES = ['/', '/contact-us', '/careers', '/practices', '/about', '/privacy'];
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const BASELINE_PATH = path.join(__dirname, 'a11y-baseline.json');
type Baseline = Record<string, Record<string, number>>;

function readBaseline(): Baseline {
  try {
    return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8')) as Baseline;
  } catch {
    return {};
  }
}

// Tests run in parallel workers, so merge into the file instead of overwriting it.
function recordBaseline(page: string, counts: Record<string, number>) {
  const current = readBaseline();
  current[page] = counts;
  const sorted = Object.fromEntries(Object.entries(current).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(sorted, null, 2)}\n`);
}

for (const route of PAGES) {
  test(`axe: ${route} has no new serious or critical violations`, async ({ page }, testInfo) => {
    await page.goto(route, { waitUntil: 'networkidle' });

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    await testInfo.attach('axe-results', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const blocking = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    const counts = Object.fromEntries(blocking.map((v) => [v.id, v.nodes.length]));

    if (process.env.UPDATE_A11Y_BASELINE) {
      recordBaseline(route, counts);
      return;
    }

    const allowed = readBaseline()[route] ?? {};
    const regressions = blocking
      .filter((v) => v.nodes.length > (allowed[v.id] ?? 0))
      .map((v) => `${v.impact}: ${v.id} — ${v.help} (${v.nodes.length} nodes, baseline ${allowed[v.id] ?? 0})`);

    expect(regressions, `New accessibility regressions on ${route}:\n${regressions.join('\n')}`).toEqual([]);
  });
}
