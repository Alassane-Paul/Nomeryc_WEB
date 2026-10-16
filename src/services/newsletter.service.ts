import apiClient from './apiClient';

export const newsletterService = {
  async subscribe(email: string): Promise<void> {
    await apiClient.post('/newsletter/subscribe', { email });
  },
};
