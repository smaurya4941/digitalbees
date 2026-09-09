'use client';

import { adminApi } from './http';

export type SettingType = 'string' | 'boolean' | 'integer' | 'json';

export interface SettingField {
  key: string;
  label: string;
  type: SettingType;
  value: unknown;
}

export interface SettingGroup {
  id: string;
  label: string;
  fields: SettingField[];
}

export interface SettingsView {
  groups: SettingGroup[];
}

export const settingsQueryKey = ['admin', 'settings'] as const;

export function listSettings(signal?: AbortSignal): Promise<SettingsView> {
  return adminApi.get<SettingsView>('admin/settings', signal);
}

export function updateSettings(values: Record<string, unknown>): Promise<SettingsView> {
  return adminApi.patch<SettingsView>('admin/settings', { values });
}
