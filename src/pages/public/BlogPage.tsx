import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, Search, Tag, Sparkles, TrendingUp, Mail, CheckCircle2 } from 'lucide-react';
import { blogService, BlogPost } from '../../services/blog.service';
import { newsletterService } from '../../services/newsletter.service';

const defaultPosts: BlogPost[] = [
  // {
  //   id: '1',
  //   title: 'Pourquoi migrer vers une architecture TypeScript en 2026',
  //   slug: 'pourquoi-migrer-architecture-typescript-2026',
  //   excerpt: 'Sécurité de typage, productivité décuplée et maintenance facilitée : découvrez les bénéfices réels du passage à TypeScript pour vos systèmes critiques.',
  //   content: 'TypeScript est devenu le standard incontournable pour le développement web moderne...',
  //   category: 'Ingénierie Web',
  //   tags: ['TypeScript', 'Node.js', 'React'],
  //   coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
  //   status: 'publie',
  //   publishedAt: new Date().toISOString(),
  //   author: {
  //     id: 'a1',
  //     firstName: 'Alassane',
  //     lastName: 'Paul',
  //     avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  //   },
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: '2',
  //   title: 'Design System & UI moderne : de Figma au composant React',
  //   slug: 'design-system-figma-react-tailwind',
  //   excerpt: 'Comment aligner designers et développeurs autour d’une source unique de vérité avec Figma et Tailwind CSS sans friction.',
  //   content: 'Un Design System bien pensé réduit de 40% le temps de développement des nouvelles interfaces...',
  //   category: 'Design & UI/UX',
  //   tags: ['UI/UX', 'Figma', 'TailwindCSS'],
  //   coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60',
  //   status: 'publie',
  //   publishedAt: new Date().toISOString(),
  //   author: {
  //     id: 'a2',
  //     firstName: 'Sarah',
  //     lastName: 'Mendy',
  //     avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  //   },
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: '3',
  //   title: 'Core Web Vitals : optimiser la vitesse de son application pour le SEO',
  //   slug: 'core-web-vitals-optimisation-seo',
  //   excerpt: 'Les métriques clés de Google et les techniques concrètes pour passer dans le vert et doubler son trafic organique rapidement.',
  //   content: 'Google prend en compte l’expérience de chargement réelle des utilisateurs...',
  //   category: 'SEO & Performance',
  //   tags: ['SEO', 'Performance', 'Web Vitals'],
  //   coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=60',
  //   status: 'publie',
  //   publishedAt: new Date().toISOString(),
  //   author: {
  //     id: 'a3',
  //     firstName: 'Marc',
  //     lastName: 'Koffi',
  //     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  //   },
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
  // {
  //   id: '4',
  //   title: 'Paiements Mobile Money en Afrique de l’Ouest : guide technique',
  //   slug: 'paiements-mobile-money-afrique-guide-technique',
  //   excerpt: 'Intégration unifiée des APIs TMoney, Flooz, Wave et Orange Money dans vos applications web et mobiles.',
  //   content: 'Le Mobile Money est le vecteur d’inclusion financière numéro un...',
  //   category: 'Ingénierie Web',
  //   tags: ['Fintech', 'Mobile Money', 'API'],
  //   coverImage: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=60',
  //   status: 'publie',
  //   publishedAt: new Date().toISOString(),
  //   author: {
  //     id: 'a1',
  //     firstName: 'Alassane',
  //     lastName: 'Paul',
  //     avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  //   },
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // }
];

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await blogService.getAll();
        if (data && data.length > 0) {
          setPosts(data);
        }
      } catch {
        // Les articles de démonstration ci-dessus restent affichés
      }
    }
    loadPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Thématiques calculées à partir des vrais articles chargés (plus de liste ni de compteurs inventés).
  const categoryCounts = posts.reduce<Record<string, number>>((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const categories = ['all', ...sortedCategories.map(([cat]) => cat)];

  const popularPosts = posts.slice(0, 3);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || newsletterLoading) return;
    setNewsletterLoading(true);
    setNewsletterError('');
    try {
      await newsletterService.subscribe(newsletterEmail);
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    } catch {
      setNewsletterError("L'inscription a échoué. Vérifiez votre email et réessayez.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="bg-light-bg min-h-screen text-light-text">
      {/* Hero */}
      <section className="relative py-20 lg:py-24 overflow-hidden text-center">
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
            Insights & Analyses
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-light-text tracking-tight leading-tight">
            Le blog des innovations <span className="bg-gradient-to-r from-brand-purple to-brand-green bg-clip-text text-transparent">tech & design</span>.
          </h1>
          <p className="mt-6 text-lg text-light-text-secondary max-w-2xl mx-auto">
            Retours d'expérience, tutoriels pointus et bonnes pratiques pour réussir vos chantiers numériques.
          </p>

          {/* Search bar */}
          <div className="mt-10 max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-light-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un article ou un mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-light-border text-light-text placeholder-light-text-muted focus:outline-none focus:border-brand-purple shadow-sm text-sm"
            />
          </div>
        </div>
      </section>

      {/* Main Content with Articles + Sidebar */}
      <section className="py-12 container mx-auto px-4 max-w-7xl pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Column: Articles List */}
          <div className="lg:col-span-8 space-y-8">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedCategory === cat
                      ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                      : 'bg-white text-light-text-secondary hover:text-light-text hover:bg-light-bg-secondary border border-light-border shadow-sm'
                    }`}
                >
                  {cat === 'all' ? 'Tous les articles' : cat}
                </button>
              ))}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-light-border p-8">
                <p className="text-light-text-secondary text-base">Aucun article ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white border border-light-border rounded-2xl overflow-hidden shadow-sm hover:shadow-card hover:border-brand-purple/30 transition-all flex flex-col group"
                  >
                    {/* Cover image */}
                    <Link to={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden bg-light-bg-secondary">
                      <img
                        src={post.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-brand-purple shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </Link>

                    {/* Meta & Info */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-xs text-light-text-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            5 min de lecture
                          </span>
                        </div>

                        <h2 className="text-lg font-bold text-light-text group-hover:text-brand-purple transition-colors line-clamp-2">
                          <Link to={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>

                        <p className="text-xs text-light-text-secondary line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-light-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={post.author?.firstName || 'Auteur'}
                            className="w-7 h-7 rounded-full object-cover border border-light-border"
                          />
                          <span className="text-xs font-semibold text-light-text">
                            {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Nomeryc Team'}
                          </span>
                        </div>

                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-xs font-bold text-brand-purple hover:text-brand-purple-dark flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                        >
                          Lire <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Newsletter Box */}
            <div className="bg-white border border-light-border rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-light-text mb-2">Restez informé</h3>
              <p className="text-xs text-light-text-secondary mb-4 leading-relaxed">
                Recevez nos meilleures analyses tech, nos guides d’architecture logicielle et nos retours d'expérience chaque mois.
              </p>
              {newsletterSuccess ? (
                <div className="p-3 bg-brand-green/15 text-brand-green rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Merci ! Vous êtes désormais inscrit.
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="space-y-3">
                  {newsletterError && (
                    <p className="text-xs text-red-500">{newsletterError}</p>
                  )}
                  <input
                    type="email"
                    required
                    placeholder="Votre adresse email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-light-bg-secondary border border-light-border text-light-text placeholder-light-text-muted text-xs focus:outline-none focus:border-brand-purple"
                  />
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="btn-primary w-full py-2.5 rounded-xl text-xs font-semibold shadow-sm disabled:opacity-60"
                  >
                    {newsletterLoading ? 'Inscription...' : "S'abonner gratuitement"}
                  </button>
                </form>
              )}
            </div>

            {/* Popular Articles */}
            <div className="bg-white border border-light-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-purple uppercase tracking-wider mb-4">
                <TrendingUp className="w-4 h-4" />
                Articles Populaires
              </div>
              <div className="space-y-4">
                {popularPosts.map((popPost, idx) => (
                  <Link
                    key={popPost.id}
                    to={`/blog/${popPost.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="text-xl font-black text-brand-purple/20 group-hover:text-brand-purple transition-colors">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-light-text group-hover:text-brand-purple transition-colors line-clamp-2">
                        {popPost.title}
                      </h4>
                      <span className="text-[11px] text-light-text-muted mt-0.5 block">
                        {popPost.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white border border-light-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-light-text mb-3">Thématiques</h3>
              <div className="space-y-1.5">
                {sortedCategories.length === 0 ? (
                  <p className="text-xs text-light-text-muted py-2">Aucune thématique pour l'instant.</p>
                ) : (
                  sortedCategories.map(([name, count]) => (
                    <button
                      key={name}
                      onClick={() => setSelectedCategory(name)}
                      className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs text-light-text-secondary hover:text-brand-purple hover:bg-light-bg-secondary transition-colors"
                    >
                      <span>{name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-light-bg-secondary text-brand-purple font-mono font-bold text-[10px]">
                        {count}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
