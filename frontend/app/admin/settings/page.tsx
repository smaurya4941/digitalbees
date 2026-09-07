'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type SettingField,
  listSettings,
  settingsQueryKey,
  updateSettings,
} from '@/lib/admin/settings';
import { AdminApiError } from '@/lib/admin/http';
import { useAuth } from '@/components/admin/providers';
import {
  AdminButton,
  EmptyState,
  Field,
  PageHeading,
  Panel,
  Spinner,
  TextInput,
  useToast,
} from '@/components/admin/ui';

export default function AdminSettingsPage() {
  const { can } = useAuth();
  const canManage = can('settings.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: settingsQueryKey,
    queryFn: ({ signal }) => listSettings(signal),
    enabled: canManage,
  });

  if (!canManage) {
    return <EmptyState title="Access denied" description="You do not have permission to change settings." />;
  }

  return (
    <div className="space-y-6">
      <PageHeading title="Settings" description="Site-wide values used across the public website." />
      {isLoading ? (
        <Spinner />
      ) : isError || !data ? (
        <EmptyState title="Couldn’t load settings" description="Refresh the page to try again." />
      ) : (
        <SettingsForm groups={data.groups} />
      )}
    </div>
  );
}

function SettingsForm({ groups }: { groups: { id: string; label: string; fields: SettingField[] }[] }) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const initial = useMemo(() => {
    const map: Record<string, unknown> = {};
    for (const group of groups) for (const f of group.fields) map[f.key] = f.value ?? (f.type === 'boolean' ? false : '');
    return map;
  }, [groups]);

  const [values, setValues] = useState<Record<string, unknown>>(initial);

  const dirty = JSON.stringify(values) !== JSON.stringify(initial);

  const mutation = useMutation({
    mutationFn: () => updateSettings(values),
    onSuccess: (view) => {
      toast.success('Settings saved.');
      queryClient.setQueryData(settingsQueryKey, view);
    },
    onError: (error) => {
      if (error instanceof AdminApiError && Object.keys(error.errors).length) {
        toast.error(Object.values(error.errors)[0]?.[0] ?? 'Please check the values.');
      } else {
        toast.error('Could not save the settings.');
      }
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      {groups.map((group) => (
        <Panel key={group.id} className="space-y-5 p-6">
          <h2 className="text-sm font-semibold text-ink">{group.label}</h2>
          {group.fields.map((field) =>
            field.type === 'boolean' ? (
              <label key={field.key} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="size-4 rounded border-hairline-strong text-brand-navy"
                  checked={Boolean(values[field.key])}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.checked }))}
                />
                <span className="font-medium text-ink">{field.label}</span>
              </label>
            ) : (
              <Field key={field.key} label={field.label}>
                <TextInput
                  value={String(values[field.key] ?? '')}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                />
              </Field>
            ),
          )}
        </Panel>
      ))}

      <div className="flex justify-end">
        <AdminButton type="submit" loading={mutation.isPending} disabled={!dirty}>
          Save settings
        </AdminButton>
      </div>
    </form>
  );
}
