import apiClient from './apiClient';

export type QuoteStatus = 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire';

export interface QuoteItem {
  id?: string;
  designation: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
  total?: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  projectId?: string;
  title?: string;
  status: QuoteStatus;
  tvaRate: number;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  validUntil?: string;
  notes?: string;
  terms?: string;
  items?: QuoteItem[];
  client?: { id: string; firstName: string; lastName: string; email: string; company?: string; phone?: string };
  project?: { id: string; title: string };
  createdAt: string;
  updatedAt: string;
}

export interface QuoteInput {
  clientId?: string;
  projectId?: string;
  title?: string;
  tvaRate?: number;
  validUntil?: string;
  terms?: string;
  notes?: string;
  items: { designation: string; description?: string; quantity: number; unitPrice: number; unit?: string }[];
}

export const quotesService = {
  async getAll(): Promise<Quote[]> {
    const res = await apiClient.get('/quotes');
    return res.data.data;
  },

  async getById(id: string): Promise<Quote> {
    const res = await apiClient.get(`/quotes/${id}`);
    return res.data.data;
  },

  async create(data: QuoteInput): Promise<Quote> {
    const res = await apiClient.post('/quotes', data);
    return res.data.data;
  },

  async update(id: string, data: Partial<QuoteInput>): Promise<Quote> {
    const res = await apiClient.patch(`/quotes/${id}`, data);
    return res.data.data;
  },

  /** Client : 'accepte' | 'refuse'. Admin : tous les statuts (ex. 'envoye'). */
  async updateStatus(id: string, status: QuoteStatus): Promise<Quote> {
    const res = await apiClient.patch(`/quotes/${id}/status`, { status });
    return res.data.data;
  },

  /** Récupère le PDF et déclenche son téléchargement (auth via apiClient). */
  async downloadPdf(id: string, filename: string): Promise<void> {
    const res = await apiClient.get(`/quotes/${id}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => window.URL.revokeObjectURL(url), 5000);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/quotes/${id}`);
  },
};
