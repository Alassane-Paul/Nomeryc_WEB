import apiClient from './apiClient';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  isPublic?: boolean;
  orderIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export const faqsService = {
  async getAll(): Promise<Faq[]> {
    const res = await apiClient.get('/faqs');
    return res.data.data;
  },

  async getAllAdmin(): Promise<Faq[]> {
    const res = await apiClient.get('/faqs/admin/all');
    return res.data.data;
  },

  async create(data: Partial<Faq>): Promise<Faq> {
    const res = await apiClient.post('/faqs', data);
    return res.data.data;
  },

  async update(id: string, data: Partial<Faq>): Promise<Faq> {
    const res = await apiClient.patch(`/faqs/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/faqs/${id}`);
  },
};
