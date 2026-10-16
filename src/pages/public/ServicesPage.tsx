import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Globe, Smartphone, Search, Palette, Shield, Cpu,
  CheckCircle2, ArrowRight, Sparkles, Layers, Terminal, Zap
} from 'lucide-react';

const serviceCategories = [
  {
    id: 'web',
    title: 'Développement Web & Applications',
    icon: Globe,
    badge: 'Cœur de métier',
    description: 'Conception de plateformes digitales performantes, évolutives et sécurisées adaptées à vos objectifs métier.',
    features: [
      'Sites vitrines modernes et interactifs',
      'Applications web SaaS et dashboards sur-mesure',
      'Plateformes E-commerce haute conversion',
      'Architectures API REST & GraphQL résilientes',
      'Optimisation des Core Web Vitals (< 1s de chargement)',
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS', 'PostgreSQL'],
    deliverable: 'Code propre, documentation complète, hébergement cloud sécurisé.',
  },
  {
    id: 'apps',
    title: 'Développement Mobile iOS & Android',
    icon: Smartphone,
    badge: 'Multiplateforme',
    description: 'Applications mobiles fluides, intuitives et natives pour connecter vos utilisateurs partout et tout le temps.',
    features: [
      'Applications cross-platform performantes (React Native / Flutter)',
      'Expérience utilisateur offline-first avec synchronisation',
      'Intégration paiements mobiles (Apple Pay, Google Pay, Mobile Money)',
      'Notifications push ciblées & géolocalisation',
      'Publication et maintenance sur App Store & Google Play',
    ],
    techStack: ['React Native', 'Flutter', 'iOS Swift', 'Kotlin', 'Firebase'],
    deliverable: 'Binaires de production prêts pour les stores et panneau d’administration.',
  },
  {
    id: 'design',
    title: 'Design UI/UX & Identité Visuelle',
    icon: Palette,
    badge: 'Expérience immersive',
    description: 'Une esthétique remarquable au service de l’ergonomie et de la conversion pour marquer les esprits.',
    features: [
      'Création d’identité de marque (Logotype, charte graphique, typographie)',
      'Wireframing et prototypage interactif haute-fidélité sous Figma',
      'Design System modulaire et réutilisable',
      'Tests d’utilisabilité et optimisation des parcours clients',
      'Motion design et micro-interactions engageantes',
    ],
    techStack: ['Figma', 'Adobe CC', 'Lottie', 'Design Tokens'],
    deliverable: 'Fichiers sources Figma complets, kit de marque et composants vectoriels.',
  },
  {
    id: 'bot',
    title: 'Bot WhatsApp & Automatisation',
    icon: Zap,
    badge: 'Gain de temps immédiat',
    description: 'Des agents conversationnels WhatsApp et des workflows automatisés qui traitent vos demandes clients et vos tâches répétitives 24/7.',
    features: [
      'Agents conversationnels WhatsApp Business sur-mesure',
      'Qualification automatique des leads et prise de rendez-vous',
      'Automatisation des workflows métier (facturation, relances, notifications)',
      'Intégration CRM, paiement et outils internes existants',
      'Tableaux de suivi des conversations et taux de réponse',
    ],
    techStack: ['Twilio', 'Make (Integromat)', 'WhatsApp Business API', 'Node.js'],
    deliverable: 'Agent WhatsApp opérationnel, scénarios d’automatisation documentés et accès au tableau de suivi.',
  },
  {
    id: 'audit',
    title: 'SEO & Stratégie Digitale',
    icon: Search,
    badge: 'Visibilité maximale',
    description: 'Propulsez votre présence en première page des moteurs de recherche et attirez des prospects qualifiés.',
    features: [
      'Audit technique complet et correction des erreurs d’indexation',
      'Recherche sémantique de mots-clés à fort volume et intention d’achat',
      'Optimisation On-Page (balisage Schema.org, meta-données, linking interne)',
      'Stratégie de contenu orientée autorité et acquisition',
      'Rapports de positionnement mensuels et suivi du ROI',
    ],
    techStack: ['Semrush', 'Google Search Console', 'Ahrefs', 'Screaming Frog', 'Lighthouse'],
    deliverable: 'Rapport d’audit détaillé, plan d’actions priorisé et tableaux de bord analytiques.',
  },
  {
    id: 'infra',
    title: 'Cloud, Sécurité & DevOps',
    icon: Cpu,
    badge: 'Haute disponibilité',
    description: 'Infrastructures cloud résilientes, automatisation des déploiements et protection contre les menaces modernes.',
    features: [
      'Architectures cloud haute disponibilité (AWS, GCP, DigitalOcean)',
      'Pipelines CI/CD automatisés et déploiement sans interruption',
      'Audits de sécurité, conformité RGPD et certificats SSL avancés',
      'Monitoring 24/7 de l’infrastructure et alertes en temps réel',
      'Sauvegardes chiffrées automatisées et plan de reprise d’activité',
    ],
    techStack: ['Docker', 'Kubernetes', 'AWS', 'GitHub Actions', 'Terraform', 'Cloudflare'],
    deliverable: 'Infrastructure conteneurisée prête à l’échelle et documentation d’exploitation.',
  },
];

export function ServicesPage() {
  const location = useLocation();
  const [selectedService, setSelectedService] = useState('web');
  const currentService = serviceCategories.find(s => s.id === selectedService) || serviceCategories[0];

  // Sélectionne l'onglet correspondant à l'ancre (#web, #apps, #audit, #design, #bot)
  // au chargement et à chaque changement de lien (Navbar / Footer).
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && serviceCategories.some(s => s.id === hash)) {
      setSelectedService(hash);
      const el = document.getElementById('services-tabs');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  return (
    <div className="bg-light-bg min-h-screen text-light-text">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden text-center">
        {/* Decorative background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #EAE8FF 0%, #F8F7FF 40%, #E0F5EE 100%)' }}
        />
        <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-purple/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Expertise & Savoir-Faire
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-light-text tracking-tight leading-tight">
            Des solutions numériques d'élite conçues pour <span className="bg-gradient-to-r from-brand-purple to-brand-green bg-clip-text text-transparent">votre succès</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-light-text-secondary leading-relaxed max-w-2xl mx-auto">
            De l'architecture logicielle au design d'interface, nous concevons des produits digitaux performants, sécurisés et mémorables.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold shadow-md shadow-brand-purple/20">
              Discuter d’un projet <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/tarifs" className="btn-secondary px-6 py-3.5 rounded-xl font-semibold">
              Consulter nos forfaits
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Services Explorer */}
      <section id="services-tabs" className="py-16 container mx-auto px-4 max-w-6xl">
        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
          {serviceCategories.map((service) => {
            const Icon = service.icon;
            const active = selectedService === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  active
                    ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/25 scale-[1.02]'
                    : 'bg-white text-light-text-secondary hover:text-light-text hover:bg-light-bg-secondary border border-light-border shadow-sm'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-brand-green-light' : 'text-brand-purple'}`} />
                {service.title.split('&')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Active Service Card Detail */}
        <div className="bg-white border border-light-border rounded-3xl p-8 lg:p-12 shadow-light relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-brand-green/15 text-brand-green text-xs font-semibold">
                {currentService.badge}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-light-text">
                {currentService.title}
              </h2>
              <p className="text-light-text-secondary text-base leading-relaxed">
                {currentService.description}
              </p>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-light-text-muted">Ce que nous réalisons :</h3>
                {currentService.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                    <span className="text-sm text-light-text font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-light-border flex flex-wrap items-center gap-2">
                <span className="text-xs text-light-text-muted font-bold mr-2">Technologies :</span>
                {currentService.techStack.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-light-bg-secondary text-brand-purple text-xs font-semibold border border-light-border">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-light-bg-secondary border border-light-border rounded-2xl p-6 lg:p-8 flex flex-col justify-between h-full space-y-6 shadow-sm">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center mb-6 text-brand-purple">
                  <currentService.icon className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-light-text mb-2">Livrables garantis</h4>
                <p className="text-sm text-light-text-secondary mb-6">{currentService.deliverable}</p>

                <div className="p-4 rounded-xl bg-white border border-light-border space-y-2 mb-6 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-light-text-secondary">
                    <span>Délai moyen</span>
                    <span className="text-light-text font-bold">2 à 6 semaines</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-light-text-secondary">
                    <span>Garantie post-lancement</span>
                    <span className="text-brand-green font-bold">3 mois inclus</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-light-text-secondary">
                    <span>Propriété intellectuelle</span>
                    <span className="text-light-text font-bold">100% à vous</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/contact?service=${currentService.id}`}
                className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold shadow-md shadow-brand-purple/20"
              >
                Demander un devis pour ce service <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Process */}
      <section className="py-20 bg-white border-t border-light-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-purple uppercase tracking-widest block mb-2">Méthodologie</span>
            <h2 className="text-3xl font-bold text-light-text mb-4">Notre Méthode d'Exécution</h2>
            <p className="text-light-text-secondary text-sm">
              Un processus transparent, itératif et rigoureux pour garantir un résultat sans compromis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Cadrage & Stratégie', desc: 'Analyse des besoins, cahier des charges et feuille de route technique.' },
              { step: '02', title: 'Design & Prototypage', desc: 'Conception UI/UX interactive soumise à votre validation.' },
              { step: '03', title: 'Développement Agile', desc: 'Sprints de code TypeScript, tests continus et démonstrations régulières.' },
              { step: '04', title: 'Déploiement & Suivi', desc: 'Mise en production sécurisée, formation et garantie continue.' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-light-bg border border-light-border relative hover:border-brand-purple/40 transition-all group">
                <span className="text-4xl font-black text-brand-purple/15 block mb-2 group-hover:text-brand-purple/30 transition-colors">{item.step}</span>
                <h3 className="text-base font-bold text-light-text mb-2">{item.title}</h3>
                <p className="text-xs text-light-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 container mx-auto px-4 max-w-4xl">
        <div
          className="p-8 md:p-12 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-card"
          style={{ background: 'linear-gradient(135deg, #5B50C8 0%, #3DB38A 100%)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Vous avez un projet en tête ?</h2>
          <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto">
            Obtenez une estimation précise et un retour technique sous 24h par notre équipe d’ingénieurs.
          </p>
          <div className="pt-2">
            <Link to="/contact" className="bg-white text-light-text font-bold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 hover:bg-white/95 hover:shadow-lg transition-all">
              Demander un devis gratuit <ArrowRight className="w-4 h-4 text-brand-purple" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
