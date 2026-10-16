import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { WhatsAppIcon, SOCIAL_LINKS } from '../icons/BrandIcons';

const services = [
  { label: 'Sites Web', href: '/services#web' },
  { label: 'Applications Mobile', href: '/services#apps' },
  { label: 'Audit & Conseil', href: '/services#audit' },
  { label: 'Design UI/UX', href: '/services#design' },
  { label: 'Bot WhatsApp', href: '/services#bot' },
];

const company = [
  { label: 'À propos', href: '/a-propos' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'Contact', href: '/contact' },
];

const socials = SOCIAL_LINKS.map(({ name, href, Icon }) => ({ Icon, href, label: name }));

export function Footer() {
  return (
    <footer className="bg-light-bg border-t border-light-border">

      {/* CTA Banner */}
      <div className="border-b border-light-border">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div
            className="relative rounded-3xl p-10 md:p-14 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #5B50C8 0%, #3DB38A 100%)' }}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                  Prêt à lancer votre projet ?
                </h2>
                <p className="text-white/80 mt-2 max-w-md">
                  Discutons de votre vision et construisons quelque chose d'exceptionnel ensemble.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-brand-purple font-semibold text-sm hover:bg-white/90 transition-all shadow-lg active:scale-95"
                >
                  Démarrer un projet
                  <ArrowUpRight size={16} />
                </Link>
                <a
                  href="https://wa.me/22891782947"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white font-semibold text-sm hover:bg-white/30 transition-all active:scale-95"
                >
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <img
                src="/logo slogan.svg"
                alt="Nomeryc — Solutions Numériques"
                className="h-11 w-auto"
              />
            </Link>
            <p className="text-light-text-muted text-sm leading-relaxed mb-5">
              Solutions numériques innovantes pour propulser votre entreprise dans l'ère digitale.
            </p>
            <div className="flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-light-bg-secondary border border-light-border flex items-center justify-center text-light-text-muted hover:text-brand-purple hover:border-brand-purple/30 hover:bg-brand-purple/5 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-light-text font-semibold text-sm mb-4 uppercase tracking-wider">Services</h3>
            <ul className="flex flex-col gap-2.5">
              {services.map((s) => (
                <li key={s.href}>
                  <Link to={s.href} className="text-light-text-muted text-sm hover:text-brand-purple transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-light-text font-semibold text-sm mb-4 uppercase tracking-wider">Entreprise</h3>
            <ul className="flex flex-col gap-2.5">
              {company.map((c) => (
                <li key={c.href}>
                  <Link to={c.href} className="text-light-text-muted text-sm hover:text-brand-purple transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-light-text font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-light-text-muted text-sm">
                <MapPin size={15} className="shrink-0 text-brand-purple mt-0.5" />
                Lomé, Togo — Quartier Adidogomé
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Mail size={15} className="shrink-0 text-brand-purple" />
                <a href="mailto:contact@nomeryc.com" className="text-light-text-muted hover:text-brand-purple transition-colors">
                  contact@nomeryc.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Phone size={15} className="shrink-0 text-brand-green" />
                <a href="tel:+22891782947" className="text-light-text-muted hover:text-brand-green transition-colors">
                  +228 91 78 29 47
                </a>
              </li>
            </ul>
            <a
              href="https://wa.me/22891782947"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-brand-green/10 border border-brand-green/30 rounded-xl text-brand-green text-sm font-medium hover:bg-brand-green/20 transition-all"
            >
              <WhatsAppIcon size={15} />
              Discuter sur WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-light-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-light-text-muted text-sm">
            © {new Date().getFullYear()} Nomeryc. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link to="/mentions-legales" className="text-light-text-muted text-sm hover:text-light-text transition-colors">
              Mentions légales
            </Link>
            <Link to="/confidentialite" className="text-light-text-muted text-sm hover:text-light-text transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
