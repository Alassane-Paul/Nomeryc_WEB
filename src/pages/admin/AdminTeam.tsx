import React, { useEffect, useState } from 'react';
import { Users, Plus, Search, Trash2, Edit2, X, Loader2, GripVertical } from 'lucide-react';
import { teamService, TeamMember } from '../../services/team.service';

const emptyForm = { name: '', role: '', bio: '', avatar: '' };

export function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await teamService.getAllAdmin();
        setMembers(data || []);
      } catch {
        setMembers([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      avatar: member.avatar || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const updated = await teamService.update(editingId, form);
        setMembers(prev => prev.map(m => (m.id === editingId ? updated : m)));
      } else {
        const created = await teamService.create({ ...form, orderIndex: members.length });
        setMembers(prev => [...prev, created]);
      }
      setIsModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      // L'API n'a pas répondu (backend non lancé, réseau...) : on ne fait rien de plus,
      // l'utilisateur reverra son formulaire pour réessayer.
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Retirer ce membre de la page "À propos" ?')) return;
    try {
      await teamService.delete(id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch {
      // idem : on laisse la liste telle quelle, la suppression n'a pas abouti côté serveur
    }
  };

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion de l'Équipe</h1>
          <p className="text-gray-400 text-sm mt-1">
            Ajoutez, modifiez ou retirez les membres affichés sur la page publique "À propos" — sans toucher au code.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Ajouter un membre
        </button>
      </div>

      <div className="flex items-center gap-4 bg-brand-card/60 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aucun membre pour le moment. Ajoutez le premier via le bouton ci-dessus.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((member) => (
            <div key={member.id} className="card-glass border border-white/10 rounded-2xl overflow-hidden p-6 text-center relative group">
              <GripVertical className="w-4 h-4 text-gray-600 absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-brand-purple/30 mb-4">
                <img
                  src={member.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=60'}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-bold text-white text-base">{member.name}</h3>
              <p className="text-xs font-semibold text-brand-purple-light mt-0.5 mb-3">{member.role}</p>
              <p className="text-xs text-gray-400 line-clamp-3">{member.bio}</p>

              <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-white/5">
                <button
                  onClick={() => openEdit(member)}
                  className="p-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Création / Édition */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="card-glass border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Modifier le membre' : "Ajouter un membre à l'équipe"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Alassane Paul"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Poste / Rôle</label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Ex: Lead Architect"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">URL de la photo</label>
                <input
                  type="url"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Bio courte</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Quelques mots sur son expertise..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editingId ? 'Enregistrer' : 'Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
