import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FolderOpen, FileText, Receipt,
  BarChart3, BookOpen, Briefcase, Settings, LogOut, ChevronLeft, UserCircle2,
  ChevronRight, Bell, MessageSquare, CheckSquare, Calendar, File,
  HelpCircle, MessageSquareQuote, Tags, Inbox,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

const adminNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/admin' },
  { icon: Users, label: 'Clients', href: '/admin/clients' },
  { icon: Inbox, label: 'Contacts', href: '/admin/contacts' },
  { icon: FolderOpen, label: 'Projets', href: '/admin/projets' },
  { icon: FileText, label: 'Devis', href: '/admin/devis' },
  { icon: Receipt, label: 'Factures', href: '/admin/factures' },
  { icon: MessageSquare, label: 'Messages', href: '/admin/messages' },
  { icon: CheckSquare, label: 'Tâches', href: '/admin/taches' },
  { icon: Briefcase, label: 'Portfolio', href: '/admin/portfolio' },
  { icon: UserCircle2, label: 'Équipe', href: '/admin/equipe' },
  { icon: MessageSquareQuote, label: 'Témoignages', href: '/admin/temoignages' },
  { icon: BookOpen, label: 'Blog', href: '/admin/blog' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: HelpCircle, label: 'FAQ', href: '/admin/faq' },
  { icon: Tags, label: 'Tarifs', href: '/admin/tarifs' },
];

const clientNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/client' },
  { icon: FolderOpen, label: 'Mes Projets', href: '/client/projets' },
  { icon: FileText, label: 'Mes Devis', href: '/client/devis' },
  { icon: Receipt, label: 'Mes Factures', href: '/client/factures' },
  { icon: MessageSquare, label: 'Messages', href: '/client/messages' },
  { icon: File, label: 'Documents', href: '/client/documents' },
  { icon: Bell, label: 'Notifications', href: '/client/notifications' },
  { icon: Settings, label: 'Paramètres', href: '/client/parametres' },
];

interface SidebarProps {
  role: 'admin' | 'client';
}

export function Sidebar({ role }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navItems = role === 'admin' ? adminNav : clientNav;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/admin' || href === '/client') return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ background: '#1A1B3A', borderRight: '1px solid #2D2E6A' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 min-h-[65px]"
        style={{ borderBottom: '1px solid #2D2E6A' }}
      >
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo slogan.svg" alt="Nomeryc" className="h-8 w-auto brightness-0 invert" />
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="flex items-center justify-center mx-auto">
            <img src="/logo.svg" alt="N" className="w-7 h-7 object-contain" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg transition-all ${collapsed ? 'mx-auto' : ''}`}
          style={{ color: '#A0A3C4' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={e => (e.currentTarget.style.color = '#A0A3C4')}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map(({ icon: Icon, label, href, badge }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              to={href}
              title={collapsed ? label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative"
              style={{
                color: active ? '#FFFFFF' : '#A0A3C4',
                background: active ? '#5B50C8' : 'transparent',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = '#22235C';
                  (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#A0A3C4';
                }
              }}
            >
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
              {badge && !collapsed && (
                <span className="ml-auto bg-brand-purple text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {badge}
                </span>
              )}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer — User + Actions */}
      <div className="p-3 space-y-0.5" style={{ borderTop: '1px solid #2D2E6A' }}>
        <Link
          to={`/${role}/parametres`}
          title={collapsed ? 'Paramètres' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#A0A3C4' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = '#22235C';
            (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#A0A3C4';
          }}
        >
          <Settings size={17} />
          {!collapsed && <span>Paramètres</span>}
        </Link>

        <button
          onClick={handleLogout}
          title={collapsed ? 'Déconnexion' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#A0A3C4' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
            (e.currentTarget as HTMLElement).style.color = '#F87171';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#A0A3C4';
          }}
        >
          <LogOut size={17} />
          {!collapsed && <span>Déconnexion</span>}
        </button>

        {/* User card */}
        {!collapsed && user && (
          <div className="mt-2 px-3 py-3 rounded-xl" style={{ background: '#252568' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs truncate" style={{ color: '#7B72E0' }}>{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
