import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, PaginatedResponse } from './http';

export interface Media {
  id: number;
  name: string;
  file_name: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
}

export function useMedia(page = 1) {
  return useQuery({
    queryKey: ['admin', 'media', { page }],
    queryFn: () =>
      adminApi.get<PaginatedResponse<Media>>(`/admin/media`, {
        params: { page },
      }),
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return adminApi.post<{ data: Media }>('/admin/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.delete(`/admin/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
  });
}
