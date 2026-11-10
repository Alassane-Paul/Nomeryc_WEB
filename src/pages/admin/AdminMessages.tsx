import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Send, MessageSquare, Search, CheckCheck, Loader2, Paperclip, X } from 'lucide-react';
import { messagesService, Message, Conversation, MessageAttachment } from '../../services/messages.service';
import { uploadsService } from '../../services/uploads.service';
import { connectSocket, onSocketEvent, emitTyping } from '../../services/socket.service';
import { MessageAttachments } from '../../components/chat/MessageAttachments';
import { useAuthStore } from '../../store/useAuthStore';

export function AdminMessages() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [typingClientId, setTypingClientId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref pour lire la sélection courante dans les handlers socket sans les recréer.
  const selectedRef = useRef<string | null>(null);
  selectedRef.current = selectedClientId;

  const loadConversations = useCallback(async () => {
    try {
      setConversations(await messagesService.getConversations());
    } catch {
      // silencieux
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const loadMessages = useCallback(async (clientId: string) => {
    try {
      const data = await messagesService.getConversationWithClient(clientId);
      if (selectedRef.current !== clientId) return;

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
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedClientId) return;
    setMessages([]);
    loadMessages(selectedClientId);
    messagesService.markAllAsRead(selectedClientId).then(loadConversations).catch(() => {});
  }, [selectedClientId, loadMessages, loadConversations]);

  useEffect(() => {
    if (!selectedClientId) return;

    const refreshVisibleConversation = () => {
      if (document.visibilityState === 'visible') {
        loadMessages(selectedClientId);
        loadConversations();
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
  }, [selectedClientId, loadMessages, loadConversations]);

  useEffect(() => {
    if (!selectedClientId && conversations.length > 0) {
      setSelectedClientId(conversations[0].client.id);
    }
  }, [conversations, selectedClientId]);

  // ===== TEMPS RÉEL =====
  useEffect(() => {
    connectSocket();

    const offNew = onSocketEvent<Message>('message:new', (msg) => {
      if (!msg || !msg.id) return; // payload malformé : on ignore plutôt que de crasher le rendu

      const current = selectedRef.current;
      const belongsToOpenThread = msg.senderId === current || msg.recipientId === current;

      if (belongsToOpenThread) {
        setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        if (msg.senderId === current) {
          messagesService.markAllAsRead(current).catch(() => {});
        }
      }
      loadConversations(); // rafraîchit dernier message + badges non-lus
    });

    const offRead = onSocketEvent<{ ids?: string[]; all?: boolean }>('message:read', (payload) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === user?.id && (payload.all || payload.ids?.includes(m.id)) ? { ...m, isRead: true } : m
        )
      );
      loadConversations();
    });

    const offDeleted = onSocketEvent<{ id: string }>('message:deleted', ({ id }) => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      loadConversations();
    });

    const offTyping = onSocketEvent<{ isTyping: boolean; clientId?: string }>('typing', ({ isTyping, clientId }) => {
      setTypingClientId(isTyping && clientId ? clientId : null);
    });

    return () => {
      offNew();
      offRead();
      offDeleted();
      offTyping();
    };
  }, [user?.id, loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingClientId]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (!selectedClientId) return;
    emitTyping(true, selectedClientId);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitTyping(false, selectedClientId), 1500);
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingFiles(Array.from(e.target.files || []).slice(0, 5));
    e.target.value = '';
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!text.trim() && pendingFiles.length === 0) || sending || !selectedClientId) return;

    const content = text.trim() || '(pièce jointe)';
    const files = pendingFiles;
    setText('');
    setPendingFiles([]);
    setSending(true);
    emitTyping(false, selectedClientId);

    try {
      let attachments: MessageAttachment[] | undefined;
      if (files.length > 0) {
        setUploadProgress(0);
        attachments = await uploadsService.uploadMany(files, setUploadProgress);
      }
      const sent = await messagesService.send({ recipientId: selectedClientId, content, attachments });
      if (sent && sent.id) setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
      await Promise.all([loadMessages(selectedClientId), loadConversations()]);
    } catch {
      setText(content === '(pièce jointe)' ? '' : content);
      setPendingFiles(files);
    } finally {
      setSending(false);
      setUploadProgress(null);
    }
  };

  const filtered = conversations.filter((conv) =>
    `${conv.client.firstName} ${conv.client.lastName} ${conv.client.company ?? ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectedConv = conversations.find((c) => c.client.id === selectedClientId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Messages</h1>
        <p className="text-gray-400 text-sm mt-1">Échangez avec vos clients en temps réel.</p>
      </div>

      <div className="flex h-[calc(100vh-14rem)] bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 shrink-0 border-r border-surface-border flex flex-col">
          <div className="p-4 border-b border-surface-border">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-10 px-4">Aucune conversation pour l'instant.</div>
            ) : (
              filtered.map((conv) => {
                const isSelected = conv.client.id === selectedClientId;
                return (
                  <button
                    key={conv.client.id}
                    onClick={() => setSelectedClientId(conv.client.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-b border-white/5 ${
                      isSelected ? 'bg-brand-purple/20' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-brand-purple/30 text-brand-purple-light font-bold flex items-center justify-center text-sm shrink-0 border border-brand-purple/30">
                      {conv.client.firstName[0]}{conv.client.lastName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-semibold text-white truncate">
                          {conv.client.firstName} {conv.client.lastName}
                        </p>
                        <span className="text-[10px] text-gray-500 shrink-0 ml-1">
                          {new Date(conv.lastMessage.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-400 truncate">
                          {typingClientId === conv.client.id ? (
                            <span className="text-brand-green">en train d'écrire...</span>
                          ) : (
                            conv.lastMessage.content
                          )}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-purple text-white text-[10px] font-bold flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-surface-card shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-purple/30 text-brand-purple-light font-bold flex items-center justify-center text-sm border border-brand-purple/30">
                  {selectedConv.client.firstName[0]}{selectedConv.client.lastName[0]}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {selectedConv.client.firstName} {selectedConv.client.lastName}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {typingClientId === selectedConv.client.id ? (
                      <span className="text-brand-green">en train d'écrire...</span>
                    ) : (
                      selectedConv.client.company
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-end gap-2 max-w-[75%]">
                      {!isMe && (
                        <div className="w-7 h-7 rounded-full bg-brand-purple/30 text-brand-purple-light text-xs font-bold flex items-center justify-center shrink-0">
                          {selectedConv.client.firstName[0]}{selectedConv.client.lastName[0]}
                        </div>
                      )}
                      <div
                        className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? 'bg-brand-purple text-white rounded-br-none shadow-md'
                            : 'bg-white/8 text-gray-200 border border-white/10 rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                        <MessageAttachments attachments={msg.attachments} isMe={isMe} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500 px-2">
                      <span>{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && msg.isRead && <CheckCheck className="w-3 h-3 text-brand-green" />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {pendingFiles.length > 0 && (
              <div className="px-4 pt-3 flex flex-wrap gap-2 border-t border-surface-border">
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

            <form onSubmit={handleSend} className="p-4 border-t border-surface-border flex items-center gap-3 shrink-0">
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
                placeholder="Écrire un message..."
                value={text}
                onChange={handleTextChange}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-colors"
              />
              <button
                type="submit"
                disabled={(!text.trim() && pendingFiles.length === 0) || sending}
                className="btn-primary p-3 rounded-xl disabled:opacity-50 flex items-center justify-center"
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">{loadingConversations ? 'Chargement...' : 'Sélectionnez une conversation'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
