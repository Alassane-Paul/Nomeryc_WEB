import apiClient from './apiClient';

export type BlogPostStatus = 'brouillon' | 'publie' | 'planifie';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  status: BlogPostStatus;
  views?: number;
  publishedAt?: string;
  authorId?: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostInput {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  status?: BlogPostStatus;
}

export const blogService = {
  /** Public : uniquement les articles publiés. */
  async getAll(params?: { category?: string; search?: string }): Promise<BlogPost[]> {
    const res = await apiClient.get('/blog', { params });
    return res.data.data;
  },

  /** Admin uniquement : tous les articles, brouillons compris. */
  async getAllAdmin(): Promise<BlogPost[]> {
    const res = await apiClient.get('/blog/admin/all');
    return res.data.data;
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    const res = await apiClient.get(`/blog/${slug}`);
    return res.data.data;
  },

  async create(data: BlogPostInput): Promise<BlogPost> {
    const res = await apiClient.post('/blog', data);
    return res.data.data;
  },

  async update(id: string, data: Partial<BlogPostInput>): Promise<BlogPost> {
    const res = await apiClient.patch(`/blog/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/blog/${id}`);
  },
};
