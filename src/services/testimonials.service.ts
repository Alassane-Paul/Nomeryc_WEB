import apiClient from './apiClient';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  initials?: string;
  rating?: number;
  isPublic?: boolean;
  orderIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export const testimonialsService = {
  async getAll(): Promise<Testimonial[]> {
    const res = await apiClient.get('/testimonials');
    return res.data.data;
  },

  async getAllAdmin(): Promise<Testimonial[]> {
    const res = await apiClient.get('/testimonials/admin/all');
    return res.data.data;
  },

  async create(data: Partial<Testimonial>): Promise<Testimonial> {
    const res = await apiClient.post('/testimonials', data);
    return res.data.data;
  },

  async update(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
    const res = await apiClient.patch(`/testimonials/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/testimonials/${id}`);
  },
};
