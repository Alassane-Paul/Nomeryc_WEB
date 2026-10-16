import React, { useState, useEffect } from 'react';
import { ExternalLink, Layers, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { portfolioService, PortfolioItem } from '../../services/portfolio.service';

const defaultProjects: PortfolioItem[] = [
  // {
  //   id: '1',
  //   title: 'Plateforme E-Commerce Omnicanale',
  //   category: 'web',
  //   description: 'Boutique en ligne haute performance avec synchronisation ERP en temps réel et checkout optimisé.',
  //   technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
  //   coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
  //   liveUrl: 'https://example.com',
  //   clientName: 'Maison Luxe',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: '2',
  //   title: 'Application Fintech & Paiement Mobile',
  //   category: 'mobile',
  //   description: 'Portefeuille numérique sécurisé avec virements instantanés, QR code payments et authentification biométrique.',
  //   technologies: ['React Native', 'TypeScript', 'Node.js', 'Redis'],
  //   coverImage: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=60',
  //   liveUrl: 'https://example.com',
  //   clientName: 'PayFlow Africa',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: '3',
  //   title: 'Dashboard Analytique & Business Intelligence',
  //   category: 'web',
  //   description: 'Interface d’aide à la décision avec visualisation de données massives, prédictions IA et alertes.',
  //   technologies: ['React', 'TailwindCSS', 'Recharts', 'Python FastApi'],
  //   coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
  //   liveUrl: 'https://example.com',
  //   clientName: 'DataCorp SA',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: '4',
  //   title: 'Refonte Identité Visuelle & UI Kit',
  //   category: 'design',
  //   description: 'Design system complet, charte graphique dynamique et déclinaison multi-supports pour scale-up.',
  //   technologies: ['Figma', 'Design System', 'Motion Graphics'],
  //   coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
  //   liveUrl: 'https://example.com',
  //   clientName: 'NovaTech',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: '5',
  //   title: 'Application Logistique & Suivi Flotte',
  //   category: 'mobile',
  //   description: 'Gestion de tournées de livraison en temps réel avec géolocalisation GPS et signature numérique.',
  //   technologies: ['Flutter', 'Node.js', 'WebSockets', 'Google Maps API'],
  //   coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60',
  //   liveUrl: 'https://example.com',
  //   clientName: 'LogiTrans Group',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: '6',
  //   title: 'Portail Institutionnel & E-Gouv',
  //   category: 'web',
  //   description: 'Portail citoyen conforme aux exigences d’accessibilité WCAG 2.1 AA et haute sécurité souveraine.',
  //   technologies: ['Next.js', 'TypeScript', 'TailwindCSS', 'Docker'],
  //   coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
  //   liveUrl: 'https://example.com',
  //   clientName: 'Agence Régionale',
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
];

export function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>(defaultProjects);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        setLoading(true);
        const data = await portfolioService.getAll();
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        // Fallback to default demo items if backend hasn't populated yet
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.category.toLowerCase() === filter.toLowerCase());

  const categories = [
    { key: 'all', label: 'Toutes les réalisations' },
    { key: 'web', label: 'Web & SaaS' },
    { key: 'mobile', label: 'Applications Mobiles' },
    { key: 'design', label: 'Design UI/UX' },
    { key: 'marketing', label: 'SEO & Stratégie' },
  ];

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
            Nos Réalisations
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-light-text tracking-tight leading-tight">
            Des projets d'envergure qui <span className="bg-gradient-to-r from-brand-purple to-brand-green bg-clip-text text-transparent">transforment les entreprises</span>.
          </h1>
          <p className="mt-6 text-lg text-light-text-secondary max-w-2xl mx-auto">
            Découvrez comment nous aidons nos partenaires à concevoir, déployer et accélérer leurs produits digitaux.
          </p>

          {/* Filter Bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  filter === cat.key
                    ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20 scale-[1.02]'
                    : 'bg-white text-light-text-secondary hover:text-light-text hover:bg-light-bg-secondary border border-light-border shadow-sm'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 container mx-auto px-4 max-w-6xl pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-light-border rounded-2xl overflow-hidden shadow-sm hover:shadow-card hover:border-brand-purple/30 transition-all duration-300 group flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-52 overflow-hidden bg-light-bg-secondary">
                <img
                  src={project.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-brand-purple shadow-sm">
                    {project.category.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {project.clientName && (
                    <span className="text-xs text-brand-purple font-bold uppercase tracking-wider block mb-1">
                      {project.clientName}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-light-text group-hover:text-brand-purple transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-light-text-secondary line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-2 mb-4">
                    {project.technologies?.slice(0, 4).map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-light-bg-secondary text-brand-purple text-xs font-semibold border border-light-border">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline"
                    >
                      Voir le projet <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
