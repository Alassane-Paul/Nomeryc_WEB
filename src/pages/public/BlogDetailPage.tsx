import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Share2, Tag, CheckCircle2, Sparkles, BookOpen, ChevronRight, MessageSquare } from 'lucide-react';
import { blogService, BlogPost } from '../../services/blog.service';

interface ContentBlock {
  type: 'heading' | 'paragraph';
  id?: string;
  text: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Parse un contenu markdown simple (titres ###) en blocs, et construit le sommaire à partir des vrais titres. */
function parseContent(content: string): { blocks: ContentBlock[]; toc: { id: string; title: string }[] } {
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  const toc: { id: string; title: string }[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    const text = paragraphBuffer.join(' ').trim();
    if (text) blocks.push({ type: 'paragraph', text });
    paragraphBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('### ')) {
      flushParagraph();
      const title = line.replace(/^###\s+/, '');
      const id = slugify(title);
      blocks.push({ type: 'heading', id, text: title });
      toc.push({ id, title });
    } else if (line === '') {
      flushParagraph();
    } else {
      paragraphBuffer.push(line);
    }
  }
  flushParagraph();

  return { blocks, toc };
}

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await blogService.getBySlug(slug);
        setPost(data);
      } catch (err) {
        // Mock fallback if offline/no post found yet
        //         setPost({
        //           id: '1',
        //           title: 'Pourquoi migrer vers une architecture TypeScript en 2026',
        //           slug: slug,
        //           excerpt: 'Sécurité de typage, productivité décuplée et maintenance facilitée : découvrez les bénéfices réels du passage à TypeScript pour vos systèmes critiques.',
        //           content: `
        // TypeScript n'est plus une simple option : c'est devenu la fondation incontournable des applications d'entreprise pérennes.

        // ### 1. La fin des erreurs d'exécution silencieuses
        // En Javascript classique, l'erreur undefined is not a function ne survient qu'au runtime, souvent en production sous les yeux d'un utilisateur final. TypeScript attrape ces anomalies directement dans l'IDE dès la phase d'écriture.

        // ### 2. Refactoring sans crainte
        // Modifier la signature d'une fonction ou la structure d'un modèle Sequelize sans TypeScript requiert de vérifier manuellement des dizaines de fichiers. Le compilateur TS agit comme un filet de sécurité infaillible qui signale immédiatement tout désalignement.

        // ### 3. Autocomplétion et documentation vivante
        // Chaque interface TypeScript sert de contrat auto-documenté entre les couches logicielles (Frontend <-> Backend API). Les nouveaux développeurs qui rejoignent votre équipe deviennent opérationnels deux fois plus rapidement.

        // ### 4. Réduction drastique des coûts de maintenance
        // Les études démontrent une baisse de près de 35% des régressions logicielles après une migration vers TypeScript strict.

        // ### Conclusion
        // Investir dans TypeScript dès le démarrage d'un projet garantit un code maintenable, testable et évolutif sur le long terme pour soutenir la croissance de votre entreprise.
        //           `,
        //           category: 'Ingénierie Web',
        //           tags: ['TypeScript', 'Node.js', 'React', 'Bonnes Pratiques'],
        //           coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
        //           status: 'publie',
        //           publishedAt: new Date().toISOString(),
        //           author: {
        //             id: 'a1',
        //             firstName: 'Alassane',
        //             lastName: 'Paul',
        //             avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        //           },
        //           createdAt: new Date().toISOString(),
        //           updatedAt: new Date().toISOString(),
        //         });
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  const { blocks, toc: tocItems } = useMemo(
    () => parseContent(post?.content ?? ''),
    [post?.content]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center text-light-text-muted text-sm">
        Chargement de l'article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-light-bg flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold text-light-text mb-4">Article introuvable</h1>
        <Link to="/blog" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold">Retour au blog</Link>
      </div>
    );
  }

  // Sommaire extrait dynamiquement du contenu réel de l'article (plus de liste statique).
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="bg-light-bg min-h-screen text-light-text py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-light-text-secondary hover:text-brand-purple transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au blog
        </Link>

