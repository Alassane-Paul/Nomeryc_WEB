import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, ArrowLeft, Code2, Zap, Rocket, MessageCircle, FileText, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
  });

  const { login, register, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/client', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
    } catch {
      // error handled in store
    }
  };

  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    clearError();
    setForm({ email: '', password: '', firstName: '', lastName: '', phone: '', company: '' });
  };

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-brand-green/15 rounded-full blur-3xl" />

        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo slogan.svg" alt="Nomeryc" className="h-9 w-auto brightness-0 invert" />
          </Link>

          <div>
            <h2 className="text-4xl font-display font-bold text-white leading-tight mb-4">
              {mode === 'login' ? (
                <span className="flex items-center gap-3">
                  <Sparkles size={32} className="text-brand-purple-light" />
                  Bon retour parmi nous
                </span>
              ) : (
                <>Rejoignez l'aventure <span className="gradient-text">digitale</span></>
              )}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              {mode === 'login'
                ? 'Accédez à votre espace et suivez vos projets en temps réel.'
                : 'Créez votre compte et donnez vie à vos projets numériques.'}
            </p>

            <div className="space-y-4">
              {[
                { icon: Rocket, text: 'Suivi de projets en temps réel', color: 'text-brand-purple-light' },
                { icon: MessageCircle, text: 'Messagerie directe avec votre équipe', color: 'text-brand-green' },
                { icon: FileText, text: 'Devis et factures en ligne', color: 'text-yellow-400' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className={color} />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Nomeryc. Tous droits réservés.</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="/logo slogan.svg" alt="Nomeryc" className="h-8 w-auto brightness-0 invert" />
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              {mode === 'login' ? 'Connexion' : 'Créer un compte'}
            </h1>
            <p className="text-gray-400 text-sm">
              {mode === 'login' ? 'Entrez vos identifiants pour continuer' : 'Remplissez le formulaire pour commencer'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex p-1 bg-surface-DEFAULT rounded-2xl mb-8 border border-surface-border">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                mode === 'login' ? 'bg-brand-purple text-white shadow-brand' : 'text-gray-400 hover:text-white'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                mode === 'register' ? 'bg-brand-purple text-white shadow-brand' : 'text-gray-400 hover:text-white'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="input-group">
                  <label className="input-label">Prénom</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input name="firstName" value={form.firstName} onChange={handleChange}
                      className="input pl-9" placeholder="Kofi" required />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Nom</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input name="lastName" value={form.lastName} onChange={handleChange}
                      className="input pl-9" placeholder="Asante" required />
                  </div>
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  className="input pl-9" placeholder="vous@example.com" required />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div className="input-group">
                  <label className="input-label">Téléphone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input name="phone" value={form.phone} onChange={handleChange}
                      className="input pl-9" placeholder="+228 90 00 00 00" />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Entreprise <span className="text-gray-500">(optionnel)</span></label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input name="company" value={form.company} onChange={handleChange}
                      className="input pl-9" placeholder="Ma Société SARL" />
                  </div>
                </div>
              </>
            )}

            <div className="input-group">
              <div className="flex items-center justify-between">
                <label className="input-label">Mot de passe</label>
                {mode === 'login' && (
                  <Link to="/mot-de-passe-oublie" className="text-xs text-brand-purple-light hover:text-white transition-colors">
                    Mot de passe oublié ?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} className="input pl-9 pr-10"
                  placeholder={mode === 'register' ? '8 caractères minimum' : '••••••••'} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full btn-lg mt-2">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Connexion...' : 'Création...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap size={16} />
                  {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-300 transition-colors">
              <ArrowLeft size={14} />
              Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
