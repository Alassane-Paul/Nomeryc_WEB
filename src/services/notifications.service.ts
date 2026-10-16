import apiClient from './apiClient';

export type NotificationType = 'PROJECT' | 'INVOICE' | 'MESSAGE' | 'QUOTE' | 'SYSTEM';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export const notificationsService = {
  async list(params?: { unread?: boolean; type?: string }): Promise<AppNotification[]> {
    const res = await apiClient.get('/notifications', { params });
    return res.data.data;
  },
  async unreadCount(): Promise<number> {
    const res = await apiClient.get('/notifications/unread-count');
    return res.data.data.count;
  },
  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },
  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/read-all');
  },
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },
};
