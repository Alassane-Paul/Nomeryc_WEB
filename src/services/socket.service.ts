import { io, Socket } from 'socket.io-client';

// L'URL socket est la racine du serveur (sans /api/v1)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL.replace(/\/api\/v1\/?$/, '');

let socket: Socket | null = null;

/** Ouvre (ou réutilise) la connexion temps réel authentifiée. */
export function connectSocket(): Socket | null {
  const token = localStorage.getItem('nomeryc_token');
  if (!token) return null;

  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

/** Abonnement typé avec désabonnement automatique (à retourner dans un useEffect). */
export function onSocketEvent<T = any>(event: string, handler: (payload: T) => void): () => void {
  const s = connectSocket();
  if (!s) return () => {};
  s.on(event, handler);
  return () => {
    s.off(event, handler);
  };
}

export function emitTyping(isTyping: boolean, clientId?: string) {
  getSocket()?.emit('typing', { isTyping, clientId });
}
