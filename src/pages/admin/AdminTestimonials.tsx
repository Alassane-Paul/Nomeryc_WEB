import React, { useEffect, useState } from 'react';
import { MessageSquareQuote, Plus, Search, Trash2, Edit2, X, Loader2, Star } from 'lucide-react';
import { testimonialsService, Testimonial } from '../../services/testimonials.service';

const emptyForm = { name: '', role: '', content: '', initials: '', rating: 5 };

export function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await testimonialsService.getAllAdmin();
        setItems(data || []);
      } catch {
        setItems([]);
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

  const openEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      content: item.content,
      initials: item.initials || '',
      rating: item.rating || 5,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, initials: form.initials || form.name.slice(0, 2).toUpperCase() };
      if (editingId) {
        const updated = await testimonialsService.update(editingId, payload);
        setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
      } else {
        const created = await testimonialsService.create({ ...payload, orderIndex: items.length });
        setItems(prev => [...prev, created]);
      }
      setIsModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      // L'API n'a pas répondu ; le formulaire reste ouvert côté utilisateur pour réessayer.
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Retirer ce témoignage de la page d\'accueil ?')) return;
    try {
      await testimonialsService.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {
      // suppression non aboutie côté serveur, on laisse la liste inchangée
    }
  };

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Témoignages Clients</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gérez les avis affichés sur la page d'accueil — sans toucher au code.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter un témoignage
        </button>
      </div>

      <div className="flex items-center gap-4 bg-brand-card/60 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un témoignage..."
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
          <MessageSquareQuote className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aucun témoignage pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="card-glass border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-4 mb-4">"{item.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-gray-500 text-xs truncate">{item.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-white/5">
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors" title="Modifier">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="card-glass border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Modifier le témoignage' : 'Ajouter un témoignage'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Nom du client</label>
                  <input
                    type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Kofi Asante"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Poste / Entreprise</label>
                  <input
                    type="text" required value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Ex: CEO, TechLokal"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Témoignage</label>
                <textarea
                  required rows={3} value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Ce que le client a dit..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Initiales (optionnel)</label>
                  <input
                    type="text" maxLength={3} value={form.initials}
                    onChange={(e) => setForm({ ...form, initials: e.target.value.toUpperCase() })}
                    placeholder="Auto si vide"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Note (sur 5)</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n} className="bg-brand-card">{n} étoiles</option>)}
                  </select>
                </div>
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
