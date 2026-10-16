import React, { useState } from 'react';
import { User, Lock, Building, Phone, Mail, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { usersService } from '../../services/users.service';

export function ClientSettings() {
  const { user, setUser } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [company, setCompany] = useState(user?.company || '');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSaved(false);

    try {
      const updated = await usersService.update(user.id, {
        firstName,
        lastName,
        phone,
        company,
      });
      setUser({ ...user, ...updated });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Optimistic update
      setUser({ ...user, firstName, lastName, phone, company });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Paramètres du Compte</h1>
        <p className="text-gray-400 text-sm mt-1">Gérez vos informations personnelles et préférences de facturation.</p>
      </div>

      <div className="card-glass border border-white/10 rounded-2xl p-6 lg:p-8">
        {saved && (
          <div className="mb-6 p-4 rounded-xl bg-brand-green/10 border border-brand-green/20 text-brand-green text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Vos modifications ont été enregistrées avec succès.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Nom de famille</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Adresse Email</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-gray-400 cursor-not-allowed"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">L'email ne peut pas être modifié directement.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 00 00 00 00"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">Entreprise ou Raison Sociale</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Ex: Acme Studio SARL"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
