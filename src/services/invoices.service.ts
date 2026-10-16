import apiClient from './apiClient';

export type InvoiceStatus = 'brouillon' | 'envoye' | 'paye' | 'partiellement_paye' | 'en_retard' | 'annule';

export interface InvoiceItem {
  id?: string;
  designation: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
  total?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId?: string;
  quoteId?: string;
  status: InvoiceStatus;
  tvaRate: number;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  notes?: string;
  items?: InvoiceItem[];
  client?: { id: string; firstName: string; lastName: string; email: string; company?: string; phone?: string };
  project?: { id: string; title: string };
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceInput {
  clientId: string;
  projectId?: string;
  quoteId?: string;
  tvaRate?: number;
  dueDate?: string;
  notes?: string;
  items: { designation: string; description?: string; quantity: number; unitPrice: number; unit?: string }[];
}

export const invoicesService = {
  async getAll(): Promise<Invoice[]> {
    const res = await apiClient.get('/invoices');
    return res.data.data;
  },

  async getById(id: string): Promise<Invoice> {
    const res = await apiClient.get(`/invoices/${id}`);
    return res.data.data;
  },

  async create(data: InvoiceInput): Promise<Invoice> {
    const res = await apiClient.post('/invoices', data);
    return res.data.data;
  },

  async update(id: string, data: Partial<InvoiceInput>): Promise<Invoice> {
    const res = await apiClient.patch(`/invoices/${id}`, data);
    return res.data.data;
  },

  /** Marque manuellement une facture comme payée (admin, virement/chèque/espèces...). */
  async markAsPaid(id: string, paymentMethod?: string): Promise<Invoice> {
    const res = await apiClient.post(`/invoices/${id}/pay`, { paymentMethod });
    return res.data.data;
  },

  /** Client : initie un paiement carte via Stripe Checkout, renvoie l'URL de redirection. */
  async payWithStripe(id: string): Promise<string> {
    const res = await apiClient.post(`/payments/stripe/${id}`);
    return res.data.data.url;
  },

  /** Client : initie un paiement Mobile Money via FedaPay, renvoie l'URL de redirection. */
  async payWithFedapay(id: string, phone?: string): Promise<string> {
    const res = await apiClient.post(`/payments/fedapay/${id}`, { phone });
    return res.data.data.url;
  },

  /** Récupère le PDF et déclenche son téléchargement (auth via apiClient). */
  async downloadPdf(id: string, filename: string): Promise<void> {
    const res = await apiClient.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
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
    await apiClient.delete(`/invoices/${id}`);
  },
};
