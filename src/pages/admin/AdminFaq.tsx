import React, { useEffect, useState } from 'react';
import { HelpCircle, Plus, Search, Trash2, Edit2, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { faqsService, Faq } from '../../services/faqs.service';

const emptyForm = { question: '', answer: '' };

export function AdminFaq() {
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await faqsService.getAllAdmin();
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

  const openEdit = (item: Faq) => {
    setEditingId(item.id);
    setForm({ question: item.question, answer: item.answer });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const updated = await faqsService.update(editingId, form);
        setItems(prev => prev.map(i => (i.id === editingId ? updated : i)));
      } else {
        const created = await faqsService.create({ ...form, orderIndex: items.length });
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
    if (!confirm('Retirer cette question de la page Tarifs ?')) return;
    try {
      await faqsService.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {
      // suppression non aboutie côté serveur
    }
  };

  const filtered = items.filter(i => i.question.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Questions Fréquentes</h1>
          <p className="text-gray-400 text-sm mt-1">Gérez la FAQ affichée sur la page Tarifs — sans toucher au code.</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter une question
        </button>
      </div>

      <div className="flex items-center gap-4 bg-brand-card/60 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une question..."
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
          <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aucune question pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="card-glass border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 gap-3">
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="flex-1 flex items-center justify-between text-left text-sm font-semibold text-white hover:text-brand-purple-light transition-colors"
                  >
                    <span>{item.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 ml-3" /> : <ChevronDown className="w-4 h-4 shrink-0 ml-3" />}
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors" title="Modifier">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Supprimer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="card-glass border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Modifier la question' : 'Ajouter une question'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Question</label>
                <input
                  type="text" required value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="Ex: Proposez-vous un contrat de maintenance ?"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Réponse</label>
                <textarea
                  required rows={4} value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="Réponse détaillée..."
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
