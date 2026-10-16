import React, { useEffect, useState, useCallback } from 'react';
import { Bell, MessageSquare, FolderOpen, Receipt, Settings, Check, ExternalLink, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notificationsService, AppNotification, NotificationType } from '../../services/notifications.service';
import { onSocketEvent, connectSocket } from '../../services/socket.service';

type NotifFilter = 'all' | 'unread' | 'PROJECT' | 'INVOICE' | 'MESSAGE' | 'QUOTE' | 'SYSTEM';

const typeIcon: Record<NotificationType, { icon: React.ElementType; bg: string; color: string }> = {
  MESSAGE: { icon: MessageSquare, bg: 'bg-brand-purple/15', color: 'text-brand-purple' },
  PROJECT: { icon: FolderOpen, bg: 'bg-brand-green/15', color: 'text-brand-green' },
  INVOICE: { icon: Receipt, bg: 'bg-yellow-400/15', color: 'text-yellow-500' },
  QUOTE: { icon: Receipt, bg: 'bg-blue-400/15', color: 'text-blue-400' },
  SYSTEM: { icon: Settings, bg: 'bg-orange-400/15', color: 'text-orange-400' },
};

const filterTabs: { key: NotifFilter; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'unread', label: 'Non lues' },
  { key: 'PROJECT', label: 'Projets' },
  { key: 'INVOICE', label: 'Factures' },
  { key: 'MESSAGE', label: 'Messages' },
  { key: 'SYSTEM', label: 'Système' },
];

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

export function ClientNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<NotifFilter>('all');

  const load = useCallback(async () => {
    try {
      setNotifications(await notificationsService.list());
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    connectSocket();
    const off = onSocketEvent<AppNotification>('notification:new', (n) => {
      setNotifications((prev) => [n, ...prev]);
    });
    return off;
  }, [load]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await notificationsService.markAllAsRead().catch(() => {});
  };
  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    await notificationsService.markAsRead(id).catch(() => {});
  };
  const dismiss = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await notificationsService.remove(id).catch(() => {});
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.type === filter;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-brand-purple text-white text-xs font-bold px-2.5 py-1 rounded-full">{unreadCount}</span>
            )}
          </h1>
          <p className="text-gray-400 text-sm mt-1">Restez informé de l'activité de vos projets</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary btn-sm flex items-center gap-2">
            <Check size={14} />
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="flex gap-1 p-1 bg-surface rounded-2xl mb-6 overflow-x-auto no-scrollbar">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab.key ? 'bg-brand-purple text-white shadow-brand' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">Aucune notification</p>
          </div>
        ) : (
          filtered.map((notif) => {
            const { icon: Icon, bg, color } = typeIcon[notif.type];
            return (
              <div
                key={notif.id}
                className={`card flex items-start gap-4 p-5 transition-all ${
                  !notif.isRead ? 'border-brand-purple/30 bg-surface-card' : 'opacity-80'
                }`}
              >
                <div className="relative mt-1">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={color} />
                  </div>
                  {!notif.isRead && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-purple rounded-full border-2 border-brand-dark" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>{notif.title}</p>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">{notif.message}</p>
                  <p className="text-gray-500 text-xs mt-2">{timeAgo(notif.createdAt)}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {notif.link && (
                    <Link
                      to={notif.link}
                      onClick={() => markRead(notif.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border text-gray-300 text-xs hover:border-brand-purple/50 hover:text-white transition-all"
                    >
                      <ExternalLink size={12} />
                      Voir
                    </Link>
                  )}
                  {!notif.isRead && (
                    <button
                      onClick={() => markRead(notif.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-brand-green hover:bg-brand-green/10 transition-all"
                      title="Marquer comme lu"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => dismiss(notif.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Supprimer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
