import React, { useEffect, useState, useCallback } from 'react';
import { FileText, CheckCircle, Loader2, Download } from 'lucide-react';
import { quotesService, Quote } from '../../services/quotes.service';

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  brouillon: { label: 'Brouillon', color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' },
  envoye: { label: 'En attente de validation', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  accepte: { label: 'Devis accepté', color: 'text-brand-green', bg: 'bg-brand-green/10 border-brand-green/20' },
  refuse: { label: 'Refusé', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
  expire: { label: 'Expiré', color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' },
};

function fcfa(n: number) {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(n || 0))} FCFA`;
}

export function ClientQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setQuotes(await quotesService.getAll());
    } catch {
      // silencieux : liste vide affichée
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAction = async (id: string, newStatus: 'accepte' | 'refuse') => {
    setActionLoading(id);
    try {
      await quotesService.updateStatus(id, newStatus);
      setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q)));
    } catch {
      // on ne modifie rien en cas d'échec réel
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Mes Devis</h1>
        <p className="text-gray-400 text-sm mt-1">Consultez et validez vos propositions commerciales en ligne.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-gray-500 animate-spin" /></div>
      ) : quotes.length === 0 ? (
        <div className="card-glass p-12 text-center rounded-2xl border border-white/10">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Aucun devis disponible</h3>
          <p className="text-sm text-gray-400 mt-1">Vous n'avez aucun devis en cours d'examen pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {quotes.map((quote) => {
            const st = statusMap[quote.status] || { label: quote.status, color: 'text-gray-300', bg: 'bg-white/10' };
            const isPending = quote.status === 'envoye';

            return (
              <div key={quote.id} className="card-glass border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-gray-400">{quote.quoteNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${st.color} ${st.bg}`}>
                        {st.label}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{quote.title || quote.project?.title || quote.quoteNumber}</h2>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Montant Total TTC</span>
                    <span className="text-2xl lg:text-3xl font-extrabold text-brand-green">{fcfa(quote.totalTTC)}</span>
                  </div>
                </div>

                {quote.items && quote.items.length > 0 && (
                  <div className="bg-brand-card/60 rounded-xl border border-white/5 p-4 space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Détail des prestations :</h3>
                    {quote.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                        <span className="text-gray-300">{item.designation} (x{item.quantity})</span>
                        <span className="font-mono text-white font-medium">{fcfa(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs">
                  <span className="text-gray-400">
                    {quote.validUntil ? (
                      <>Valable jusqu'au : <strong className="text-white">{new Date(quote.validUntil).toLocaleDateString('fr-FR')}</strong></>
                    ) : (
                      <>Émis le : <strong className="text-white">{new Date(quote.createdAt).toLocaleDateString('fr-FR')}</strong></>
                    )}
                  </span>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => quotesService.downloadPdf(quote.id, `Devis-${quote.quoteNumber}.pdf`).catch(() => {})}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-brand-purple/40 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>

                    {isPending && (
                      <>
                        <button
                          onClick={() => handleAction(quote.id, 'refuse')}
                          disabled={actionLoading === quote.id}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 font-semibold transition-all"
                        >
                          Décliner
                        </button>
                        <button
                          onClick={() => handleAction(quote.id, 'accepte')}
                          disabled={actionLoading === quote.id}
                          className="flex-1 sm:flex-none btn-primary px-6 py-2 rounded-xl font-semibold shadow-lg shadow-brand-purple/20 flex items-center justify-center gap-2"
                        >
                          {actionLoading === quote.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Accepter le devis
                        </button>
                      </>
                    )}
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
