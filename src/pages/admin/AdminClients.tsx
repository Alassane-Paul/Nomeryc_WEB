import React, { useEffect, useState, useCallback } from 'react';
import { Search, X, Loader2, FolderOpen, FileText, Receipt, Mail, Phone, Building } from 'lucide-react';
import { usersService } from '../../services/users.service';
import { User } from '../../services/auth.service';
import { projectsService, Project } from '../../services/projects.service';
import { quotesService, Quote } from '../../services/quotes.service';
import { invoicesService, Invoice } from '../../services/invoices.service';

function fcfa(n: number) {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(n || 0))} FCFA`;
}

export function AdminClients() {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<User | null>(null);

  const [detailLoading, setDetailLoading] = useState(false);
  const [clientProjects, setClientProjects] = useState<Project[]>([]);
  const [clientQuotes, setClientQuotes] = useState<Quote[]>([]);
  const [clientInvoices, setClientInvoices] = useState<Invoice[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usersService.getAll({ role: 'client' });
      setClients(data || []);
    } catch {
      // Liste vide affichée ; l'admin peut réessayer.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openDetails = async (client: User) => {
    setSelectedClient(client);
    setDetailLoading(true);
    try {
      const [projects, quotes, invoices] = await Promise.all([
        projectsService.getAll(),
        quotesService.getAll(),
        invoicesService.getAll(),
      ]);
      setClientProjects(projects.filter((p) => p.clientId === client.id));
      setClientQuotes(quotes.filter((q) => q.clientId === client.id));
      setClientInvoices(invoices.filter((i) => i.clientId === client.id));
    } catch {
      setClientProjects([]);
      setClientQuotes([]);
      setClientInvoices([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = clients.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.company}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalBilled = clientInvoices.reduce((sum, i) => sum + i.totalTTC, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion des Clients</h1>
          <p className="text-gray-400 text-sm mt-1">Consultez la liste des comptes clients actifs et leurs informations.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-brand-card/60 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, entreprise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
          />
        </div>
      </div>

      <div className="card-glass border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-brand-card/80 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Entreprise</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center"><Loader2 className="w-5 h-5 text-gray-500 animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">Aucun client pour l'instant.</td></tr>
              ) : (
                filtered.map((client) => (
                  <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-purple/20 text-brand-purple-light font-bold flex items-center justify-center text-xs border border-brand-purple/30">
                          {client.firstName[0]}{client.lastName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{client.firstName} {client.lastName}</div>
                          <div className="text-xs text-gray-400">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{client.company || 'Particulier'}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">{client.phone || 'Non renseigné'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green border border-brand-green/20">
                        {client.status || 'Actif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openDetails(client)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelectedClient(null)}>
          <div className="card-glass border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-purple/20 text-brand-purple-light font-bold flex items-center justify-center text-base border border-brand-purple/30">
                  {selectedClient.firstName[0]}{selectedClient.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedClient.firstName} {selectedClient.lastName}</h3>
                  <p className="text-xs text-gray-400">{selectedClient.company || 'Particulier'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-300"><Mail className="w-3.5 h-3.5 text-gray-500" /> {selectedClient.email}</div>
              <div className="flex items-center gap-2 text-gray-300"><Phone className="w-3.5 h-3.5 text-gray-500" /> {selectedClient.phone || 'Non renseigné'}</div>
              <div className="flex items-center gap-2 text-gray-300 sm:col-span-2"><Building className="w-3.5 h-3.5 text-gray-500" /> {selectedClient.company || 'Particulier'}</div>
            </div>

            {detailLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xl font-bold text-white">{clientProjects.length}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Projets</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xl font-bold text-white">{clientQuotes.length}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Devis</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xl font-bold text-brand-green">{fcfa(totalBilled)}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Total facturé</p>
                  </div>
                </div>

                {clientProjects.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5" /> Projets</h4>
                    <div className="space-y-1.5">
                      {clientProjects.map((p) => (
                        <div key={p.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 text-xs">
                          <span className="text-gray-300">{p.title}</span>
                          <span className="text-gray-500">{p.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {clientQuotes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Devis</h4>
                    <div className="space-y-1.5">
                      {clientQuotes.map((q) => (
                        <div key={q.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 text-xs">
                          <span className="text-gray-300">{q.quoteNumber}</span>
                          <span className="text-gray-500">{fcfa(q.totalTTC)} — {q.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {clientInvoices.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5" /> Factures</h4>
                    <div className="space-y-1.5">
                      {clientInvoices.map((i) => (
                        <div key={i.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 text-xs">
                          <span className="text-gray-300">{i.invoiceNumber}</span>
                          <span className="text-gray-500">{fcfa(i.totalTTC)} — {i.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {clientProjects.length === 0 && clientQuotes.length === 0 && clientInvoices.length === 0 && (
                  <p className="text-center text-sm text-gray-500 py-4">Aucune activité enregistrée pour ce client.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
