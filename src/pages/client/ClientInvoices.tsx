import React, { useEffect, useState, useCallback } from 'react';
import { Receipt, Download, CreditCard, Smartphone, Loader2, X, ArrowRight } from 'lucide-react';
import { invoicesService, Invoice } from '../../services/invoices.service';

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  brouillon: { label: 'Brouillon', color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' },
  envoye: { label: 'En attente de paiement', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  paye: { label: 'Payée', color: 'text-brand-green', bg: 'bg-brand-green/10 border-brand-green/20' },
  partiellement_paye: { label: 'Partiellement payée', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  en_retard: { label: 'En retard', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
  annule: { label: 'Annulée', color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' },
};

function fcfa(n: number) {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(n || 0))} FCFA`;
}

export function ClientInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState<Invoice | null>(null);
  const [phone, setPhone] = useState('');
  const [payingVia, setPayingVia] = useState<'stripe' | 'fedapay' | null>(null);
  const [payError, setPayError] = useState('');

  const load = useCallback(async () => {
    try {
      setInvoices(await invoicesService.getAll());
    } catch {
      // silencieux : liste vide affichée
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDownload = (id: string, invoiceNumber: string) => {
    invoicesService.downloadPdf(id, `Facture-${invoiceNumber}.pdf`).catch(() => {});
  };

  const payByCard = async () => {
    if (!payModal) return;
    setPayError('');
    setPayingVia('stripe');
    try {
      const url = await invoicesService.payWithStripe(payModal.id);
      window.location.href = url;
    } catch (err: any) {
      setPayError(err?.response?.data?.responseMessage || "Le paiement par carte n'est pas disponible pour le moment.");
      setPayingVia(null);
    }
  };

  const payByMobileMoney = async () => {
    if (!payModal) return;
    setPayError('');
    setPayingVia('fedapay');
    try {
      const url = await invoicesService.payWithFedapay(payModal.id, phone || undefined);
      window.location.href = url;
    } catch (err: any) {
      setPayError(err?.response?.data?.responseMessage || "Le paiement Mobile Money n'est pas disponible pour le moment.");
      setPayingVia(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Mes Factures</h1>
        <p className="text-gray-400 text-sm mt-1">Historique de facturation et règlement sécurisé en ligne.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-gray-500 animate-spin" /></div>
      ) : invoices.length === 0 ? (
        <div className="card-glass p-12 text-center rounded-2xl border border-white/10">
          <Receipt className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Aucune facture émise</h3>
          <p className="text-sm text-gray-400 mt-1">Vous n'avez aucune facture enregistrée pour le moment.</p>
        </div>
      ) : (
        <div className="card-glass border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-brand-card/80 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Numéro</th>
                  <th className="px-6 py-4">Date d'émission</th>
                  <th className="px-6 py-4">Échéance</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Montant TTC</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => {
                  const st = statusMap[inv.status] || { label: inv.status, color: 'text-gray-300', bg: 'bg-white/10' };
                  const isPending = inv.status === 'envoye' || inv.status === 'en_retard' || inv.status === 'partiellement_paye';

                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-white">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">{new Date(inv.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">{new Date(inv.dueDate).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${st.color} ${st.bg}`}>{st.label}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-white">{fcfa(inv.totalTTC)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownload(inv.id, inv.invoiceNumber)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                            title="Télécharger le PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {isPending && (
                            <button
                              onClick={() => { setPayModal(inv); setPayError(''); setPhone(''); }}
                              className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Payer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => !payingVia && setPayModal(null)}>
          <div className="card-glass border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Régler la facture</h3>
              {!payingVia && (
                <button onClick={() => setPayModal(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="text-center py-2">
              <p className="text-xs text-gray-400">{payModal.invoiceNumber}</p>
              <p className="text-3xl font-extrabold text-brand-green mt-1">{fcfa(payModal.totalTTC)}</p>
            </div>

            {payError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">{payError}</div>
            )}

            <div className="space-y-3">
              <button
                onClick={payByCard}
                disabled={!!payingVia}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-brand-purple/50 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <span className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-brand-purple-light" />
                  <span className="text-left">
                    <span className="block text-sm font-semibold text-white">Carte bancaire</span>
                    <span className="block text-xs text-gray-400">Visa, Mastercard via Stripe</span>
                  </span>
                </span>
                {payingVia === 'stripe' ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <ArrowRight className="w-4 h-4 text-gray-500" />}
              </button>

              <div className="space-y-2">
                <button
                  onClick={payByMobileMoney}
                  disabled={!!payingVia}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-brand-green/50 hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  <span className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-brand-green" />
                    <span className="text-left">
                      <span className="block text-sm font-semibold text-white">Mobile Money</span>
                      <span className="block text-xs text-gray-400">T-Money, Flooz via FedaPay</span>
                    </span>
                  </span>
                  {payingVia === 'fedapay' ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <ArrowRight className="w-4 h-4 text-gray-500" />}
                </button>
                <input
                  type="tel"
                  placeholder="Numéro Mobile Money (optionnel)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!!payingVia}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>

            <p className="text-[11px] text-gray-500 text-center">Vous serez redirigé vers une page de paiement sécurisée.</p>
          </div>
        </div>
      )}
    </div>
  );
}
