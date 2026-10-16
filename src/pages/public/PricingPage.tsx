import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, HelpCircle, ArrowRight, Zap, Shield, Sparkles, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { pricingService, PricingPlan } from '../../services/pricing.service';
import { faqsService, Faq } from '../../services/faqs.service';

const plans = [
  {
    name: 'Pack Vitrine Starter',
    badge: 'Idéal Lancement',
    price: '650 000',
    currency: 'FCFA',
    period: 'paiement unique',
    description: 'Une présence en ligne percutante et optimisée pour lancer votre activité avec élégance.',
    features: [
      'Site web moderne (jusqu\'à 5 pages)',
      'Design responsive mobile, tablette & desktop',
      'Formulaire de contact & intégration WhatsApp',
      'Optimisation SEO de base & Google My Business',
      'Hébergement & certificat SSL sécurisé 1 an',
      'Livraison rapide en 10 jours ouvrés',
    ],
    highlighted: false,
    ctaText: 'Choisir l\'offre Starter',
    ctaLink: '/contact?plan=starter',
  },
  {
    name: 'Pack Business Pro',
    badge: 'Le Plus Populaire',
    price: '1 650 000',
    currency: 'FCFA',
    period: 'paiement unique',
    description: 'Pour les entreprises établies souhaitant convertir plus de prospects et automatiser leurs processus.',
    features: [
      'Architecture sur-mesure React / TypeScript',
      'Pages illimitées et blog administrable',
      'Espace client sécurisé ou fonctionnalités SaaS',
      'Intégration CRM, Stripe ou Mobile Money',
      'Optimisation SEO sémantique avancée',
      'Formation complète de votre équipe',
      'Support & maintenance offerts 3 mois',
    ],
    highlighted: true,
    ctaText: 'Démarrer avec le pack Pro',
    ctaLink: '/contact?plan=pro',
  },
  {
    name: 'Pack Sur-Mesure Enterprise',
    badge: 'Grands Comptes',
    price: 'Sur devis',
    currency: '',
    period: 'selon cahier des charges',
    description: 'Applications web complexes, plateformes logicielles multi-rôles et écosystèmes mobiles dédiés.',
    features: [
      'Applications mobiles iOS & Android cross-platform',
      'Systèmes distribués haute charge & APIs complexes',
      'Design System complet sous Figma',
      'Audit de sécurité & conformité RGPD',
      'DevOps, CI/CD et infrastructure cloud dédiée',
      'Chef de projet dédié & SLA garanti < 2h',
    ],
    highlighted: false,
    ctaText: 'Demander un devis sur-mesure',
    ctaLink: '/contact?plan=enterprise',
  },
];
// Repli affiché tant que l'API n'a pas répondu (ou si elle est indisponible), pour
// ne jamais laisser la section vide. Remplacé dès que le back-office contient au
// moins une offre.
const defaultPlans: PricingPlan[] = plans.map((p, idx) => ({
  id: `fallback-${idx}`,
  ...p,
  createdAt: '',
  updatedAt: '',
}));

const faqs = [
  {
    q: 'Comment se déroule le paiement de mon projet ?',
    a: 'Nos projets fonctionnent généralement avec un acompte de 40% au lancement, 30% après validation des maquettes UI/UX, et le solde de 30% à la livraison et mise en ligne.',
  },
  {
    q: 'Puis-je modifier moi-même le contenu de mon site plus tard ?',
    a: 'Absolument ! Tous nos sites sont livrés avec un panneau d\'administration ergonomique vous permettant de gérer vos textes, articles de blog, images et projets en toute autonomie.',
  },
  {
    q: 'Suis-je propriétaire de mon code source et de mon nom de domaine ?',
    a: 'Oui, à 100%. Dès le règlement final de la prestation, vous êtes l\'unique propriétaire de l\'intégralité des créations, codes sources, licences et visuels conçus pour vous.',
  },
  {
    q: 'Proposez-vous un contrat de maintenance après le lancement ?',
    a: 'Oui, nous proposons des formules de maintenance mensuelle (sauvegardes, veille de sécurité, mises à jour, petites modifications) adaptées à chaque volume de trafic.',
  },
];
// Même logique de repli que pour les offres, pour la FAQ.
const defaultFaqs: Faq[] = faqs.map((f, idx) => ({
  id: `fallback-${idx}`,
  question: f.q,
  answer: f.a,
  createdAt: '',
  updatedAt: '',
}));

