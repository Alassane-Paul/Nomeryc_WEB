import apiClient from './apiClient';

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: string;
  currency?: string;
  period?: string;
  description?: string;
  features?: string[];
  highlighted?: boolean;
  ctaText?: string;
  ctaLink?: string;
  isPublic?: boolean;
  orderIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export const pricingService = {
  async getAll(): Promise<PricingPlan[]> {
    const res = await apiClient.get('/pricing');
    return res.data.data;
  },

  async getAllAdmin(): Promise<PricingPlan[]> {
    const res = await apiClient.get('/pricing/admin/all');
    return res.data.data;
  },

  async create(data: Partial<PricingPlan>): Promise<PricingPlan> {
    const res = await apiClient.post('/pricing', data);
    return res.data.data;
  },

  async update(id: string, data: Partial<PricingPlan>): Promise<PricingPlan> {
    const res = await apiClient.patch(`/pricing/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/pricing/${id}`);
  },
};
