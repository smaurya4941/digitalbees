'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminApiError } from '@/lib/admin/http';
import {
  type AdminRole,
  type PermissionCatalog,
  createRole,
  deleteRole,
  roleQueryKeys,
  updateRole,
} from '@/lib/admin/roles';
import { AdminButton, Field, Panel, TextInput, useToast } from './ui';

export function RoleEditor({
  role,
  catalog,
}: {
  role?: AdminRole;
  catalog: PermissionCatalog;
}) {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const isEdit = Boolean(role);
  const locked = role?.is_admin ?? false;

  const allPermissions = useMemo(
    () => Object.values(catalog).flat().map((p) => p.name),
    [catalog],
  );

  const [name, setName] = useState(role?.name ?? '');
  const [description, setDescription] = useState(role?.description ?? '');
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(locked ? allPermissions : (role?.permissions ?? [])),
  );

  const mutation = useMutation({
    mutationFn: () =>
      isEdit
        ? updateRole(role!.id, { description, permissions: [...selected] })
        : createRole({ name, description, permissions: [...selected] }),
    onSuccess: () => {
      toast.success(isEdit ? 'Role updated.' : `Role “${name}” created.`);
      void queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
      router.push('/admin/roles');
    },
    onError: (error) => {
      if (error instanceof AdminApiError && Object.keys(error.errors).length) {
        toast.error(Object.values(error.errors)[0]?.[0] ?? 'Please check the form.');
      } else {
        toast.error(error instanceof AdminApiError ? error.message : 'Could not save the role.');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRole(role!.id),
    onSuccess: () => {
      toast.success('Role deleted.');
      void queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
      router.push('/admin/roles');
    },
    onError: (error) =>
      toast.error(error instanceof AdminApiError ? error.message : 'Could not delete the role.'),
  });

  function toggle(permission: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(permission)) next.delete(permission);
      else next.add(permission);
      return next;
    });
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <Panel className="space-y-5 p-6">
        <Field label="Name" required hint={isEdit ? undefined : 'Lowercase, dashes only. Cannot be changed later.'}>
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="content-lead"
            disabled={isEdit}
            required
          />
        </Field>
        <Field label="Description">
          <TextInput
            value={description ?? ''}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this role is for"
          />
        </Field>
      </Panel>

      <Panel className="space-y-5 p-6">
        <div>
          <h2 className="text-sm font-semibold text-ink">Permissions</h2>
          <p className="mt-0.5 text-xs text-ink-subtle">
            {locked
              ? 'The admin role always holds every permission.'
              : 'Grant only what this role needs. Route and UI access follow these.'}
          </p>
        </div>

        {Object.entries(catalog).map(([group, permissions]) => (
          <fieldset key={group} className="space-y-2">
            <legend className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
              {group}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {permissions.map((permission) => (
                <label
                  key={permission.name}
                  className="flex items-start gap-2.5 rounded-lg border border-hairline p-2.5 text-sm"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 rounded border-hairline-strong text-brand-navy"
                    checked={selected.has(permission.name)}
                    disabled={locked}
                    onChange={() => toggle(permission.name)}
                  />
                  <span>
                    <span className="font-medium text-ink">{permission.name}</span>
                    {permission.description && (
                      <span className="block text-xs text-ink-subtle">{permission.description}</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </Panel>

      <div className="flex items-center justify-between">
        <div>
          {isEdit && !role!.is_builtin && (
            <AdminButton
              type="button"
              variant="danger"
              loading={deleteMutation.isPending}
              onClick={() => {
                if (window.confirm(`Delete the “${role!.name}” role?`)) deleteMutation.mutate();
              }}
            >
              Delete role
            </AdminButton>
          )}
        </div>
        <div className="flex gap-2">
          <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/roles')}>
            Cancel
          </AdminButton>
          <AdminButton type="submit" loading={mutation.isPending} disabled={locked && isEdit}>
            {isEdit ? 'Save changes' : 'Create role'}
          </AdminButton>
        </div>
      </div>
    </form>
  );
}
