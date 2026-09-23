'use client';

import { adminApi } from './http';

export interface AdminBlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  posts_count: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface BlogCategoryInput {
  name?: string;
  slug?: string;
  description?: string | null;
  sort_order?: number;
}

export const blogCategoryQueryKeys = {
  all: ['admin', 'blog-categories'] as const,
};

export function listBlogCategories(signal?: AbortSignal): Promise<AdminBlogCategory[]> {
  return adminApi.get<AdminBlogCategory[]>('admin/blog-categories', signal);
}

export function createBlogCategory(input: BlogCategoryInput): Promise<AdminBlogCategory> {
  return adminApi.post<AdminBlogCategory>('blog-categories', input);
}

export function updateBlogCategory(id: number, input: BlogCategoryInput): Promise<AdminBlogCategory> {
  return adminApi.put<AdminBlogCategory>(`blog-categories/${id}`, input);
}

export function deleteBlogCategory(id: number): Promise<{ deleted: boolean; id: number }> {
  return adminApi.delete(`blog-categories/${id}`);
}
