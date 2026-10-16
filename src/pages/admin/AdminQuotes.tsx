import React, { useEffect, useState, useCallback } from 'react';
import {
  FileText, Plus, Search, Eye, Trash2, Send, X, ChevronRight, Download, Loader2,
} from 'lucide-react';
import { quotesService, Quote, QuoteStatus, QuoteInput } from '../../services/quotes.service';
import { usersService } from '../../services/users.service';
import { projectsService, Project } from '../../services/projects.service';
import { User } from '../../services/auth.service';

interface LineItem {
  id: number;
  designation: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
}

const STATUS_MAP: Record<QuoteStatus, { label: string; badge: string }> = {
  brouillon: { label: 'Brouillon', badge: 'badge-gray' },
  envoye: { label: 'En attente', badge: 'badge-yellow' },
  accepte: { label: 'Accepté', badge: 'badge-green' },
  refuse: { label: 'Refusé', badge: 'badge-red' },
  expire: { label: 'Expiré', badge: 'badge-gray' },
};

const TVA_DEFAULT = 18;

function fcfa(n: number) {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(n || 0))} FCFA`;
}

export function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Formulaire
  const [formClient, setFormClient] = useState('');
  const [formProject, setFormProject] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formValidity, setFormValidity] = useState('');
  const [formTvaRate, setFormTvaRate] = useState(TVA_DEFAULT);
  const [formTerms, setFormTerms] = useState(
    "Les prix sont exprimés en FCFA. Ce devis est valable jusqu'à la date indiquée ci-contre. Toute modification du périmètre peut entraîner une révision des prix."
  );
  const [lines, setLines] = useState<LineItem[]>([{ id: 1, designation: '', quantity: 1, unitPrice: 0 }]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    try {
      const [quotesData, clientsData, projectsData] = await Promise.all([
        quotesService.getAll(),
        usersService.getAll({ role: 'client' }),
        projectsService.getAll(),
      ]);
      setQuotes(quotesData);
      setClients(clientsData);
      setProjects(projectsData);
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addLine = () => setLines((prev) => [...prev, { id: Date.now(), designation: '', quantity: 1, unitPrice: 0 }]);
  const removeLine = (id: number) => setLines((prev) => prev.filter((l) => l.id !== id));
  const updateLine = (id: number, field: keyof LineItem, value: string | number) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const tvaAmount = subtotal * (formTvaRate / 100);
  const total = subtotal + tvaAmount;

  const resetForm = () => {
    setFormClient('');
    setFormProject('');
    setFormTitle('');
    setFormValidity('');
    setFormTvaRate(TVA_DEFAULT);
    setLines([{ id: 1, designation: '', quantity: 1, unitPrice: 0 }]);
    setFormError('');
  };

  const handleCreate = async (sendImmediately: boolean) => {
    setFormError('');
    if (!formClient) return setFormError('Sélectionnez un client.');
    const validLines = lines.filter((l) => l.designation.trim() && l.quantity > 0);
    if (validLines.length === 0) return setFormError('Ajoutez au moins une ligne valide.');

    setSaving(true);
    try {
      const payload: QuoteInput = {
        clientId: formClient,
        projectId: formProject || undefined,
        title: formTitle || undefined,
        tvaRate: formTvaRate,
        validUntil: formValidity || undefined,
        terms: formTerms,
        items: validLines.map((l) => ({ designation: l.designation, quantity: l.quantity, unitPrice: l.unitPrice, unit: l.unit })),
      };
      const created = await quotesService.create(payload);

      if (sendImmediately) {
        await quotesService.updateStatus(created.id, 'envoye');
        created.status = 'envoye';
      }

      setQuotes((prev) => [created, ...prev]);
      resetForm();
      setShowCreate(false);
    } catch {
      setFormError("Erreur lors de la création du devis. Vérifiez les champs et réessayez.");
    } finally {
      setSaving(false);
    }
  };

  const sendQuote = async (id: string) => {
    setActionLoadingId(id);
    try {
      await quotesService.updateStatus(id, 'envoye');
      setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'envoye' } : q)));
    } catch {
      // silencieux
    } finally {
      setActionLoadingId(null);
    }
  };

  const removeQuote = async (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    try {
      await quotesService.delete(id);
    } catch {
      load();
    }
  };

  const filtered = quotes.filter((q) => {
    const label = q.title || q.quoteNumber;
    const matchSearch = label.toLowerCase().includes(search.toLowerCase()) || q.quoteNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || q.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const clientProjects = projects.filter((p) => p.clientId === formClient);

  /* ── Formulaire de création ── */
  if (showCreate) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <button onClick={() => setShowCreate(false)} className="hover:text-white transition-colors">Devis</button>
              <ChevronRight size={14} />
              <span className="text-white font-medium">Nouveau devis</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Nouveau Devis</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleCreate(false)} disabled={saving} className="btn-secondary btn-sm">
              {saving ? 'Enregistrement...' : 'Enregistrer en brouillon'}
            </button>
            <button onClick={() => handleCreate(true)} disabled={saving} className="btn-success btn-sm flex items-center gap-2">
              <Send size={14} />
              {saving ? 'Envoi...' : 'Créer et envoyer'}
            </button>
          </div>
        </div>

        {formError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{formError}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label">Client *</label>
                  <select value={formClient} onChange={(e) => { setFormClient(e.target.value); setFormProject(''); }} className="input">
                    <option value="">Sélectionner un client</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.firstName} {c.lastName}{c.company ? ` — ${c.company}` : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Projet lié (optionnel)</label>
                  <select value={formProject} onChange={(e) => setFormProject(e.target.value)} className="input" disabled={!formClient}>
                    <option value="">Aucun projet</option>
                    {clientProjects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 input-group">
                <label className="input-label">Titre du devis</label>
                <input type="text" placeholder="Ex : Refonte site vitrine" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="input" />
              </div>
            </div>

            <div className="card">
              <h3 className="text-white font-semibold mb-4">Détail des prestations</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="w-full">Désignation</th>
                      <th className="w-24">Quantité</th>
                      <th className="w-36">Prix unitaire (HT)</th>
                      <th className="w-32">Total (HT)</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => (
                      <tr key={line.id}>
                        <td>
                          <input
                            type="text"
                            value={line.designation}
                            onChange={(e) => updateLine(line.id, 'designation', e.target.value)}
                            placeholder="Prestation, service..."
                            className="w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-600 border-b border-transparent focus:border-brand-purple/50 py-1"
                          />
                        </td>
                        <td>
                          <input
                            type="number" min={1} value={line.quantity}
                            onChange={(e) => updateLine(line.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-20 bg-transparent text-white text-sm outline-none text-center border-b border-transparent focus:border-brand-purple/50 py-1"
                          />
                        </td>
                        <td>
                          <input
                            type="number" min={0} step={100} value={line.unitPrice}
                            onChange={(e) => updateLine(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-32 bg-transparent text-white text-sm outline-none text-right border-b border-transparent focus:border-brand-purple/50 py-1"
                          />
                        </td>
                        <td className="text-white text-sm font-medium text-right pr-2">{fcfa(line.quantity * line.unitPrice)}</td>
                        <td>
                          {lines.length > 1 && (
                            <button onClick={() => removeLine(line.id)} className="p-1 text-gray-600 hover:text-red-400 transition-colors">
                              <X size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={addLine}
                className="mt-4 flex items-center gap-2 text-brand-purple text-sm font-medium hover:text-brand-purple-light transition-colors border border-brand-purple/30 rounded-xl px-4 py-2 hover:bg-brand-purple/10"
              >
                <Plus size={14} />
                Ajouter une ligne
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="input-group">
                <label className="input-label">Date de validité</label>
                <input type="date" value={formValidity} onChange={(e) => setFormValidity(e.target.value)} className="input" />
              </div>
              <div className="input-group">
                <label className="input-label">TVA (%)</label>
                <input type="number" min={0} max={100} value={formTvaRate} onChange={(e) => setFormTvaRate(parseFloat(e.target.value) || 0)} className="input" />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Conditions générales</label>
              <textarea value={formTerms} onChange={(e) => setFormTerms(e.target.value)} rows={4} className="input resize-none text-xs" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-white font-semibold mb-4">Récapitulatif</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Sous-total HT</span>
                  <span>{fcfa(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>TVA ({formTvaRate}%)</span>
                  <span>{fcfa(tvaAmount)}</span>
                </div>
                <div className="border-t border-surface-border pt-3 flex justify-between font-bold text-base">
                  <span className="text-white">Total (TTC)</span>
                  <span className="text-brand-green text-lg">{fcfa(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Vue liste ── */
  const statusFilters = [
    { key: 'ALL', label: 'Tous' },
    { key: 'brouillon', label: 'Brouillons' },
    { key: 'envoye', label: 'En attente' },
    { key: 'accepte', label: 'Acceptés' },
    { key: 'refuse', label: 'Refusés' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Devis</h1>
          <p className="text-gray-400 text-sm mt-1">{quotes.length} devis au total</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-success flex items-center gap-2">
          <Plus size={16} />
          Nouveau devis
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: quotes.length, color: 'text-white' },
          { label: 'En attente', value: quotes.filter((q) => q.status === 'envoye').length, color: 'text-yellow-400' },
          { label: 'Acceptés', value: quotes.filter((q) => q.status === 'accepte').length, color: 'text-brand-green' },
          { label: 'Refusés', value: quotes.filter((q) => q.status === 'refuse').length, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-400 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Rechercher un devis..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {statusFilters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                filterStatus === key ? 'bg-brand-purple text-white' : 'bg-surface text-gray-400 border border-surface-border hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Devis</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12"><Loader2 className="w-5 h-5 text-gray-500 animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">Aucun devis trouvé</td></tr>
              ) : (
                filtered.map((q) => {
                  const st = STATUS_MAP[q.status] || { label: q.status, badge: 'badge-gray' };
                  return (
                    <tr key={q.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-purple/15 flex items-center justify-center">
                            <FileText size={15} className="text-brand-purple-light" />
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{q.title || q.project?.title || q.quoteNumber}</p>
                            <p className="text-gray-500 text-xs">{q.quoteNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-300 text-sm">{q.client ? `${q.client.firstName} ${q.client.lastName}` : '—'}</td>
                      <td className="text-white font-semibold text-sm">{fcfa(q.totalTTC)}</td>
                      <td className="text-gray-400 text-sm">{new Date(q.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td><span className={`badge ${st.badge}`}>{st.label}</span></td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => quotesService.downloadPdf(q.id, `Devis-${q.quoteNumber}.pdf`).catch(() => {})}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover transition-all"
                            title="Télécharger PDF"
                          >
                            <Eye size={14} />
                          </button>
                          {q.status === 'brouillon' && (
                            <button
                              onClick={() => sendQuote(q.id)}
                              disabled={actionLoadingId === q.id}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-green hover:bg-brand-green/10 transition-all"
                              title="Envoyer au client"
                            >
                              {actionLoadingId === q.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            </button>
                          )}
                          <button
                            onClick={() => removeQuote(q.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Supprimer"
                          >
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
    </div>
  );
}
