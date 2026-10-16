import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderOpen, FileText, Receipt, MessageSquare, TrendingUp,
  Users, Clock, ArrowRight, CheckCircle, AlertTriangle, Loader2
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import apiClient from '../../services/apiClient';

interface DashboardStats {
  projects: number;
  activeProjects: number;
  pendingQuotes: number;
  unpaidInvoices: number;
  unreadMessages: number;
  totalInvoiced: number;
}

interface RecentProject {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
  service: string;
}

const statusColors: Record<string, string> = {
  en_cours: 'badge-purple',
  termine: 'badge-green',
  en_attente: 'badge-yellow',
  annule: 'badge-red',
};

const statusLabels: Record<string, string> = {
  en_cours: 'En cours',
  termine: 'Terminé',
  en_attente: 'En attente',
  en_pause: 'En pause',
  annule: 'Annulé',
};

export function ClientDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, quoteRes, invoiceRes] = await Promise.all([
          apiClient.get('/projects'),
          apiClient.get('/quotes'),
          apiClient.get('/invoices'),
        ]);

        const allProjects = projRes.data.data || [];
        const quotes = quoteRes.data.data || [];
        const invoices = invoiceRes.data.data || [];

        setStats({
          projects: allProjects.length,
          activeProjects: allProjects.filter((p: any) => p.status === 'en_cours').length,
          pendingQuotes: quotes.filter((q: any) => q.status === 'envoye').length,
          unpaidInvoices: invoices.filter((i: any) => i.status === 'envoye').length,
          unreadMessages: 0,
          totalInvoiced: invoices
            .filter((i: any) => i.status === 'paye')
            .reduce((s: number, i: any) => s + (i.totalTTC || 0), 0),
        });

        setProjects(allProjects.slice(0, 5));
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

  const quickLinks = [
    { icon: FolderOpen, label: 'Mes Projets', count: stats?.projects, href: '/client/projets', color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
    { icon: FileText, label: 'Devis en attente', count: stats?.pendingQuotes, href: '/client/devis', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { icon: Receipt, label: 'Factures impayées', count: stats?.unpaidInvoices, href: '/client/factures', color: 'text-red-400', bg: 'bg-red-400/10' },
    { icon: MessageSquare, label: 'Messages', count: stats?.unreadMessages, href: '/client/messages', color: 'text-brand-green', bg: 'bg-brand-green/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">
          Bonjour, {user?.firstName} 👋
        </h1>
        <p className="text-gray-400 mt-1">Voici un résumé de votre espace client</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map(({ icon: Icon, label, count, href, color, bg }) => (
          <Link key={label} to={href} className="card-hover group">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <div className="stat-value">{count ?? 0}</div>
            <div className="stat-label mt-1">{label}</div>
            <div className={`mt-3 flex items-center gap-1 text-xs ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>
              Voir <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Mes projets récents</h2>
          <Link to="/client/projets" className="text-brand-purple-light text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Aucun projet pour l'instant</p>
            <p className="text-gray-600 text-sm mt-1">Contactez-nous pour démarrer votre premier projet</p>
            <Link to="/contact" className="btn-primary mt-4 inline-flex">Nous contacter</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Projet</th>
                  <th>Service</th>
                  <th>Statut</th>
                  <th>Dernière MAJ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="font-medium text-white">{project.title}</td>
                    <td className="capitalize">{project.service}</td>
                    <td>
                      <span className={statusColors[project.status] || 'badge-gray'}>
                        {statusLabels[project.status] || project.status}
                      </span>
                    </td>
                    <td>{new Date(project.updatedAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <Link to={`/client/projets`} className="text-brand-purple-light text-xs hover:underline">
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom alerts */}
      {(stats?.pendingQuotes || 0) > 0 && (
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
          <AlertTriangle size={20} className="text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-medium text-sm">
              {stats?.pendingQuotes} devis en attente de votre validation
            </p>
            <Link to="/client/devis" className="text-yellow-400/70 text-xs hover:text-yellow-400 transition-colors">
              Consulter mes devis →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
