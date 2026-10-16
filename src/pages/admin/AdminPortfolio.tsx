import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Trash2, Edit2, ExternalLink, X, Loader2, Layers } from 'lucide-react';
import { portfolioService, PortfolioItem, PortfolioInput } from '../../services/portfolio.service';

const emptyForm: PortfolioInput = { title: '', category: 'web', clientName: '', description: '', coverImage: '', liveUrl: '' };

export function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getAllAdmin();
      setItems(data || []);
    } catch {
      // Liste vide affichée ; l'admin peut réessayer.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      clientName: item.clientName || '',
      description: item.description,
      coverImage: item.coverImage || '',
      liveUrl: item.liveUrl || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        const updated = await portfolioService.update(editingId, form);
        setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
      } else {
        const created = await portfolioService.create(form);
        setItems((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      setError("L'enregistrement a échoué. Vérifiez votre connexion et réessayez.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette réalisation du portfolio ?')) return;
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await portfolioService.delete(id);
    } catch {
      setItems(previous); // échec réel : on restaure la liste
    }
  };

  const filtered = items.filter(
    (i) => i.title.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion du Portfolio</h1>
          <p className="text-gray-400 text-sm mt-1">Ajoutez et modifiez les réalisations présentées sur la vitrine publique.</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter une réalisation
        </button>
      </div>

      <div className="flex items-center gap-4 bg-brand-card/60 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une réalisation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-gray-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card-glass p-12 text-center rounded-2xl border border-white/10">
          <Layers className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">Aucune réalisation pour l'instant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="card-glass border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={item.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=60'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-brand-dark/80 backdrop-blur text-brand-green text-xs font-semibold uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                  <p className="text-xs text-brand-purple-light font-medium mb-2">{item.clientName || 'Client confidentiel'}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-white/5">
                {item.liveUrl ? (
                  <a href={item.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-green hover:underline flex items-center gap-1">
                    Lien <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <div />}

                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white transition-colors" title="Modifier">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
          <div className="card-glass border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Modifier la réalisation' : 'Ajouter un projet au portfolio'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Titre de la réalisation</label>
                <input
                  type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: SaaS Gestion Immobilière"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Catégorie</label>
                  <select
                    value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  >
                    <option value="web" className="bg-brand-card">Web & SaaS</option>
                    <option value="mobile" className="bg-brand-card">Mobile</option>
                    <option value="design" className="bg-brand-card">UI/UX Design</option>
                    <option value="marketing" className="bg-brand-card">SEO & Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Nom du client</label>
                  <input
                    type="text" value={form.clientName} onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                    placeholder="Ex: ImmoCorp"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">URL de l'image de couverture</label>
                <input
                  type="url" value={form.coverImage} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Lien du projet en ligne (optionnel)</label>
                <input
                  type="url" value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description courte</label>
                <textarea
                  required rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Présentation des enjeux et de la solution apportée..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
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
