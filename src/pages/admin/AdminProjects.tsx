import React, { useEffect, useState, useCallback } from 'react';
import { FolderOpen, Plus, Search, CheckCircle2, Clock, Loader2, X, Download, DollarSign, Trash2 } from 'lucide-react';
import { projectsService, Project, ProjectStatus, ServiceType, ProjectInput } from '../../services/projects.service';
import { usersService } from '../../services/users.service';
import { User } from '../../services/auth.service';

const statusMap: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  devis: { label: 'Devis', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  en_cours: { label: 'En cours', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  revision: { label: 'En révision', color: 'text-brand-purple-light', bg: 'bg-brand-purple/20 border-brand-purple/30' },
  termine: { label: 'Terminé', color: 'text-brand-green', bg: 'bg-brand-green/10 border-brand-green/20' },
  annule: { label: 'Annulé', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
};

const SERVICE_LABELS: Record<ServiceType, string> = {
  web: 'Web & SaaS',
  apps: 'Applications mobiles',
  audit: 'Audit technique',
  design: 'UI/UX Design',
  bot: 'Bot WhatsApp / IA',
};

function fcfa(n: number) {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(n || 0))} FCFA`;
}

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newClientId, setNewClientId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newService, setNewService] = useState<ServiceType>('web');
  const [newBudget, setNewBudget] = useState(500000);
  const [newDeadline, setNewDeadline] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    try {
      const [projectsData, clientsData] = await Promise.all([
        projectsService.getAll(),
        usersService.getAll({ role: 'client' }),
      ]);
      setProjects(projectsData);
      setClients(clientsData);
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!newClientId) return setFormError('Sélectionnez un client.');

    setCreating(true);
    try {
      const payload: ProjectInput = {
        clientId: newClientId,
        title: newTitle,
        description: newDesc,
        service: newService,
        budget: Number(newBudget) || undefined,
        deadline: newDeadline || undefined,
      };
      const created = await projectsService.create(payload);
      setProjects((prev) => [created, ...prev]);
      setIsCreateOpen(false);
      setNewClientId('');
      setNewTitle('');
      setNewDesc('');
      setNewDeadline('');
    } catch {
      setFormError('Erreur lors de la création du projet. Vérifiez les champs et réessayez.');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ProjectStatus) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    try {
      await projectsService.update(id, { status: newStatus });
    } catch {
      load(); // resynchronise en cas d'échec
    }
  };

  const removeProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await projectsService.delete(id);
    } catch {
      load();
    }
  };

  const exportCSV = () => {
    const headers = ['ID,Titre,Service,Budget,Statut,Date Creation'];
    const rows = projects.map((p) => `"${p.id}","${p.title}","${p.service}","${p.budget || 0}","${p.status}","${p.createdAt}"`);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `projets_nomeryc_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const inProgressCount = projects.filter((p) => p.status === 'en_cours').length;
  const completedCount = projects.filter((p) => p.status === 'termine').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion des Projets</h1>
          <p className="text-gray-400 text-sm mt-1">Supervisez l'ensemble des chantiers techniques et le suivi de production.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Exporter CSV
          </button>
          <button onClick={() => setIsCreateOpen(true)} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nouveau Projet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-glass border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold mb-2">
            <span>Total Projets</span>
            <FolderOpen className="w-4 h-4 text-brand-purple-light" />
          </div>
          <p className="text-2xl font-bold text-white">{projects.length}</p>
        </div>
        <div className="card-glass border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold mb-2">
            <span>En Cours</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400">{inProgressCount}</p>
        </div>
        <div className="card-glass border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold mb-2">
            <span>Terminés</span>
            <CheckCircle2 className="w-4 h-4 text-brand-green" />
          </div>
          <p className="text-2xl font-bold text-brand-green">{completedCount}</p>
        </div>
        <div className="card-glass border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold mb-2">
            <span>Budget Cumulé</span>
            <DollarSign className="w-4 h-4 text-brand-green" />
          </div>
          <p className="text-2xl font-bold text-white">{fcfa(totalBudget)}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-brand-card/60 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'ALL', label: 'Tous' },
            { key: 'en_cours', label: 'En cours' },
            { key: 'revision', label: 'En révision' },
            { key: 'termine', label: 'Terminés' },
            { key: 'devis', label: 'Devis' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === f.key ? 'bg-brand-purple text-white shadow-sm' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-glass border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-brand-card/80 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Titre du Projet</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center"><Loader2 className="w-5 h-5 text-gray-500 animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">Aucun projet ne correspond à vos filtres.</td></tr>
              ) : (
                filtered.map((project) => {
                  const st = statusMap[project.status] || { label: project.status, color: 'text-gray-300', bg: 'bg-white/10' };
                  return (
                    <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{project.title}</div>
                        <div className="text-xs text-gray-400 line-clamp-1">{project.description}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-300">
                        {project.client ? `${project.client.firstName} ${project.client.lastName}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono uppercase text-gray-300">{SERVICE_LABELS[project.service] || project.service}</td>
                      <td className="px-6 py-4 font-bold text-brand-green text-sm">{project.budget ? fcfa(project.budget) : '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${st.color} ${st.bg}`}>{st.label}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={project.status}
                            onChange={(e) => handleStatusChange(project.id, e.target.value as ProjectStatus)}
                            className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-brand-purple cursor-pointer"
                          >
                            {Object.entries(statusMap).map(([key, { label }]) => (
                              <option key={key} value={key} className="bg-brand-card">{label}</option>
                            ))}
                          </select>
                          <button onClick={() => removeProject(project.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Supprimer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setIsCreateOpen(false)}>
          <div className="card-glass border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Nouveau Projet Client</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">{formError}</div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Client *</label>
                <select
                  required
                  value={newClientId}
                  onChange={(e) => setNewClientId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id} className="bg-brand-card">{c.firstName} {c.lastName}{c.company ? ` — ${c.company}` : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Titre du projet</label>
                <input
                  type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Refonte Plateforme Web"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
                <textarea
                  required rows={3} minLength={10} value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Objectifs et spécifications du projet..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Service</label>
                  <select
                    value={newService} onChange={(e) => setNewService(e.target.value as ServiceType)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  >
                    {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                      <option key={key} value={key} className="bg-brand-card">{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Budget (FCFA)</label>
                  <input
                    type="number" min={0} step={1000} value={newBudget} onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Échéance</label>
                <input
                  type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white">
                  Annuler
                </button>
                <button type="submit" disabled={creating} className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Créer le projet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
