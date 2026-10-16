import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Globe, Smartphone, Search, Palette, MessageSquare,
  Star, CheckCircle2, TrendingUp, Users, Award, Zap, ChevronRight,
  ShieldCheck, Clock, BadgeCheck, ArrowUpRight
} from 'lucide-react';
import { testimonialsService, Testimonial } from '../../services/testimonials.service';

const services = [
  {
    icon: Globe,
    title: 'Sites Web',
    desc: 'Applications web modernes, rapides et optimisées SEO pour votre présence en ligne.',
    color: 'text-brand-purple',
    bg: 'bg-brand-purple/10',
    borderHover: 'hover:border-brand-purple/30',
    href: '/services#web',
  },
  {
    icon: Smartphone,
    title: 'Applications Mobile',
    desc: 'Apps iOS & Android natives et cross-platform pour engager vos utilisateurs.',
    color: 'text-brand-green',
    bg: 'bg-brand-green/10',
    borderHover: 'hover:border-brand-green/30',
    href: '/services#apps',
  },
  {
    icon: Search,
    title: 'Audit & Conseil',
    desc: 'Diagnostic complet de votre présence digitale et recommandations stratégiques.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-400/10',
    borderHover: 'hover:border-yellow-400/30',
    href: '/services#audit',
  },
  {
    icon: Palette,
    title: 'Design UI/UX',
    desc: 'Interfaces élégantes et expériences utilisateur mémorables qui convertissent.',
    color: 'text-pink-500',
    bg: 'bg-pink-400/10',
    borderHover: 'hover:border-pink-400/30',
    href: '/services#design',
  },
  {
    icon: MessageSquare,
    title: 'Bot WhatsApp',
    desc: 'Automatisez votre service client avec des bots intelligents sur WhatsApp.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-400/10',
    borderHover: 'hover:border-emerald-400/30',
    href: '/services#bot',
  },
];

const stats = [
  { value: '10+', label: "Années d'expérience", icon: Award },
  { value: '250+', label: 'Projets réalisés', icon: BadgeCheck },
  { value: '120+', label: 'Clients satisfaits', icon: Users },
  { value: '30+', label: 'Technologies maîtrisées', icon: Zap },
];

const testimonials = [
  {
    name: 'Kofi Asante',
    role: 'CEO, TechLokal',
    content: 'Nomeryc a transformé notre vision en une plateforme exceptionnelle. Professionnels, réactifs et créatifs !',
    initials: 'KA',
    rating: 5,
  },
  {
    name: 'Adaora Obi',
    role: 'DG, ShopAfrica',
    content: 'Notre e-commerce a vu ses ventes doubler grâce à leur expertise technique et design irréprochable.',
    initials: 'AO',
    rating: 5,
  },
  {
    name: 'Seydou Diallo',
    role: 'Fondateur, FinPay',
    content: "L'équipe a livré notre app mobile en temps record avec une qualité qui dépasse nos attentes.",
    initials: 'SD',
    rating: 5,
  },
];
// Repli affiché tant que l'API n'a pas répondu (ou si elle est indisponible), pour
// ne jamais laisser la section "Témoignages" vide. Remplacé dès que le back-office
// contient au moins un témoignage.
const defaultTestimonials: Testimonial[] = testimonials.map((t, idx) => ({
  id: `fallback-${idx}`,
  ...t,
  createdAt: '',
  updatedAt: '',
}));

const processSteps = [
  { step: '01', title: 'Cadrage', desc: 'Analyse de vos besoins et définition du périmètre projet', color: 'bg-brand-purple' },
  { step: '02', title: 'Design', desc: 'Conception des maquettes et validation avec vos équipes', color: 'bg-brand-green' },
  { step: '03', title: 'Développement', desc: 'Réalisation technique avec les meilleures technologies', color: 'bg-brand-purple' },
  { step: '04', title: 'Livraison', desc: 'Tests, déploiement et formation de vos équipes', color: 'bg-brand-green' },
];

const whyUs = [
  { icon: ShieldCheck, title: 'Qualité garantie', desc: 'Code propre, tests rigoureux, documentation complète pour chaque projet.' },
  { icon: Clock, title: 'Délais respectés', desc: 'Gestion de projet agile pour une livraison dans les temps, à chaque fois.' },
  { icon: TrendingUp, title: 'ROI mesurable', desc: "Vos investissements digitaux sont conçus pour générer un retour concret." },
];

