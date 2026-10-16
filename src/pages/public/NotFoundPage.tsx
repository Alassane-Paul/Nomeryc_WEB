import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Compass, MessageCircle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-light-bg flex flex-col items-center justify-center text-center px-4 py-16 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #EAE8FF 0%, #F8F7FF 40%, #E0F5EE 100%)' }}
      />
      <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-purple/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-green/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
        {/* Animated Astronaut / Lost in Space SVG */}
        <div className="relative mb-6 animate-bounce" style={{ animationDuration: '3s' }}>
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl bg-white/80 backdrop-blur-md border border-light-border shadow-card flex items-center justify-center">
            <svg
              className="w-24 h-24 text-brand-purple"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="40" r="22" stroke="currentColor" strokeWidth="4" fill="#F8F7FF" />
              <path d="M38 38C38 32 44 28 50 28C56 28 62 32 62 38" stroke="#3DB38A" strokeWidth="3" strokeLinecap="round" />
              <rect x="42" y="34" width="16" height="12" rx="4" fill="#1A1B3A" />
              <path d="M32 64C32 54 40 48 50 48C60 48 68 54 68 64V80H32V64Z" stroke="currentColor" strokeWidth="4" fill="#FFFFFF" />
              <path d="M22 55C22 55 26 66 32 68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M78 55C78 55 74 66 68 68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="62" r="4" fill="#3DB38A" />
              <line x1="50" y1="18" x2="50" y2="8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="6" r="3" fill="#6C2BD9" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 px-3 py-1 bg-brand-green text-white text-xs font-black rounded-full shadow-md uppercase">
            404
          </div>
        </div>

        {/* Headings */}
        <span className="text-xs font-extrabold text-brand-purple uppercase tracking-widest mb-2">
          Page Introuvable
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-light-text tracking-tight mb-4">
          Perdu dans l'espace numérique ?
        </h1>
        <p className="text-sm md:text-base text-light-text-secondary max-w-md mb-8 leading-relaxed">
          La page que vous recherchez semble avoir disparu ou a été déplacée. Pas d'inquiétude, nos coordonnées sont intactes !
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto mb-10">
          <Link
            to="/"
            className="btn-primary px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-brand-purple/20 w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" /> Retour à l'accueil
          </Link>
          <Link
            to="/services"
            className="btn-secondary px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Compass className="w-4 h-4" /> Explorer nos services
          </Link>
        </div>

        {/* Quick Help Links */}
        <div className="p-4 rounded-2xl bg-white border border-light-border shadow-sm flex items-center gap-6 text-xs text-light-text-secondary">
          <Link to="/contact" className="hover:text-brand-purple flex items-center gap-1.5 font-medium transition-colors">
            <MessageCircle className="w-3.5 h-3.5 text-brand-green" /> Nous contacter
          </Link>
          <span className="w-1 h-1 rounded-full bg-light-border" />
          <Link to="/blog" className="hover:text-brand-purple font-medium transition-colors">
            Lire le Blog
          </Link>
          <span className="w-1 h-1 rounded-full bg-light-border" />
          <Link to="/tarifs" className="hover:text-brand-purple font-medium transition-colors">
            Nos Tarifs
          </Link>
        </div>
      </div>
    </div>
  );
}
