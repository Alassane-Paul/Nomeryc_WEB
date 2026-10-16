import apiClient from './apiClient';

export type DocumentCategory = 'contrat' | 'facture' | 'maquette' | 'livrable' | 'autre';

export interface AppDocument {
  id: string;
  name: string;
  url: string;
  mimeType?: string;
  size?: string;
  category: DocumentCategory;
  clientId: string;
  projectId?: string;
  project?: { id: string; title: string };
  client?: { id: string; firstName: string; lastName: string };
  createdAt: string;
}

export interface DocumentInput {
  name: string;
  url: string;
  mimeType?: string;
  size?: string;
  category?: DocumentCategory;
  clientId: string;
  projectId?: string | null;
}

export const documentsService = {
  async list(params?: { category?: string; projectId?: string; clientId?: string }): Promise<AppDocument[]> {
    const res = await apiClient.get('/documents', { params });
    return res.data.data;
  },
  async create(data: DocumentInput): Promise<AppDocument> {
    const res = await apiClient.post('/documents', data);
    return res.data.data;
  },
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/documents/${id}`);
  },
};
