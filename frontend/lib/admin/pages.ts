import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, PaginatedResponse } from './http';

export interface PageSection {
  [key: string]: any;
}

export interface Page {
  id: number;
  url_path: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  template_key: string;
  sections?: PageSection;
  updated_at?: string;
}

export function usePages(page = 1) {
  return useQuery({
    queryKey: ['admin', 'pages', { page }],
    queryFn: () =>
      adminApi.get<PaginatedResponse<Page>>(`/admin/pages`, {
        params: { page },
      }),
  });
}

export function usePage(id: number) {
  return useQuery({
    queryKey: ['admin', 'pages', id],
    queryFn: () => adminApi.get<{ data: Page }>(`/admin/pages/${id}`),
    enabled: !!id,
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Page> }) =>
      adminApi.put<{ data: Page }>(`/admin/pages/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages', variables.id] });
    },
  });
}
