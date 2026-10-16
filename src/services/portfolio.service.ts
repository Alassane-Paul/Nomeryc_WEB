import apiClient from './apiClient';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  clientName?: string;
  images?: string[];
  coverImage?: string;
  technologies?: string[];
  liveUrl?: string;
  featured?: boolean;
  isPublic?: boolean;
  orderIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioInput {
  title: string;
  category: string;
  description: string;
  clientName?: string;
  images?: string[];
  coverImage?: string;
  technologies?: string[];
  liveUrl?: string;
  featured?: boolean;
}

export const portfolioService = {
  /** Public : uniquement les réalisations marquées publiques. */
  async getAll(params?: { category?: string; featured?: boolean }): Promise<PortfolioItem[]> {
    const res = await apiClient.get('/portfolio', { params });
    return res.data.data;
  },

  /** Admin uniquement : toutes les réalisations, publiques ou non. */
  async getAllAdmin(): Promise<PortfolioItem[]> {
    const res = await apiClient.get('/portfolio/admin/all');
    return res.data.data;
  },

  async getById(id: string): Promise<PortfolioItem> {
    const res = await apiClient.get(`/portfolio/${id}`);
    return res.data.data;
  },

  async create(data: PortfolioInput): Promise<PortfolioItem> {
    const res = await apiClient.post('/portfolio', data);
    return res.data.data;
  },

  async update(id: string, data: Partial<PortfolioInput>): Promise<PortfolioItem> {
    const res = await apiClient.patch(`/portfolio/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/portfolio/${id}`);
  },
};
