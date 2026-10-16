import React, { useEffect, useState, useCallback } from 'react';
import { FolderOpen, Search, Loader2 } from 'lucide-react';
import { projectsService, Project, ProjectStatus } from '../../services/projects.service';

const statusMap: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  devis: { label: 'Devis en cours', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  en_cours: { label: 'En développement', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  revision: { label: 'En recette & révision', color: 'text-brand-purple-light', bg: 'bg-brand-purple/20 border-brand-purple/30' },
  termine: { label: 'Livré & Validé', color: 'text-brand-green', bg: 'bg-brand-green/10 border-brand-green/20' },
  annule: { label: 'Annulé', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
};

function fcfa(n: number) {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(n || 0))} FCFA`;
}

export function ClientProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const load = useCallback(async () => {
    try {
      setProjects(await projectsService.getAll());
    } catch {
      // silencieux : liste vide affichée
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Mes Projets</h1>
        <p className="text-gray-400 text-sm mt-1">Suivez en temps réel l'avancement et les livrables de vos commandes.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-brand-card/60 p-4 rounded-xl border border-white/5">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['ALL', 'en_cours', 'revision', 'termine'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === status ? 'bg-brand-purple text-white shadow-sm' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {status === 'ALL' ? 'Tous' : statusMap[status as ProjectStatus]?.label || status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-gray-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card-glass p-12 text-center rounded-2xl border border-white/10">
          <FolderOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Aucun projet trouvé</h3>
          <p className="text-sm text-gray-400 mt-1">Vous n'avez pas encore de projet actif dans cette catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((project) => {
            const st = statusMap[project.status] || { label: project.status, color: 'text-gray-300', bg: 'bg-white/10' };
            const progress = project.status === 'termine' ? 100 : project.status === 'annule' ? 0 : project.progress ?? 0;

            return (
              <div key={project.id} className="card-glass border border-white/10 rounded-2xl p-6 hover:border-brand-purple/40 transition-all flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${st.color} ${st.bg}`}>{st.label}</span>
                    <span className="text-xs text-gray-400 font-mono">Ref: #{project.id.slice(-6)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">{project.description}</p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">Progression globale</span>
                    <span className="text-brand-green font-bold">{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6C2BD9 0%, #10B981 100%)' }}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block mb-1">Service</span>
                      <span className="text-white font-medium capitalize">{project.service}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Échéance estimée</span>
                      <span className="text-white font-medium">
                        {project.deadline ? new Date(project.deadline).toLocaleDateString('fr-FR') : 'Non définie'}
                      </span>
                    </div>
                  </div>

                  {project.budget && (
                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="text-gray-400">Budget engagé</span>
                      <span className="text-base font-bold text-brand-green">{fcfa(project.budget)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
