import apiClient from './apiClient';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  isPublic?: boolean;
  orderIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export const teamService = {
  async getAll(): Promise<TeamMember[]> {
    const res = await apiClient.get('/team');
    return res.data.data;
  },

  async getAllAdmin(): Promise<TeamMember[]> {
    const res = await apiClient.get('/team/admin/all');
    return res.data.data;
  },

  async getById(id: string): Promise<TeamMember> {
    const res = await apiClient.get(`/team/${id}`);
    return res.data.data;
  },

  async create(data: Partial<TeamMember>): Promise<TeamMember> {
    const res = await apiClient.post('/team', data);
    return res.data.data;
  },

  async update(id: string, data: Partial<TeamMember>): Promise<TeamMember> {
    const res = await apiClient.patch(`/team/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/team/${id}`);
  },
};