export function PricingPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(defaultPlans);
  const [faqItems, setFaqItems] = useState<Faq[]>(defaultFaqs);

  useEffect(() => {
    async function loadData() {
      try {
        const [plansData, faqsData] = await Promise.all([pricingService.getAll(), faqsService.getAll()]);
        if (plansData && plansData.length > 0) setPricingPlans(plansData);
        if (faqsData && faqsData.length > 0) setFaqItems(faqsData);
      } catch {
        // Les données statiques ci-dessus restent affichées
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-light-bg min-h-screen text-light-text">
      {/* Header */}
      <section className="relative py-20 lg:py-28 overflow-hidden text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #EAE8FF 0%, #F8F7FF 40%, #E0F5EE 100%)' }}
        />
        <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-purple/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Tarifs Transparents & Sans Surprise
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-light-text tracking-tight leading-tight">
            Des investissements clairs pour des <span className="bg-gradient-to-r from-brand-purple to-brand-green bg-clip-text text-transparent">résultats mesurables</span>.
          </h1>
          <p className="mt-6 text-lg text-light-text-secondary max-w-2xl mx-auto">
            Choisissez la formule adaptée à votre ambition ou demandez une cotation sur-mesure pour votre projet spécifique.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, idx) => (
            <div
              key={plan.id ?? idx}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.highlighted
                  ? 'bg-white border-2 border-brand-purple shadow-xl shadow-brand-purple/15 lg:-translate-y-4 z-10'
                  : 'bg-white border border-light-border shadow-sm hover:shadow-card hover:border-brand-purple/30'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-purple text-white text-xs font-bold tracking-wide uppercase shadow-md flex items-center gap-1.5">
                  <Star className="w-3 h-3 fill-current text-brand-green" />
                  {plan.badge}
                </div>
              )}

              <div>
                {!plan.highlighted && (
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-light-bg-secondary text-brand-purple mb-4 border border-light-border">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-2xl font-bold text-light-text mb-2">{plan.name}</h3>
                <p className="text-xs text-light-text-secondary mb-6 leading-relaxed">{plan.description}</p>

                <div className="py-4 border-y border-light-border mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl lg:text-5xl font-black text-light-text tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xl font-bold text-brand-green">{plan.currency}</span>
                    <span className="text-xs text-light-text-muted ml-2 font-medium">/ {plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-light-text-muted">Inclus dans l'offre :</h4>
                  {(plan.features || []).map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-brand-green/15 text-brand-green flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="text-xs text-light-text font-medium leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to={plan.ctaLink || '/contact'}
                className={`w-full py-3.5 rounded-xl font-bold text-center text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? 'btn-primary shadow-md shadow-brand-purple/20'
                    : 'btn-secondary'
                }`}
              >
                {plan.ctaText} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white border-t border-light-border pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-brand-purple uppercase tracking-widest block mb-2">Aide & Réponses</span>
            <h2 className="text-3xl font-bold text-light-text mb-3">Questions Fréquentes</h2>
            <p className="text-light-text-secondary text-sm">Tout ce que vous devez savoir avant de démarrer votre collaboration avec Nomeryc.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-light-border bg-light-bg overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-bold text-light-text hover:text-brand-purple transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="flex-shrink-0 ml-4 text-brand-purple transition-transform duration-200">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-xs text-light-text-secondary leading-relaxed border-t border-light-border pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
