import apiClient from './apiClient';

export interface MessageUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  company?: string;
}

export interface MessageAttachment {
  name: string;
  url: string;
  size?: string;
  type?: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId?: string | null;
  projectId?: string;
  content: string;
  attachments?: MessageAttachment[];
  isRead: boolean;
  sender?: MessageUser;
  recipient?: MessageUser;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  client: MessageUser;
  lastMessage: Message;
  unreadCount: number;
}

export const messagesService = {
  async unreadCount(): Promise<number> {
    const res = await apiClient.get('/messages/unread-count');
    return res.data.data.count;
  },

  /** Client : tout son historique. Admin : historique lié à un projet. */
  async getConversation(projectId?: string): Promise<Message[]> {
    const res = await apiClient.get('/messages', { params: { projectId } });
    return res.data.data;
  },

  /** Admin uniquement : fil de discussion avec un client précis. */
  async getConversationWithClient(clientId: string): Promise<Message[]> {
    const res = await apiClient.get('/messages', { params: { clientId } });
    return res.data.data;
  },

  /** Admin uniquement : liste des conversations (dernier message + non-lus). */
  async getConversations(): Promise<Conversation[]> {
    const res = await apiClient.get('/messages/conversations');
    return res.data.data;
  },

  /** Admin : recipientId (id du client) obligatoire. Client : ignoré côté serveur (va au support). */
  async send(data: { recipientId?: string; projectId?: string; content: string; attachments?: MessageAttachment[] }): Promise<Message> {
    const res = await apiClient.post('/messages', data);
    return res.data.data;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/messages/${id}/read`);
  },

  /** Client : sans argument. Admin : clientId obligatoire. */
  async markAllAsRead(clientId?: string): Promise<void> {
    await apiClient.patch('/messages/read-all', clientId ? { clientId } : {});
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/messages/${id}`);
  },
};
