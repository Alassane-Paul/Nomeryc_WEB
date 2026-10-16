import apiClient from './apiClient';

export interface DashboardAnalytics {
  totals: {
    clients: number;
    projects: number;
    activeProjects: number;
    quotes: number;
    acceptedQuotes: number;
    conversionRate: number;
    revenue: number;
    pendingRevenue: number;
    newContactRequests: number;
  };
  revenueByMonth: { month: string; key: string; total: number }[];
  projectsByStatus: { status: string; count: number }[];
  invoicesByStatus: { status: string; count: number }[];
}

export interface PublicStats {
  projectsDelivered: number;
  clientsCount: number;
  teamSize: number;
  averageRating: number | null;
  reviewsCount: number;
}

export const analyticsService = {
  async dashboard(): Promise<DashboardAnalytics> {
    const res = await apiClient.get('/analytics/dashboard');
    return res.data.data;
  },

  /** Public, sans authentification : chiffres réels affichés sur la page "À propos". */
  async publicStats(): Promise<PublicStats> {
    const res = await apiClient.get('/analytics/public-stats');
    return res.data.data;
  },
};
