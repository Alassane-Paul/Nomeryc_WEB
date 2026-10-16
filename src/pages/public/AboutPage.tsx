import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, HeartHandshake, Zap, Award, Users, ArrowRight, Sparkles } from 'lucide-react';
import { teamService, TeamMember } from '../../services/team.service';
import { analyticsService, PublicStats } from '../../services/analytics.service';

const values: any[] = [
  // {
  //   icon: Target,
  //   title: 'Excellence Technique',
  //   desc: 'Nous n’acceptons aucun compromis sur la qualité du code, la sécurité et la vitesse de chargement de vos solutions.',
  // },
  // {
  //   icon: HeartHandshake,
  //   title: 'Transparence & Proximité',
  //   desc: 'Vous gardez une visibilité totale sur l’avancement de vos projets via notre espace client en temps réel.',
  // },
  // {
  //   icon: Zap,
  //   title: 'Impact & ROI Mesurable',
  //   desc: 'Chaque ligne de code et chaque pixel conçu répond à un objectif business clair : faire croître votre chiffre d’affaires.',
  // },
  // {
  //   icon: ShieldCheck,
  //   title: 'Pérennité & Sécurité',
  //   desc: 'Des architectures modulaires faites pour durer, conformes aux standards RGPD et protégées contre les cyber-menaces.',
  // },
];

// Repli affiché tant que l'API n'a pas répondu (ou si elle est indisponible),
// pour ne jamais laisser la section "Équipe" vide. Dès que le back-office contient
// au moins un membre, ces données sont remplacées par celles de la base.
const defaultTeam: TeamMember[] = [
  // {
  //   id: 'fallback-1',
  //   name: 'Alassane Paul',
  //   role: 'Fondateur & Lead Architect',
  //   bio: 'Ingénieur logiciel passionné par les systèmes distribués, l’écosystème TypeScript et le cloud.',
  //   avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  //   createdAt: '', updatedAt: '',
  // },
  // {
  //   id: 'fallback-2',
  //   name: 'Sarah Mendy',
  //   role: 'Head of Design & UX',
  //   bio: 'Experte en ergonomie digitale, ergonomie cognitive et création de design systems Figma scalables.',
  //   avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  //   createdAt: '', updatedAt: '',
  // },
  // {
  //   id: 'fallback-3',
  //   name: 'Karim Diallo',
  //   role: 'Lead Mobile & DevOps',
  //   bio: 'Spécialiste React Native, Flutter et pipelines CI/CD haute disponibilité.',
  //   avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  //   createdAt: '', updatedAt: '',
  // },
];

export function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam);
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await teamService.getAll();
        if (data && data.length > 0) {
          setTeam(data);
        }
      } catch {
        // Le repli statique ci-dessus reste affiché
      }
    }
    async function loadStats() {
      try {
        setStats(await analyticsService.publicStats());
      } catch {
        // Section chiffres clés masquée si l'API est indisponible (jamais de chiffre inventé)
      }
    }
    loadTeam();
    loadStats();
  }, []);

  return (
    <div className="bg-light-bg min-h-screen text-light-text">
      {/* Hero */}
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
            Notre Histoire & Vision
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-light-text tracking-tight leading-tight">
            Façonner le futur digital avec <span className="bg-gradient-to-r from-brand-purple to-brand-green bg-clip-text text-transparent">passion et rigueur</span>.
          </h1>
          <p className="mt-6 text-lg text-light-text-secondary max-w-2xl mx-auto leading-relaxed">
            Nomeryc est une agence digitale d'ingénierie et de design fondée avec une ambition : réconcilier l'esthétique d'avant-garde avec une robustesse logicielle irréprochable.
          </p>
        </div>
      </section>

      {/* Stats Counter — chiffres réels, calculés depuis la base (aucune valeur inventée) */}
      {stats && (
        <section className="py-12 border-y border-light-border bg-white shadow-sm">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl lg:text-5xl font-black text-brand-green">{stats.projectsDelivered}+</p>
                <p className="text-xs text-light-text-muted mt-1 uppercase tracking-wider font-bold">Projets Livrés</p>
              </div>
              <div>
                <p className="text-4xl lg:text-5xl font-black text-light-text">{stats.clientsCount}+</p>
                <p className="text-xs text-light-text-muted mt-1 uppercase tracking-wider font-bold">Clients Accompagnés</p>
              </div>
              <div>
                <p className="text-4xl lg:text-5xl font-black text-brand-purple">
                  {stats.averageRating ? `${stats.averageRating}/5` : '—'}
                </p>
                <p className="text-xs text-light-text-muted mt-1 uppercase tracking-wider font-bold">
                  Note Moyenne{stats.reviewsCount > 0 ? ` (${stats.reviewsCount} avis)` : ''}
                </p>
              </div>
              <div>
                <p className="text-4xl lg:text-5xl font-black text-light-text">{stats.teamSize}</p>
                <p className="text-xs text-light-text-muted mt-1 uppercase tracking-wider font-bold">Membres de l'Équipe</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="py-20 container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-purple uppercase tracking-widest block mb-2">Engagements</span>
          <h2 className="text-3xl font-bold text-light-text mb-3">Nos Piliers Fondateurs</h2>
          <p className="text-light-text-secondary text-sm">Les principes qui guident chacune de nos décisions de conception et de développement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => (
            <div key={idx} className="bg-white border border-light-border p-6 rounded-2xl shadow-sm hover:shadow-card hover:border-brand-purple/30 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-purple group-hover:text-white transition-all">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-light-text mb-2">{v.title}</h3>
                <p className="text-xs text-light-text-secondary leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white border-t border-light-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-green uppercase tracking-widest block mb-2">Talents</span>
            <h2 className="text-3xl font-bold text-light-text mb-3">L'Équipe d'Experts</h2>
            <p className="text-light-text-secondary text-sm">Des ingénieurs et créatifs engagés à vos côtés pour matérialiser vos idées les plus exigeantes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-light-bg border border-light-border rounded-2xl overflow-hidden text-center p-6 hover:border-brand-purple/30 transition-all shadow-sm">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-brand-purple/30 mb-4 shadow-md">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-light-text">{member.name}</h3>
                <p className="text-xs font-bold text-brand-purple mt-0.5">{member.role}</p>
                <p className="text-xs text-light-text-secondary mt-3 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 container mx-auto px-4 max-w-4xl text-center pb-24">
        <div
          className="p-8 md:p-12 rounded-3xl text-white space-y-6 shadow-card relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #5B50C8 0%, #3DB38A 100%)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Prêt à collaborer avec nous ?</h2>
          <p className="text-white/90 text-sm max-w-lg mx-auto">
            Discutons de vos ambitions numériques et construisons ensemble le prochain succès de votre marque.
          </p>
          <div className="pt-2">
            <Link to="/contact" className="bg-white text-light-text font-bold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 hover:bg-white/95 hover:shadow-lg transition-all">
              Démarrer une conversation <ArrowRight className="w-4 h-4 text-brand-purple" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
