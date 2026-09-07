'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import {
  type NavChild,
  type NavItem,
  type NavMenu,
  listNavigation,
  navigationQueryKey,
  updateNavigation,
} from '@/lib/admin/navigation';
import { AdminApiError } from '@/lib/admin/http';
import { useAuth } from '@/components/admin/providers';
import { cn } from '@/lib/utils/cn';
import {
  AdminButton,
  EmptyState,
  PageHeading,
  Panel,
  Spinner,
  TextInput,
  useToast,
} from '@/components/admin/ui';

const blankChild = (): NavChild => ({ label: '', url: '', is_active: true });
const blankItem = (): NavItem => ({ ...blankChild(), children: [] });

export default function AdminNavigationPage() {
  const { can } = useAuth();
  const canManage = can('navigation.update');

  const { data, isLoading, isError } = useQuery({
    queryKey: navigationQueryKey,
    queryFn: ({ signal }) => listNavigation(signal),
    enabled: canManage,
  });

  const [activeKey, setActiveKey] = useState<string | null>(null);

  if (!canManage) {
    return <EmptyState title="Access denied" description="You do not have permission to edit navigation." />;
  }

  if (isLoading) return <Spinner />;
  if (isError || !data || data.length === 0) {
    return <EmptyState title="No navigation menus" description="Menus are seeded from the information architecture." />;
  }

  const current = data.find((m) => m.key_name === activeKey) ?? data[0];

  return (
    <div className="space-y-6">
      <PageHeading title="Navigation" description="The header, footer and mega-menu link trees." />

      <div className="flex flex-wrap gap-1 border-b border-hairline">
        {data.map((menu) => (
          <button
            key={menu.key_name}
            onClick={() => setActiveKey(menu.key_name)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors',
              current.key_name === menu.key_name
                ? 'border-b-2 border-brand-gold text-brand-navy'
                : 'text-ink-subtle hover:text-ink',
            )}
          >
            {menu.label || menu.key_name}
          </button>
        ))}
      </div>

      <MenuEditor key={current.key_name} menu={current} />
    </div>
  );
}

function MenuEditor({ menu }: { menu: NavMenu }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<NavItem[]>(() => structuredClone(menu.items));

  const dirty = JSON.stringify(items) !== JSON.stringify(menu.items);

  const mutation = useMutation({
    mutationFn: () => updateNavigation(menu.key_name, items),
    onSuccess: (fresh) => {
      toast.success('Navigation saved.');
      queryClient.setQueryData(navigationQueryKey, fresh);
    },
    onError: (error) =>
      toast.error(
        error instanceof AdminApiError && Object.keys(error.errors).length
          ? (Object.values(error.errors)[0]?.[0] ?? 'Please check the items.')
          : 'Could not save the navigation.',
      ),
  });

  function patchItem(index: number, patch: Partial<NavItem>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {items.map((item, index) => (
          <Panel key={index} className="space-y-3 p-4">
            <div className="flex items-start gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <TextInput
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) => patchItem(index, { label: e.target.value })}
                />
                <TextInput
                  className="font-mono text-xs"
                  placeholder="/path or https://…"
                  value={item.url ?? ''}
                  onChange={(e) => patchItem(index, { url: e.target.value })}
                />
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <label className="flex items-center gap-1 px-1 text-xs text-ink-subtle">
                  <input
                    type="checkbox"
                    className="size-3.5 rounded border-hairline-strong text-brand-navy"
                    checked={item.is_active}
                    onChange={(e) => patchItem(index, { is_active: e.target.checked })}
                  />
                  On
                </label>
                <IconBtn label="Move up" onClick={() => move(index, -1)}>
                  <ChevronUp className="size-4" />
                </IconBtn>
                <IconBtn label="Move down" onClick={() => move(index, 1)}>
                  <ChevronDown className="size-4" />
                </IconBtn>
                <IconBtn
                  label="Remove"
                  danger
                  onClick={() => setItems((p) => p.filter((_, i) => i !== index))}
                >
                  <Trash2 className="size-4" />
                </IconBtn>
              </div>
            </div>

            <div className="space-y-2 border-l-2 border-hairline pl-4">
              {item.children.map((child, ci) => (
                <div key={ci} className="flex items-center gap-2">
                  <TextInput
                    className="h-9"
                    placeholder="Label"
                    value={child.label}
                    onChange={(e) =>
                      patchItem(index, {
                        children: item.children.map((c, j) =>
                          j === ci ? { ...c, label: e.target.value } : c,
                        ),
                      })
                    }
                  />
                  <TextInput
                    className="h-9 font-mono text-xs"
                    placeholder="/path"
                    value={child.url ?? ''}
                    onChange={(e) =>
                      patchItem(index, {
                        children: item.children.map((c, j) =>
                          j === ci ? { ...c, url: e.target.value } : c,
                        ),
                      })
                    }
                  />
                  <IconBtn
                    label="Remove child"
                    danger
                    onClick={() =>
                      patchItem(index, { children: item.children.filter((_, j) => j !== ci) })
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </IconBtn>
                </div>
              ))}
              <button
                type="button"
                onClick={() => patchItem(index, { children: [...item.children, blankChild()] })}
                className="text-xs font-medium text-brand-navy hover:underline"
              >
                + Add sub-item
              </button>
            </div>
          </Panel>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <AdminButton
          type="button"
          variant="secondary"
          iconLeft={<Plus className="size-4" />}
          onClick={() => setItems((p) => [...p, blankItem()])}
        >
          Add item
        </AdminButton>
        <AdminButton onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!dirty}>
          Save {menu.label || menu.key_name}
        </AdminButton>
      </div>
    </div>
  );
}

function IconBtn({
  label,
  danger,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'grid size-8 place-items-center rounded-lg text-ink-muted hover:bg-neutral-100',
        danger && 'hover:bg-danger-surface hover:text-danger',
      )}
    >
      {children}
    </button>
  );
}