export function HomePage() {
  const [testimonialItems, setTestimonialItems] = useState<Testimonial[]>(defaultTestimonials);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await testimonialsService.getAll();
        if (data && data.length > 0) {
          setTestimonialItems(data);
        }
      } catch {
        // Le repli statique ci-dessus reste affiché
      }
    }
    loadTestimonials();
  }, []);

  return (
    <main className="bg-light-bg">

      {/* ───── Hero ───── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #EAE8FF 0%, #F8F7FF 40%, #E0F5EE 100%)' }}
        />
        <div className="absolute inset-0 bg-grid-light opacity-60" />

        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-purple/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-green/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-light-border shadow-light mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-light-text-secondary text-sm font-medium">Agence Digitale Basée à Lomé, Togo</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-light-text leading-tight mb-6 animate-slide-up">
              Votre vision,{' '}
              <span className="bg-gradient-brand bg-clip-text text-transparent">
                notre expertise
              </span>
            </h1>

            <p className="text-xl text-light-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
              Nous créons des solutions numériques innovantes — sites web, applications mobile, design UI/UX
              et stratégies digitales — qui propulsent votre entreprise.
            </p>

            <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-white shadow-brand hover:shadow-brand/70 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #5B50C8, #3DB38A)' }}
              >
                Démarrer mon projet
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-light-text bg-white border border-light-border shadow-light hover:border-brand-purple/40 hover:shadow-brand transition-all active:scale-95"
              >
                Voir nos réalisations
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-white/80 backdrop-blur-sm border border-light-border rounded-2xl p-5 text-center shadow-light hover:shadow-brand/15 transition-shadow">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-purple/10 mb-3">
                  <Icon size={18} className="text-brand-purple" />
                </div>
                <p className="text-3xl font-display font-bold text-light-text">{value}</p>
                <p className="text-light-text-muted text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Services ───── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-purple font-semibold text-sm uppercase tracking-widest">Ce que nous faisons</span>
            <h2 className="section-title mt-2">Nos services digitaux</h2>
            <p className="section-subtitle mx-auto">
              Du concept à la mise en production, nous couvrons tous vos besoins numériques.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, desc, color, bg, borderHover, href }) => (
              <Link
                key={title}
                to={href}
                className={`card-light-hover group flex flex-col gap-4 ${borderHover}`}
              >
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-light-text text-lg group-hover:text-brand-purple transition-colors">{title}</h3>
                  <p className="text-light-text-muted text-sm mt-1.5 leading-relaxed">{desc}</p>
                </div>
                <div className={`flex items-center gap-1.5 text-sm font-semibold mt-auto ${color}`}>
                  En savoir plus
                  <ArrowUpRight size={14} />
                </div>
              </Link>
            ))}
            {/* CTA card */}
            <div
              className="card-light flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 border-light-border hover:border-brand-purple/40 transition-all cursor-pointer"
            >
              <Zap size={28} className="text-brand-purple/40" />
              <div>
                <p className="font-semibold text-light-text-secondary">Besoin d'autre chose ?</p>
                <p className="text-light-text-muted text-sm mt-1">Contactez-nous pour un devis personnalisé</p>
              </div>
              <Link to="/contact" className="btn-primary btn-sm">Discutons-en</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Process ───── */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #EAE8FF 0%, #F8F7FF 60%, #E0F5EE 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-green font-semibold text-sm uppercase tracking-widest">Notre méthode</span>
            <h2 className="section-title mt-2">Comment nous travaillons</h2>
            <p className="section-subtitle mx-auto">Un processus éprouvé pour des résultats exceptionnels.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map(({ step, title, desc, color }, i) => (
              <div key={step} className="relative">
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px border-t-2 border-dashed border-brand-purple/20 z-0" />
                )}
                <div className="bg-white rounded-2xl p-6 border border-light-border shadow-light relative z-10">
                  <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white font-bold text-lg mb-4`}>
                    {step}
                  </div>
                  <h3 className="font-display font-bold text-light-text">{title}</h3>
                  <p className="text-light-text-muted text-sm mt-2 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Why Us ───── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-purple font-semibold text-sm uppercase tracking-widest">Pourquoi nous choisir</span>
              <h2 className="section-title mt-2">Ce qui nous distingue</h2>
              <p className="text-light-text-secondary text-base mt-4 mb-8 leading-relaxed">
                Nomeryc est plus qu'une agence. Nous sommes votre partenaire technologique de long terme,
                engagé dans le succès de votre transformation digitale.
              </p>
              <div className="space-y-5">
                {whyUs.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-brand-purple/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-purple transition-colors">
                      <Icon size={19} className="text-brand-purple group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-light-text">{title}</h4>
                      <p className="text-light-text-muted text-sm mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/a-propos" className="btn-primary mt-8 inline-flex">
                En savoir plus sur nous
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto">
                <div
                  className="w-full h-full rounded-3xl flex items-center justify-center relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #EAE8FF, #E0F5EE)' }}
                >
                  <div className="absolute inset-0 bg-grid-light" />
                  <img src="/logo slogan.svg" alt="Nomeryc" className="relative z-10 w-2/3 h-auto drop-shadow-xl" />
                  {/* Floating stats */}
                  {[
                    { label: 'Uptime garanti', value: '99.9%', color: 'bg-brand-green', top: '15%', right: '-5%' },
                    { label: 'Délai moyen', value: '4 sem.', color: 'bg-brand-purple', bottom: '20%', left: '-5%' },
                  ].map(({ label, value, color, ...pos }) => (
                    <div
                      key={label}
                      style={{ ...pos, position: 'absolute' }}
                      className="bg-white border border-light-border rounded-2xl px-4 py-3 shadow-light text-center"
                    >
                      <p className="text-light-text text-lg font-bold">{value}</p>
                      <p className="text-light-text-muted text-xs">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #1A1B3A 0%, #0D0C22 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-green font-semibold text-sm uppercase tracking-widest">Témoignages</span>
            <h2 className="section-title-white mt-2">Ce que disent nos clients</h2>
            <p className="text-gray-400 text-lg mt-3 max-w-xl mx-auto">Des entreprises qui nous font confiance pour leur transformation digitale.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialItems.map(({ id, name, role, content, initials, rating }) => (
              <div key={id} className="card-glass rounded-2xl p-6 hover:border-brand-purple/30 transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating || 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm">
                    {initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{name}</p>
                    <p className="text-gray-500 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA Bottom ───── */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-light-text mb-6">
            Prêt à transformer votre <br />
            <span className="bg-gradient-brand bg-clip-text text-transparent">présence digitale ?</span>
          </h2>
          <p className="text-light-text-secondary text-lg mb-10">
            Discutons de votre projet et construisons quelque chose d'exceptionnel ensemble.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white text-lg transition-all hover:shadow-brand active:scale-95"
              style={{ background: 'linear-gradient(135deg, #5B50C8, #3DB38A)' }}
            >
              Démarrer un projet
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/tarifs"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-light-text border-2 border-light-border hover:border-brand-purple/40 transition-all active:scale-95"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
