import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, FolderOpen, FileText, Receipt, TrendingUp, MessageSquare,
  ArrowUpRight, Loader2, Euro, Clock, CheckCircle, AlertTriangle, BarChart3
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import apiClient from '../../services/apiClient';

interface AdminStats {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  pendingQuotes: number;
  unpaidInvoices: number;
  totalRevenue: number;
  monthRevenue: number;
}

const revenueData = [
  { month: 'Juil', value: 420000 },
  { month: 'Août', value: 380000 },
  { month: 'Sep', value: 650000 },
  { month: 'Oct', value: 510000 },
  { month: 'Nov', value: 720000 },
  { month: 'Déc', value: 890000 },
];

const servicesData = [
  { name: 'Web', count: 18 },
  { name: 'Mobile', count: 12 },
  { name: 'Design', count: 8 },
  { name: 'Bot', count: 5 },
  { name: 'Audit', count: 7 },
];

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsRes, projectsRes, quotesRes, invoicesRes] = await Promise.all([
          apiClient.get('/users'),
          apiClient.get('/projects'),
          apiClient.get('/quotes'),
          apiClient.get('/invoices'),
        ]);

        const clients = clientsRes.data.data || [];
        const projects = projectsRes.data.data || [];
        const quotes = quotesRes.data.data || [];
        const invoices = invoicesRes.data.data || [];

        const totalRevenue = invoices
          .filter((i: any) => i.status === 'paye')
          .reduce((s: number, i: any) => s + (i.totalTTC || 0), 0);

        setStats({
          totalClients: clients.filter((u: any) => u.role === 'client').length,
          totalProjects: projects.length,
          activeProjects: projects.filter((p: any) => p.status === 'en_cours').length,
          pendingQuotes: quotes.filter((q: any) => q.status === 'envoye').length,
          unpaidInvoices: invoices.filter((i: any) => i.status === 'envoye').length,
          totalRevenue,
          monthRevenue: 0,
        });

        // Recent activity from projects
        setRecentActivity(projects.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: 'Clients', value: stats?.totalClients, sub: 'actifs', color: 'text-brand-purple', bg: 'bg-brand-purple/10', href: '/admin/clients' },
    { icon: FolderOpen, label: 'Projets actifs', value: stats?.activeProjects, sub: `sur ${stats?.totalProjects} total`, color: 'text-brand-green', bg: 'bg-brand-green/10', href: '/admin/projets' },
    { icon: FileText, label: 'Devis à valider', value: stats?.pendingQuotes, sub: 'en attente', color: 'text-yellow-400', bg: 'bg-yellow-400/10', href: '/admin/devis' },
    { icon: Receipt, label: 'Factures impayées', value: stats?.unpaidInvoices, sub: 'à relancer', color: 'text-red-400', bg: 'bg-red-400/10', href: '/admin/factures' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Dashboard Admin</h1>
          <p className="text-gray-400 mt-1">Vue d'ensemble de Nomeryc</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/devis" className="btn-primary btn-sm">
            + Nouveau devis
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, sub, color, bg, href }) => (
          <Link key={label} to={href} className="card-hover group">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <div className="stat-value">{value ?? 0}</div>
            <div className="stat-label mt-1">{label}</div>
            <p className="text-gray-600 text-xs mt-0.5">{sub}</p>
            <div className={`mt-3 flex items-center gap-1 text-xs ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>
              Voir <ArrowUpRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Revenue KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-brand-green" />
            </div>
            <p className="text-gray-400 text-sm">Revenu total</p>
          </div>
          <div className="text-3xl font-bold text-white">
            {new Intl.NumberFormat('fr-FR').format(stats?.totalRevenue || 0)} FCFA
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-brand-green text-xs font-medium">
            <CheckCircle size={12} />
            Factures payées
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold">Revenus (6 derniers mois)</h2>
            <span className="badge-green">FCFA</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2B6B" />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1A1940', border: '1px solid #2D2B6B', borderRadius: '12px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(v: any) => [`${new Intl.NumberFormat('fr-FR').format(Number(v) || 0)} FCFA`, 'Revenu']}
              />
              <Area type="monotone" dataKey="value" stroke="#4F46E5" fill="url(#revenueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Services Chart */}
        <div className="card">
          <h2 className="text-white font-bold mb-6">Par service</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={servicesData} layout="vertical">
              <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} width={40} />
              <Tooltip
                contentStyle={{ background: '#1A1940', border: '1px solid #2D2B6B', borderRadius: '12px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Projets récents</h2>
          <Link to="/admin/projets" className="text-brand-purple-light text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Voir tout <ArrowUpRight size={14} />
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-10">
            <FolderOpen size={36} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500">Aucun projet</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Projet</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((p: any) => (
                  <tr key={p.id}>
                    <td className="text-white font-medium">{p.title}</td>
                    <td>{p.client ? `${p.client.firstName} ${p.client.lastName}` : '—'}</td>
                    <td className="capitalize">{p.service}</td>
                    <td>
                      <span className={p.status === 'en_cours' ? 'badge-purple' : p.status === 'termine' ? 'badge-green' : 'badge-yellow'}>
                        {p.status}
                      </span>
                    </td>
                    <td>{new Date(p.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
