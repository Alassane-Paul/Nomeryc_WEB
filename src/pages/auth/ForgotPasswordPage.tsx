import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/auth.service';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      // Réponse volontairement neutre côté API : on affiche quand même le succès
      // pour ne pas révéler si l'email existe.
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <img src="/logo slogan.svg" alt="Nomeryc" className="h-8 w-auto brightness-0 invert" />
        </Link>

        <div className="card p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h1 className="text-xl font-bold text-white mb-2">Email envoyé</h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                Si un compte existe avec l'adresse <strong className="text-white">{email}</strong>, un lien de
                réinitialisation vient de lui être envoyé. Pensez à vérifier vos spams.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-display font-bold text-white mb-2">Mot de passe oublié</h1>
              <p className="text-gray-400 text-sm mb-6">
                Entrez votre email, nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              {error && (
                <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-9"
                      placeholder="vous@example.com"
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full btn-lg mt-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} />
                      Envoyer le lien
                    </span>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <Link to="/auth" className="inline-flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-300 transition-colors">
              <ArrowLeft size={14} />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
