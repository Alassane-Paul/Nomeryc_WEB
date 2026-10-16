import apiClient from './apiClient';

export type ContactStatus = 'nouveau' | 'contacte' | 'converti' | 'rejete';

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budgetMin?: number;
  budgetMax?: number;
  message: string;
  status?: ContactStatus;
  notes?: string;
  createdAt?: string;
}

export const contactsService = {
  async submit(data: { name: string; email: string; phone?: string; company?: string; service?: string; budgetMin?: number; message: string }): Promise<any> {
    const res = await apiClient.post('/contacts', data);
    return res.data;
  },

  async getAll(): Promise<ContactSubmission[]> {
    const res = await apiClient.get('/contacts');
    return res.data.data;
  },

  async updateStatus(id: string, status: ContactStatus, notes?: string): Promise<ContactSubmission> {
    const res = await apiClient.patch(`/contacts/${id}`, { status, notes });
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/contacts/${id}`);
  },
};
