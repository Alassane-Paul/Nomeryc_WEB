import apiClient from './apiClient';
import { User } from './auth.service';

export const usersService = {
  async getAll(params?: { role?: string; search?: string }): Promise<User[]> {
    const res = await apiClient.get('/users', { params });
    return res.data.data;
  },

  async getById(id: string): Promise<User> {
    const res = await apiClient.get(`/users/${id}`);
    return res.data.data;
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    const res = await apiClient.patch(`/users/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