        {/* Top Header */}
        <div className="max-w-4xl mb-8 space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-brand-purple/10 text-brand-purple">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-light-text leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-light-border text-xs text-light-text-secondary">
            <div className="flex items-center gap-3">
              {post.author?.avatar && (
                <img src={post.author.avatar} alt="Author" className="w-10 h-10 rounded-full object-cover border border-light-border" />
              )}
              <div>
                <p className="text-light-text font-bold">{post.author?.firstName} {post.author?.lastName}</p>
                <p className="text-light-text-muted text-[11px]">Ingénieur & Architecte Logiciel</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-brand-green" />
                {new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-brand-purple" />
                {readingMinutes} min de lecture
              </span>
            </div>
          </div>
        </div>

        {/* Layout with Article Body & Floating Sommaire (Table of Contents) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Main Article Content */}
          <article className="lg:col-span-8 bg-white border border-light-border rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
            {/* Featured Image */}
            {post.coverImage && (
              <div className="rounded-2xl overflow-hidden border border-light-border shadow-sm">
                <img src={post.coverImage} alt={post.title} className="w-full h-80 md:h-[420px] object-cover" />
              </div>
            )}

            {/* Excerpt Lead */}
            <div className="p-4 rounded-2xl bg-brand-purple/5 border-l-4 border-brand-purple text-light-text font-medium text-base md:text-lg leading-relaxed">
              {post.excerpt}
            </div>

            {/* Article Body */}
            <div className="prose prose-purple max-w-none text-light-text-secondary leading-relaxed space-y-6 text-base">
              {blocks.map((block, idx) =>
                block.type === 'heading' ? (
                  <h3 key={idx} id={block.id} className="text-xl md:text-2xl font-bold text-light-text pt-2 scroll-mt-28">
                    {block.text}
                  </h3>
                ) : (
                  <p key={idx}>{block.text}</p>
                )
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-light-border flex flex-wrap items-center gap-2">
                <span className="text-xs text-light-text-muted font-bold mr-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Tags :
                </span>
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-light-bg-secondary text-brand-purple text-xs font-semibold border border-light-border">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Bio Box */}
            <div className="mt-8 p-6 rounded-2xl bg-light-bg-secondary border border-light-border flex items-center gap-4">
              <img src={post.author?.avatar} alt="Author" className="w-14 h-14 rounded-full object-cover border border-light-border" />
              <div>
                <h4 className="text-base font-bold text-light-text">{post.author?.firstName} {post.author?.lastName}</h4>
                <p className="text-xs text-light-text-secondary mt-1 leading-relaxed">
                  Passionné par les architectures modernes, les performances web et l'expérience développeur. Écrit régulièrement pour les publications techniques de Nomeryc.
                </p>
              </div>
            </div>
          </article>

          {/* Sticky Table of Contents (Sommaire latéral) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white border border-light-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-purple uppercase tracking-wider mb-4">
                <BookOpen className="w-4 h-4" />
                Sommaire de l'article
              </div>
              <nav className="space-y-2">
                {tocItems.length === 0 ? (
                  <p className="text-xs text-light-text-muted py-2">Cet article ne contient pas de sections.</p>
                ) : (
                  tocItems.map((item, idx) => (
                    <a
                      key={idx}
                      href={`#${item.id}`}
                      className="flex items-center justify-between text-xs text-light-text-secondary hover:text-brand-purple hover:bg-light-bg-secondary p-2 rounded-xl transition-colors font-medium group"
                    >
                      <span>{item.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-light-text-muted group-hover:text-brand-purple group-hover:translate-x-0.5 transition-all" />
                    </a>
                  ))
                )}
              </nav>
            </div>

            {/* Contact CTA in article */}
            <div
              className="p-6 rounded-2xl text-white relative overflow-hidden shadow-card"
              style={{ background: 'linear-gradient(135deg, #5B50C8 0%, #3DB38A 100%)' }}
            >
              <h4 className="font-bold text-base mb-2">Un projet similaire ?</h4>
              <p className="text-xs text-white/90 mb-4 leading-relaxed">
                Nos experts sont à votre écoute pour concevoir des architectures robustes et évolutives.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-white text-light-text text-xs font-bold hover:bg-white/95 transition-all shadow-sm"
              >
                Échanger avec un ingénieur
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
