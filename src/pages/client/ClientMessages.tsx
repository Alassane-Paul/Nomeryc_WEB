import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Send, CheckCheck, Loader2, Paperclip, X } from 'lucide-react';
import { messagesService, Message, MessageAttachment } from '../../services/messages.service';
import { uploadsService } from '../../services/uploads.service';
import { connectSocket, onSocketEvent, emitTyping } from '../../services/socket.service';
import { MessageAttachments } from '../../components/chat/MessageAttachments';
import { useAuthStore } from '../../store/useAuthStore';

export function ClientMessages() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [adminTyping, setAdminTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadMessages = useCallback(async () => {
    try {
      const data = await messagesService.getConversation();
      setMessages((current) => {
        const byId = new Map<string, Message>();
        for (const message of (data || []).filter((m): m is Message => Boolean(m && m.id))) {
          byId.set(message.id, message);
        }
        for (const message of current) {
          byId.set(message.id, message);
        }
        return [...byId.values()].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial + marquage comme lu
  useEffect(() => {
    loadMessages();
    messagesService.markAllAsRead().catch(() => {});
  }, [loadMessages]);

  useEffect(() => {
    const refreshVisibleConversation = () => {
      if (document.visibilityState === 'visible') {
        loadMessages();
      }
    };

    const intervalId = window.setInterval(refreshVisibleConversation, 2000);
    window.addEventListener('focus', refreshVisibleConversation);
    document.addEventListener('visibilitychange', refreshVisibleConversation);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshVisibleConversation);
      document.removeEventListener('visibilitychange', refreshVisibleConversation);
    };
  }, [loadMessages]);

  // ===== TEMPS RÉEL =====
  useEffect(() => {
    connectSocket();

    const offNew = onSocketEvent<Message>('message:new', (msg) => {
      if (!msg || !msg.id) return; // payload malformé : on ignore plutôt que de crasher le rendu
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
      // Message reçu de l'équipe pendant qu'on est sur la page → lu immédiatement.
      if (msg.senderId !== user?.id) {
        messagesService.markAllAsRead().catch(() => {});
      }
    });

    const offRead = onSocketEvent<{ ids?: string[]; all?: boolean }>('message:read', (payload) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === user?.id && (payload.all || payload.ids?.includes(m.id)) ? { ...m, isRead: true } : m
        )
      );
    });

    const offDeleted = onSocketEvent<{ id: string }>('message:deleted', ({ id }) => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    });

    const offTyping = onSocketEvent<{ isTyping: boolean }>('typing', ({ isTyping }) => {
      setAdminTyping(isTyping);
    });

    return () => {
      offNew();
      offRead();
      offDeleted();
      offTyping();
    };
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, adminTyping]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    emitTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitTyping(false), 1500);
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setPendingFiles(files);
    e.target.value = '';
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!text.trim() && pendingFiles.length === 0) || sending) return;

    const content = text.trim() || '(pièce jointe)';
    const files = pendingFiles;
    setText('');
    setPendingFiles([]);
    setSending(true);
    emitTyping(false);

    try {
      let attachments: MessageAttachment[] | undefined;
      if (files.length > 0) {
        setUploadProgress(0);
        attachments = await uploadsService.uploadMany(files, setUploadProgress);
      }
      const sent = await messagesService.send({ content, attachments });
      if (sent && sent.id) setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
      await loadMessages();
    } catch {
      setText(content === '(pièce jointe)' ? '' : content);
      setPendingFiles(files);
    } finally {
      setSending(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col card-glass border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-brand-card/80 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-purple/30 border border-brand-purple flex items-center justify-center font-bold text-white">
            NP
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Support & Chef de Projet Nomeryc</h2>
            {adminTyping && <p className="text-[11px] text-brand-green">en train d'écrire...</p>}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            Aucun message pour l'instant. Écrivez-nous !
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2 max-w-[80%] md:max-w-[65%]">
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-brand-purple/40 text-brand-green text-xs font-bold flex items-center justify-center shrink-0">
                      NP
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'bg-brand-purple text-white rounded-br-none shadow-md shadow-brand-purple/20'
                        : 'bg-brand-card/90 text-gray-200 border border-white/5 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                    <MessageAttachments attachments={msg.attachments} isMe={isMe} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400 px-2">
                  <span>{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && msg.isRead && <CheckCheck className="w-3 h-3 text-brand-green" />}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fichiers en attente */}
      {pendingFiles.length > 0 && (
        <div className="px-4 pt-3 flex flex-wrap gap-2 bg-brand-card/80 border-t border-white/10">
          {pendingFiles.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">
              <span className="truncate max-w-[160px]">{f.name}</span>
              <button type="button" onClick={() => setPendingFiles((p) => p.filter((_, j) => j !== i))}>
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
              </button>
            </div>
          ))}
          {uploadProgress !== null && <span className="text-xs text-brand-green self-center">{uploadProgress}%</span>}
        </div>
      )}

      {/* Barre d'envoi */}
      <form onSubmit={handleSend} className="p-4 bg-brand-card/80 border-t border-white/10 flex items-center gap-3">
        <input ref={fileInputRef} type="file" multiple hidden onChange={handleFilesSelected} />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          title="Joindre un fichier (5 max, 10 Mo chacun)"
        >
          <Paperclip className="w-5 h-5 text-gray-400" />
        </button>
        <input
          type="text"
          placeholder="Écrivez un message..."
          value={text}
          onChange={handleTextChange}
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
        />
        <button
          type="submit"
          disabled={(!text.trim() && pendingFiles.length === 0) || sending}
          className="btn-primary p-3 rounded-xl font-semibold disabled:opacity-50 transition-all flex items-center justify-center"
        >
          {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
}
