import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from './SectionHeading';
import type { FrameworkStackRow } from '@/types/practice';

type StackTableProps = {
  rows: FrameworkStackRow[];
  agentCapabilities?: string[];
  eyebrow?: string;
  title?: string;
};

/** Framework/tool stack table plus an agent-capability checklist. Renders nothing when there's no stack to show. */
export function StackTable({
  rows,
  agentCapabilities = [],
  eyebrow = 'Framework stack',
  title = 'The technology foundation behind the agents',
}: StackTableProps) {
  if (rows.length === 0) return null;

  return (
    <Section space="md" tone="sunken">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="overflow-x-auto rounded-lg border border-hairline bg-canvas-raised">
          <table className="w-full min-w-[480px] border-collapse text-body-sm">
            <tbody>
              {rows.map((row) => (
                <tr key={row.category} className="border-b border-hairline last:border-b-0">
                  <th
                    scope="row"
                    className="w-1/3 whitespace-nowrap p-4 text-left align-top text-label-sm uppercase text-ink-muted"
                  >
                    {row.category}
                  </th>
                  <td className="p-4 text-ink">{row.tools.join(' • ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {agentCapabilities.length > 0 && (
          <div className="rounded-lg border border-hairline bg-canvas-raised p-6">
            <h3 className="text-eyebrow uppercase text-ink-muted">Agent capabilities</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {agentCapabilities.map((capability) => (
                <li key={capability} className="flex items-start gap-2 text-body-sm text-ink">
                  <Badge className="mt-0.5 shrink-0">✓</Badge>
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}
