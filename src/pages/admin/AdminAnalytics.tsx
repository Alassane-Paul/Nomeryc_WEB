import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { analyticsService, DashboardAnalytics } from '../../services/analytics.service';

const STATUS_COLORS: Record<string, string> = {
  devis: '#F59E0B',
  en_cours: '#8B5CF6',
  revision: '#3B82F6',
  termine: '#10B981',
  annule: '#EF4444',
  brouillon: '#6B7280',
  envoye: '#3B82F6',
  paye: '#10B981',
  partiellement_paye: '#F59E0B',
  en_retard: '#EF4444',
};

const STATUS_LABELS: Record<string, string> = {
  devis: 'Devis',
  en_cours: 'En cours',
  revision: 'Révision',
  termine: 'Terminé',
  annule: 'Annulé',
  brouillon: 'Brouillon',
  envoye: 'Envoyé',
  paye: 'Payée',
  partiellement_paye: 'Partiel',
  en_retard: 'En retard',
};

function formatFcfa(n: number) {
  return `${new Intl.NumberFormat('fr-FR').format(n)} FCFA`;
}

export function AdminAnalytics() {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .dashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-center text-gray-500 py-32">Impossible de charger les statistiques.</p>;
  }

  const { totals, revenueByMonth, projectsByStatus, invoicesByStatus } = data;
  const maxProjectCount = Math.max(...projectsByStatus.map((p) => p.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Performances & Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Chiffre d'affaires, conversion et activité des 6 derniers mois.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-glass border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>CA encaissé</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-brand-green" />
          </div>
          <p className="text-3xl font-extrabold text-white">{formatFcfa(totals.revenue)}</p>
          <span className="text-[11px] text-gray-400 mt-2 block">Toutes factures payées</span>
        </div>

        <div className="card-glass border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Taux de signature devis</span>
          </div>
          <p className="text-3xl font-extrabold text-brand-green">{totals.conversionRate}%</p>
          <span className="text-[11px] text-gray-400 mt-2 block">{totals.acceptedQuotes} / {totals.quotes} devis acceptés</span>
        </div>

        <div className="card-glass border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Projets actifs</span>
          </div>
          <p className="text-3xl font-extrabold text-white">{totals.activeProjects}</p>
          <span className="text-[11px] text-gray-400 mt-2 block">Sur {totals.projects} projets au total</span>
        </div>

        <div className="card-glass border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>CA en attente</span>
          </div>
          <p className="text-3xl font-extrabold text-brand-purple-light">{formatFcfa(totals.pendingRevenue)}</p>
          <span className="text-[11px] text-gray-400 mt-2 block">{totals.clients} clients · {totals.newContactRequests} demandes non traitées</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 card-glass border border-white/10 p-6 rounded-2xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Encaissements mensuels</h2>
            <p className="text-xs text-gray-400 mt-0.5">6 derniers mois, en FCFA</p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#13111C', borderColor: '#ffffff20', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [formatFcfa(Number(value))]}
                />
                <Area type="monotone" dataKey="total" name="Encaissé" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 card-glass border border-white/10 p-6 rounded-2xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Projets par statut</h2>
            <p className="text-xs text-gray-400 mt-0.5">Répartition actuelle</p>
          </div>

          <div className="space-y-4 py-2">
            {projectsByStatus.map((item) => (
              <div key={item.status} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300 font-medium">{STATUS_LABELS[item.status] || item.status}</span>
                  <span className="text-white font-bold">{item.count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.count / maxProjectCount) * 100}%`,
                      backgroundColor: STATUS_COLORS[item.status] || '#8B5CF6',
                    }}
                  />
                </div>
              </div>
            ))}
            {projectsByStatus.length === 0 && <p className="text-xs text-gray-500">Aucun projet pour l'instant.</p>}
          </div>

          <div className="pt-2 border-t border-white/5 space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Factures</h3>
            {invoicesByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-gray-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.status] || '#8B5CF6' }} />
                  {STATUS_LABELS[item.status] || item.status}
                </span>
                <span className="text-white font-semibold">{item.count}</span>
              </div>
            ))}
            {invoicesByStatus.length === 0 && <p className="text-xs text-gray-500">Aucune facture pour l'instant.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
