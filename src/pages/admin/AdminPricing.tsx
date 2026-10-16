import React, { useEffect, useState } from 'react';
import { Tags, Plus, Search, Trash2, Edit2, X, Loader2, Star, Check } from 'lucide-react';
import { pricingService, PricingPlan } from '../../services/pricing.service';

const emptyForm = {
  name: '', badge: '', price: '', currency: 'FCFA', period: '', description: '',
  featuresText: '', highlighted: false, ctaText: '', ctaLink: '',
};

export function AdminPricing() {
  const [items, setItems] = useState<PricingPlan[]>([]);
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
        const data = await pricingService.getAllAdmin();
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

  const openEdit = (item: PricingPlan) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      badge: item.badge || '',
      price: item.price,
      currency: item.currency || 'FCFA',
      period: item.period || '',
      description: item.description || '',
      featuresText: (item.features || []).join('\n'),
      highlighted: item.highlighted || false,
      ctaText: item.ctaText || '',
      ctaLink: item.ctaLink || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { featuresText, ...rest } = form;
      const payload = {
        ...rest,
        features: featuresText.split('\n').map(f => f.trim()).filter(Boolean),
      };
      if (editingId) {
        const updated = await pricingService.update(editingId, payload);
        setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
      } else {
        const created = await pricingService.create({ ...payload, orderIndex: items.length });
        setItems(prev => [...prev, created]);
      }
      setIsModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      // L'API n'a pas répondu ; le formulaire reste ouvert pour réessayer.
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Retirer cette offre de la page Tarifs ?')) return;
    try {
      await pricingService.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {
      // suppression non aboutie côté serveur
    }
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Offres Tarifaires</h1>
          <p className="text-gray-400 text-sm mt-1">Gérez les packs affichés sur la page Tarifs — sans toucher au code.</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter une offre
        </button>
      </div>

      <div className="flex items-center gap-4 bg-brand-card/60 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une offre..."
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
          <Tags className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aucune offre pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className={`card-glass border rounded-2xl p-6 flex flex-col justify-between ${item.highlighted ? 'border-brand-purple/50' : 'border-white/10'}`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-brand-purple-light">{item.badge}</span>
                  {item.highlighted && <Star className="w-4 h-4 text-brand-green fill-brand-green" />}
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{item.name}</h3>
                <p className="text-2xl font-black text-white mb-1">
                  {item.price} <span className="text-sm font-bold text-brand-green">{item.currency}</span>
                </p>
                <p className="text-xs text-gray-500 mb-4">{item.period}</p>
                <ul className="space-y-1.5 mb-4">
                  {(item.features || []).slice(0, 4).map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                      <Check className="w-3 h-3 text-brand-green shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                  {(item.features || []).length > 4 && (
                    <li className="text-xs text-gray-600">+ {item.features!.length - 4} autres</li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="card-glass border border-white/10 rounded-2xl max-w-xl w-full p-6 space-y-6 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{editingId ? "Modifier l'offre" : 'Ajouter une offre'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Nom de l'offre</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Pack Business Pro"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Badge</label>
                  <input type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="Ex: Le Plus Populaire"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Prix</label>
                  <input type="text" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="990 ou Sur devis"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Devise</label>
                  <input type="text" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    placeholder="FCFA"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Période</label>
                  <input type="text" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}
                    placeholder="paiement unique"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Présentation courte de l'offre..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple resize-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Fonctionnalités incluses (une par ligne)</label>
                <textarea rows={5} value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  placeholder={'Site web moderne\nDesign responsive\n...'}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple resize-none font-mono" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Texte du bouton</label>
                  <input type="text" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                    placeholder="Choisir cette offre"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Lien du bouton</label>
                  <input type="text" value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                    placeholder="/contact?plan=pro"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple" />
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer w-fit">
                <input type="checkbox" checked={form.highlighted} onChange={(e) => setForm({ ...form, highlighted: e.target.checked })}
                  className="w-4 h-4 rounded accent-brand-purple" />
                <span className="text-xs font-semibold text-gray-300">Mettre en avant (offre recommandée)</span>
              </label>

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
