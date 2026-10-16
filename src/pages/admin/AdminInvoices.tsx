import React, { useEffect, useState, useCallback } from 'react';
import { Search, Download, Loader2, Plus, X } from 'lucide-react';
import { invoicesService, Invoice, InvoiceStatus, InvoiceInput } from '../../services/invoices.service';
import { usersService } from '../../services/users.service';
import { projectsService, Project } from '../../services/projects.service';
import { User } from '../../services/auth.service';

interface LineItem {
  id: number;
  designation: string;
  quantity: number;
  unitPrice: number;
}

const statusMap: Record<InvoiceStatus, { label: string; color: string; bg: string }> = {
  brouillon: { label: 'Brouillon', color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' },
  envoye: { label: 'En attente', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  paye: { label: 'Payée', color: 'text-brand-green', bg: 'bg-brand-green/10 border-brand-green/20' },
  partiellement_paye: { label: 'Partielle', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  en_retard: { label: 'En retard', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
  annule: { label: 'Annulée', color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' },
};

function fcfa(n: number) {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(n || 0))} FCFA`;
}

export function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [markingId, setMarkingId] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [formClient, setFormClient] = useState('');
  const [formProject, setFormProject] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formTvaRate, setFormTvaRate] = useState(18);
  const [lines, setLines] = useState<LineItem[]>([{ id: 1, designation: '', quantity: 1, unitPrice: 0 }]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    try {
      const [invoicesData, clientsData, projectsData] = await Promise.all([
        invoicesService.getAll(),
        usersService.getAll({ role: 'client' }),
        projectsService.getAll(),
      ]);
      setInvoices(invoicesData);
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

  const handleMarkAsPaid = async (id: string) => {
    setMarkingId(id);
    try {
      const updated = await invoicesService.markAsPaid(id);
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? updated : inv)));
    } catch {
      // silencieux
    } finally {
      setMarkingId(null);
    }
  };

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
    setFormDueDate('');
    setFormTvaRate(18);
    setLines([{ id: 1, designation: '', quantity: 1, unitPrice: 0 }]);
    setFormError('');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formClient) return setFormError('Sélectionnez un client.');
    const validLines = lines.filter((l) => l.designation.trim() && l.quantity > 0);
    if (validLines.length === 0) return setFormError('Ajoutez au moins une ligne valide.');

    setSaving(true);
    try {
      const payload: InvoiceInput = {
        clientId: formClient,
        projectId: formProject || undefined,
        tvaRate: formTvaRate,
        dueDate: formDueDate || undefined,
        items: validLines.map((l) => ({ designation: l.designation, quantity: l.quantity, unitPrice: l.unitPrice })),
      };
      const created = await invoicesService.create(payload);
      setInvoices((prev) => [created, ...prev]);
      resetForm();
      setShowCreate(false);
    } catch {
      setFormError('Erreur lors de la création de la facture. Vérifiez les champs et réessayez.');
    } finally {
      setSaving(false);
    }
  };

  const clientProjects = projects.filter((p) => p.clientId === formClient);

  const exportCSV = () => {
    const headers = ['Numero,Client,Montant_HT,TVA,Total_TTC,Statut,Echeance'];
    const rows = invoices.map(
      (i) =>
        `"${i.invoiceNumber}","${i.client ? i.client.firstName + ' ' + i.client.lastName : i.clientId}","${i.totalHT}","${i.totalTVA}","${i.totalTTC}","${i.status}","${i.dueDate}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `factures_nomeryc_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = invoices.filter((inv) => {
    const matchSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCollected = invoices.filter((i) => i.status === 'paye').reduce((acc, i) => acc + i.totalTTC, 0);
  const totalPending = invoices.filter((i) => i.status === 'envoye' || i.status === 'partiellement_paye').reduce((acc, i) => acc + i.totalTTC, 0);
  const totalOverdue = invoices.filter((i) => i.status === 'en_retard').reduce((acc, i) => acc + i.totalTTC, 0);
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalTTC, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Facturation Globale</h1>
          <p className="text-gray-400 text-sm mt-1">Supervisez les encaissements, relances et conformité comptable.</p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Exporter CSV
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nouvelle facture
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-glass p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-gray-400 font-semibold uppercase">Total Facturé</span>
          <p className="text-2xl font-bold text-white mt-1">{fcfa(totalInvoiced)}</p>
        </div>
        <div className="card-glass p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-gray-400 font-semibold uppercase">Total Encaissé</span>
          <p className="text-2xl font-bold text-brand-green mt-1">{fcfa(totalCollected)}</p>
        </div>
        <div className="card-glass p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-gray-400 font-semibold uppercase">En Attente</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{fcfa(totalPending)}</p>
        </div>
        <div className="card-glass p-5 rounded-2xl border border-white/10">
          <span className="text-xs text-gray-400 font-semibold uppercase">En Retard</span>
          <p className="text-2xl font-bold text-red-400 mt-1">{fcfa(totalOverdue)}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-brand-card/60 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par numéro de facture..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'ALL', label: 'Toutes' },
            { key: 'paye', label: 'Payées' },
            { key: 'envoye', label: 'En attente' },
            { key: 'en_retard', label: 'En retard' },
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
                <th className="px-6 py-4">Numéro</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Échéance</th>
                <th className="px-6 py-4">Montant TTC</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center"><Loader2 className="w-5 h-5 text-gray-500 animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">Aucune facture trouvée.</td></tr>
              ) : (
                filtered.map((inv) => {
                  const st = statusMap[inv.status] || { label: inv.status, color: 'text-gray-300', bg: 'bg-white/10' };
                  const isPending = inv.status === 'envoye' || inv.status === 'en_retard' || inv.status === 'partiellement_paye';

                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-white">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4 text-xs text-gray-300">{inv.client ? `${inv.client.firstName} ${inv.client.lastName}` : '—'}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">{new Date(inv.dueDate).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 font-bold text-white font-mono">{fcfa(inv.totalTTC)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${st.color} ${st.bg}`}>{st.label}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => invoicesService.downloadPdf(inv.id, `Facture-${inv.invoiceNumber}.pdf`).catch(() => {})}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="Télécharger PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {isPending && (
                            <button
                              onClick={() => handleMarkAsPaid(inv.id)}
                              disabled={markingId === inv.id}
                              className="px-3 py-1 rounded-lg bg-brand-green/20 hover:bg-brand-green/30 text-brand-green border border-brand-green/30 text-xs font-semibold transition-colors"
                            >
                              {markingId === inv.id ? 'En cours...' : 'Marquer Encaissé'}
                            </button>
                          )}
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

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
          <div className="card-glass border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Nouvelle facture</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">{formError}</div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Client *</label>
                  <select
                    required value={formClient}
                    onChange={(e) => { setFormClient(e.target.value); setFormProject(''); }}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id} className="bg-brand-card">{c.firstName} {c.lastName}{c.company ? ` — ${c.company}` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Projet lié (optionnel)</label>
                  <select
                    value={formProject} onChange={(e) => setFormProject(e.target.value)} disabled={!formClient}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  >
                    <option value="">Aucun projet</option>
                    {clientProjects.map((p) => (
                      <option key={p.id} value={p.id} className="bg-brand-card">{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Détail des prestations</label>
                <div className="space-y-2">
                  {lines.map((line) => (
                    <div key={line.id} className="flex items-center gap-2">
                      <input
                        type="text" value={line.designation} onChange={(e) => updateLine(line.id, 'designation', e.target.value)}
                        placeholder="Prestation, service..."
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-brand-purple"
                      />
                      <input
                        type="number" min={1} value={line.quantity} onChange={(e) => updateLine(line.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white text-center focus:outline-none focus:border-brand-purple"
                      />
                      <input
                        type="number" min={0} step={100} value={line.unitPrice} onChange={(e) => updateLine(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white text-right focus:outline-none focus:border-brand-purple"
                      />
                      {lines.length > 1 && (
                        <button type="button" onClick={() => removeLine(line.id)} className="p-1 text-gray-600 hover:text-red-400">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button" onClick={addLine}
                  className="mt-3 flex items-center gap-2 text-brand-purple text-xs font-medium hover:text-brand-purple-light transition-colors border border-brand-purple/30 rounded-lg px-3 py-1.5 hover:bg-brand-purple/10"
                >
                  <Plus size={12} /> Ajouter une ligne
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Échéance</label>
                  <input
                    type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">TVA (%)</label>
                  <input
                    type="number" min={0} max={100} value={formTvaRate} onChange={(e) => setFormTvaRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-300"><span>Sous-total HT</span><span>{fcfa(subtotal)}</span></div>
                <div className="flex justify-between text-gray-300"><span>TVA ({formTvaRate}%)</span><span>{fcfa(tvaAmount)}</span></div>
                <div className="flex justify-between font-bold text-base pt-1"><span className="text-white">Total TTC</span><span className="text-brand-green">{fcfa(total)}</span></div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Créer la facture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
