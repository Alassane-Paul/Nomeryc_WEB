import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, Loader2, Tag } from 'lucide-react';
import { contactsService } from '../../services/contacts.service';
import { WhatsAppIcon, SOCIAL_LINKS } from '../../components/icons/BrandIcons';

const SERVICES = [
  { value: 'web', label: 'Développement Web' },
  { value: 'apps', label: 'Application Mobile' },
  { value: 'audit', label: 'Audit & Conseil SEO' },
  { value: 'design', label: 'Design UI/UX' },
  { value: 'bot', label: 'Bot WhatsApp / IA' },
  { value: 'other', label: 'Autre service' },
];

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

const BUDGET_MIN = 5_000;
const BUDGET_MAX = 10_000_000;

function formatXOF(val: number): string {
  if (val >= BUDGET_MAX) return '10 000 000+ XOF';
  return `${val.toLocaleString('fr-FR')} XOF`;
}

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || 'web';
  const preselectedPlan = searchParams.get('plan');
  const planLabel = preselectedPlan ? PLAN_LABELS[preselectedPlan] : null;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: preselectedService,
    message: '',
  });
  const [budget, setBudget] = useState(2_000_000);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const service = SERVICES.some(s => s.value === form.service) && form.service !== 'other' ? form.service : undefined;
      const message = planLabel ? `[Offre "${planLabel}" sélectionnée sur la page tarifs]\n\n${form.message}` : form.message;
      await contactsService.submit({ ...form, service, message, budgetMin: budget });
      setSubmitted(true);
    } catch {
      setError("L'envoi a échoué. Vérifiez votre connexion et réessayez, ou contactez-nous directement par email.");
    } finally {
      setLoading(false);
    }
  };

  const budgetPercent = ((budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  return (
    <div className="bg-light-bg min-h-screen">

      {/* Hero */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5B50C8 0%, #3DB38A 100%)' }}
      >
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Contactez-nous
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Nous sommes là pour répondre à vos questions et vous accompagner dans vos projets numériques.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="card-light flex flex-col items-center justify-center text-center py-16 gap-6">
                  <div className="w-16 h-16 rounded-full bg-brand-green/15 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-brand-green" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-light-text">Message envoyé !</h3>
                    <p className="text-light-text-muted mt-2">Nous vous répondrons dans les 24 heures ouvrables.</p>
                  </div>
                </div>
              ) : (
                <div className="card-light">
                  <h2 className="text-xl font-display font-bold text-light-text mb-2">Envoyez-nous un message</h2>
                  <p className="text-light-text-muted text-sm mb-6">Remplissez le formulaire ci-dessous, nous vous répondrons dans les plus brefs délais.</p>

                  {error && (
                    <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
                  )}

                  {planLabel && (
                    <div className="mb-5 p-4 bg-brand-purple/5 border border-brand-purple/20 rounded-xl flex items-center gap-2.5 text-sm text-brand-purple">
                      <Tag size={16} />
                      Offre présélectionnée : <strong>{planLabel}</strong>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="input-group">
                        <label className="input-label">Nom *</label>
                        <input required type="text" placeholder="Votre nom complet" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Email *</label>
                        <input required type="email" placeholder="votre.email@exemple.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="input-group">
                        <label className="input-label">Téléphone *</label>
                        <div className="flex">
                          <span className="inline-flex items-center gap-1.5 px-3 border border-r-0 border-light-border rounded-l-xl text-sm text-light-text-muted bg-light-bg-secondary">
                            🇹🇬 +228
                          </span>
                          <input type="tel" placeholder="91 78 29 47" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input rounded-l-none border-l-0 flex-1" />
                        </div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Entreprise</label>
                        <input type="text" placeholder="Nom de votre entreprise" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="input" />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Service souhaité *</label>
                      <select required value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} className="input">
                        {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>

                    {/* Budget slider */}
                    <div className="input-group">
                      <label className="input-label">Budget estimé</label>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-light-text-muted">5 000 XOF</span>
                        <span className="font-semibold text-brand-purple">{formatXOF(budget)}</span>
                        <span className="text-light-text-muted">10 000 000+ XOF</span>
                      </div>
                      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: '#E2E0F5' }}>
                        <div
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{ width: `${budgetPercent}%`, background: 'linear-gradient(90deg, #5B50C8, #3DB38A)' }}
                        />
                      </div>
                      <input
                        type="range"
                        min={BUDGET_MIN}
                        max={BUDGET_MAX}
                        step={5_000}
                        value={budget}
                        onChange={e => setBudget(parseInt(e.target.value))}
                        className="w-full mt-2 accent-brand-purple cursor-pointer"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Message *</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Décrivez votre projet ou votre besoin..."
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="input resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #5B50C8, #3DB38A)' }}
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-5">
              <div className="card-light">
                <h3 className="font-display font-bold text-light-text mb-4">Informations de contact</h3>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, title: 'Adresse', body: 'Lomé, Togo\nQuartier Adidogomé, Rue 123', color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
                    { icon: Phone, title: 'Téléphone', body: '+228 91 78 29 47', color: 'text-brand-green', bg: 'bg-brand-green/10', href: 'tel:+22891782947' },
                    { icon: Mail, title: 'Email', body: 'contact@nomeryc.com', color: 'text-brand-purple', bg: 'bg-brand-purple/10', href: 'mailto:contact@nomeryc.com' },
                    { icon: Clock, title: "Horaires d'ouverture", body: 'Lundi – Vendredi : 08h00 – 18h00\nSamedi : 09h00 – 13h00', color: 'text-yellow-500', bg: 'bg-yellow-400/10' },
                  ].map(({ icon: Icon, title, body, color, bg, href }) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={16} className={color} />
                      </div>
                      <div>
                        <p className="font-semibold text-light-text text-sm">{title}</p>
                        {href ? (
                          <a href={href} className={`text-sm ${color} hover:underline`}>{body}</a>
                        ) : (
                          <p className="text-light-text-muted text-sm whitespace-pre-line">{body}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-light">
                <h3 className="font-display font-bold text-light-text mb-3">Suivez-nous</h3>
                <div className="flex gap-2">
                  {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={name}
                      className="w-9 h-9 rounded-xl bg-light-bg-secondary border border-light-border flex items-center justify-center text-light-text-muted hover:text-brand-purple hover:border-brand-purple/30 transition-all"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              <a
                href="https://wa.me/22891782947"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl border-2 border-brand-green text-brand-green font-semibold text-sm hover:bg-brand-green hover:text-white transition-all"
              >
                <WhatsAppIcon size={18} />
                Discutons sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
