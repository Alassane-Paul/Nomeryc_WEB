import React, { useEffect, useState, useCallback } from 'react';
import { Mail, Phone, Building, Search, Trash2, Loader2, Inbox } from 'lucide-react';
import { contactsService, ContactSubmission, ContactStatus } from '../../services/contacts.service';

const statusMap: Record<ContactStatus, { label: string; className: string }> = {
  nouveau: { label: 'Nouveau', className: 'bg-brand-purple/10 text-brand-purple-light border-brand-purple/20' },
  contacte: { label: 'Contacté', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  converti: { label: 'Converti', className: 'bg-brand-green/10 text-brand-green border-brand-green/20' },
  rejete: { label: 'Rejeté', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

function fcfa(n?: number) {
  if (!n) return null;
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(n))} FCFA`;
}

export function AdminContacts() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contactsService.getAll();
      setContacts(data || []);
    } catch {
      // Liste vide affichée ; l'admin peut réessayer.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id: string, status: ContactStatus) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    try {
      await contactsService.updateStatus(id, status);
    } catch {
      load(); // resynchronise en cas d'échec
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette demande de contact ?')) return;
    const previous = contacts;
    setContacts((prev) => prev.filter((c) => c.id !== id));
    try {
      await contactsService.remove(id);
    } catch {
      setContacts(previous);
    }
  };

  const filtered = contacts.filter((c) => {
    const matchSearch = `${c.name} ${c.email} ${c.company || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const newCount = contacts.filter((c) => c.status === 'nouveau' || !c.status).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Demandes de Contact</h1>
        <p className="text-gray-400 text-sm mt-1">
          {newCount > 0 ? `${newCount} nouvelle${newCount > 1 ? 's' : ''} demande${newCount > 1 ? 's' : ''} à traiter.` : 'Toutes les demandes ont été traitées.'}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-brand-card/60 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, entreprise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'ALL', label: 'Toutes' },
            { key: 'nouveau', label: 'Nouvelles' },
            { key: 'contacte', label: 'Contactées' },
            { key: 'converti', label: 'Converties' },
            { key: 'rejete', label: 'Rejetées' },
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

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-gray-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card-glass p-12 text-center rounded-2xl border border-white/10">
          <Inbox className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">Aucune demande de contact pour l'instant.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((contact) => {
            const st = statusMap[contact.status || 'nouveau'];
            const budget = fcfa(contact.budgetMin);
            return (
              <div key={contact.id} className="card-glass border border-white/10 rounded-2xl p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="font-bold text-white">{contact.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${st.className}`}>{st.label}</span>
                      {contact.service && (
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[11px] text-gray-400 uppercase">{contact.service}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5" /> {contact.email}
                      </a>
                      {contact.phone && (
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {contact.phone}</span>
                      )}
                      {contact.company && (
                        <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> {contact.company}</span>
                      )}
                      {budget && <span className="text-brand-green font-semibold">{budget}</span>}
                      {contact.createdAt && (
                        <span>{new Date(contact.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{contact.message}</p>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
                    <select
                      value={contact.status || 'nouveau'}
                      onChange={(e) => contact.id && handleStatusChange(contact.id, e.target.value as ContactStatus)}
                      className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-brand-purple cursor-pointer"
                    >
                      {Object.entries(statusMap).map(([key, { label }]) => (
                        <option key={key} value={key} className="bg-brand-card">{label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => contact.id && handleDelete(contact.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
