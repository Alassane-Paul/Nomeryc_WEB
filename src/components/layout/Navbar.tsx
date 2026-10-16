import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe, Smartphone, Search, Palette, Zap, User, LogOut } from 'lucide-react';
import { WhatsAppIcon } from '../icons/BrandIcons';
import { useAuthStore } from '../../store/useAuthStore';

const servicesMenu = [
  { icon: Globe, label: 'Sites Web', desc: 'Applications modernes & SEO', href: '/services#web', color: 'text-brand-purple' },
  { icon: Smartphone, label: 'Applications Mobile', desc: 'iOS & Android cross-platform', href: '/services#apps', color: 'text-brand-green' },
  { icon: Search, label: 'Audit & Conseil', desc: 'Diagnostic & stratégie digitale', href: '/services#audit', color: 'text-yellow-500' },
  { icon: Palette, label: 'Design UI/UX', desc: 'Interfaces élégantes & expériences', href: '/services#design', color: 'text-pink-500' },
  { icon: WhatsAppIcon, label: 'Bot WhatsApp', desc: 'Automatisation intelligente', href: '/services#bot', color: 'text-emerald-500' },
];

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Services', href: '/services', hasDropdown: true },
  { label: 'Réalisations', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashboardPath = user?.role === 'admin' ? '/admin' : '/client';
  const isActive = (href: string) => href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-navbar border-b border-light-border py-3'
          : 'bg-white/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center group flex-shrink-0">
            <img
              src="/logo slogan.svg"
              alt="Nomeryc — Solutions Numériques"
              className="h-10 w-auto group-hover:scale-[1.02] transition-transform"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? 'text-brand-purple bg-brand-purple/8'
                        : 'text-light-text-secondary hover:text-light-text hover:bg-light-bg-secondary'
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {servicesOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-light border border-light-border p-2 animate-slide-down">
                      {servicesMenu.map(({ icon: Icon, label, desc, href, color }) => (
                        <Link
                          key={href}
                          to={href}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-light-bg-secondary transition-colors group"
                        >
                          <div className={`w-9 h-9 rounded-xl bg-light-bg-secondary flex items-center justify-center flex-shrink-0 ${color}`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-light-text group-hover:text-brand-purple transition-colors">{label}</p>
                            <p className="text-xs text-light-text-muted mt-0.5">{desc}</p>
                          </div>
                        </Link>
                      ))}
                      <div className="border-t border-light-border mt-2 pt-2">
                        <Link
                          to="/services"
                          className="flex items-center gap-2 p-3 rounded-xl text-sm font-semibold text-brand-purple hover:bg-brand-purple/5 transition-colors"
                        >
                          <Zap size={14} />
                          Voir tous nos services →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-brand-purple bg-brand-purple/8 font-semibold'
                      : 'text-light-text-secondary hover:text-light-text hover:bg-light-bg-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA Zone */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-light-text-secondary hover:text-light-text hover:bg-light-bg-secondary transition-all"
                >
                  <User size={15} />
                  Mon espace
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-light-text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={15} />
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-light-text-secondary hover:text-light-text hover:bg-light-bg-secondary transition-all"
                >
                  Connexion
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-green text-white hover:bg-brand-green-dark transition-all shadow-sm hover:shadow-green active:scale-95"
                >
                  Nous contacter
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-light-text-secondary hover:text-light-text hover:bg-light-bg-secondary transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-3 pb-4 border-t border-light-border animate-slide-down">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'text-brand-purple bg-brand-purple/8 font-semibold'
                      : 'text-light-text-secondary hover:text-light-text hover:bg-light-bg-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-light-border">
                {isAuthenticated ? (
                  <>
                    <Link to={dashboardPath} className="btn-primary">Mon espace</Link>
                    <button onClick={handleLogout} className="btn-ghost">Déconnexion</button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" className="btn-secondary text-center">Connexion</Link>
                    <Link to="/contact" className="btn-success text-center">Nous contacter</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
