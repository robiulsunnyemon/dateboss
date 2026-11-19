import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Send,
  CheckCircle2,
  Flag,
  MessageCircle,
  Loader2,
  Camera,
  Phone,
  Video,
} from 'lucide-react';
import { api } from '../../services/api';
import { getSocket } from '../../services/socket';
import { useAuth } from '../../context/AuthContext';

export interface ChatContact {
  offerId: string;
  partnerId: string;
  name: string;
  avatar: string;
  venueName: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  verified: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  isFlagged?: boolean;
}

export interface MessagesChatViewProps {
  onClose: () => void;
  initialContactName?: string;
  initialOfferId?: string;
}

const QUICK_REPLIES = [
  'Looking forward to our table!',
  'I will be dressed cocktail elegant.',
  "Let's meet by the lounge bar",
];

function formatMsgTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function MessagesChatView({
  onClose,
  initialContactName,
  initialOfferId,
}: MessagesChatViewProps) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [activeOfferId, setActiveOfferId] = useState<string>(initialOfferId || '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>(
    initialOfferId || initialContactName ? 'chat' : 'list'
  );
  const [isUploadingLivePhoto, setIsUploadingLivePhoto] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const liveCameraRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLiveCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeOfferId) return;

    setIsUploadingLivePhoto(true);
    showToast('Uploading live camera selfie...');
    try {
      const res = await api.upload.uploadImage(file, 'chat_selfies');
      if (res.success && res.data?.url) {
        await handleSendMessage(`📸 Live Camera Selfie (Verified)\n${res.data.url}`);
        showToast('Live selfie sent successfully!');
      } else {
        showToast('Failed to upload live photo.');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to capture live photo.');
    } finally {
      setIsUploadingLivePhoto(false);
      if (liveCameraRef.current) liveCameraRef.current.value = '';
    }
  };

  // Load unlocked conversations
  const loadConversations = useCallback(async () => {
    setIsLoadingContacts(true);
    try {
      const res = await api.messages.getConversations();
      if (res.success && Array.isArray(res.data)) {
        const mapped: ChatContact[] = res.data.map((c: any) => ({
          offerId: c.offerId,
          partnerId: c.partner?.id || '',
          name: c.partner?.name || 'Member',
          avatar: c.partner?.avatar || '/assets/discover-card-1.jpg',
          venueName: c.venueName || 'Confirmed Date',
          lastMessage: c.lastMessage?.content || `Date confirmed at ${c.venueName || 'venue'}`,
          time: formatMsgTime(c.lastMessage?.createdAt),
          unreadCount: Number(c.unreadCount) || 0,
          verified: Boolean(c.partner?.isVerified),
        }));
        setContacts(mapped);

        if (mapped.length > 0) {
          if (initialOfferId && mapped.some((c) => c.offerId === initialOfferId)) {
            setActiveOfferId(initialOfferId);
          } else if (initialContactName) {
            const found = mapped.find((c) =>
              c.name.toLowerCase().includes(initialContactName.toLowerCase())
            );
            setActiveOfferId(found ? found.offerId : mapped[0].offerId);
          } else {
            setActiveOfferId((prev) =>
              prev && mapped.some((c) => c.offerId === prev) ? prev : mapped[0].offerId
            );
          }
        }
      } else {
        setContacts([]);
      }
    } catch {
      setContacts([]);
    } finally {
      setIsLoadingContacts(false);
    }
  }, [initialOfferId, initialContactName]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages for selected offerId & wire Socket.io room
  useEffect(() => {
    if (!activeOfferId) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    setIsLoadingMessages(true);

    api.messages
      .getMessages(activeOfferId)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && Array.isArray(res.data)) {
          setMessages(
            res.data.map((m: any) => ({
              id: m.id,
              senderId: m.senderId,
              sender: m.senderId === user?.id ? 'me' : 'them',
              text: m.content,
              time: formatMsgTime(m.createdAt),
              isFlagged: Boolean(m.isFlagged),
            }))
          );
          setContacts((prev) =>
            prev.map((c) => (c.offerId === activeOfferId ? { ...c, unreadCount: 0 } : c))
          );
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoadingMessages(false);
      });

    const socket = getSocket();
    if (socket) {
      socket.emit('join_offer', activeOfferId);

      const handleNewMessage = (incoming: any) => {
        if (incoming.offerId && incoming.offerId !== activeOfferId) return;
        const formatted: ChatMessage = {
          id: incoming.id,
          senderId: incoming.senderId,
          sender: incoming.senderId === user?.id ? 'me' : 'them',
          text: incoming.content,
          time: formatMsgTime(incoming.createdAt),
          isFlagged: Boolean(incoming.isFlagged),
        };
        setMessages((prev) =>
          prev.some((m) => m.id === formatted.id) ? prev : [...prev, formatted]
        );
        setContacts((prev) =>
          prev.map((c) =>
            c.offerId === activeOfferId
              ? { ...c, lastMessage: formatted.text, time: formatted.time }
              : c
          )
        );
      };

      const handleTyping = (payload: { userId: string; offerId: string; isTyping: boolean }) => {
        if (payload.offerId === activeOfferId && payload.userId !== user?.id) {
          setPartnerTyping(Boolean(payload.isTyping));
        }
      };

      socket.on('new_message', handleNewMessage);
      socket.on('user_typing', handleTyping);

      return () => {
        isMounted = false;
        socket.emit('leave_offer', activeOfferId);
        socket.off('new_message', handleNewMessage);
        socket.off('user_typing', handleTyping);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [activeOfferId, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, partnerTyping]);

  const activeContact = contacts.find((c) => c.offerId === activeOfferId) || null;
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputMessage).trim();
    if (!text || !activeOfferId || isSending) return;

    setIsSending(true);
    setInputMessage('');
    const socket = getSocket();
    socket?.emit('typing', { offerId: activeOfferId, isTyping: false });

    try {
      const res = await api.messages.sendMessage(activeOfferId, text);
      if (res.success && res.data) {
        const m = res.data;
        const formatted: ChatMessage = {
          id: m.id,
          senderId: m.senderId,
          sender: 'me',
          text: m.content,
          time: formatMsgTime(m.createdAt),
        };
        setMessages((prev) =>
          prev.some((existing) => existing.id === formatted.id) ? prev : [...prev, formatted]
        );
        setContacts((prev) =>
          prev.map((c) =>
            c.offerId === activeOfferId
              ? { ...c, lastMessage: formatted.text, time: formatted.time }
              : c
          )
        );
      }
    } catch (err: any) {
      showToast(err?.message || 'Unable to send message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleFlagLatestMessage = async () => {
    setMenuOpen(false);
    const partnerMessages = messages.filter((m) => m.sender === 'them');
    const target = partnerMessages[partnerMessages.length - 1] || messages[messages.length - 1];
    if (!target) {
      showToast('No messages available to flag.');
      return;
    }
    try {
      await api.messages.flagMessage(target.id, 'Inappropriate or unwanted contact');
      setMessages((prev) =>
        prev.map((m) => (m.id === target.id ? { ...m, isFlagged: true } : m))
      );
      showToast('Message flagged for Trust & Safety review.');
    } catch (err: any) {
      showToast(err?.message || 'Unable to flag message.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] sm:bg-[#EFE7DA] flex flex-col sm:items-center sm:justify-center overflow-hidden font-sans antialiased text-[#16120F] animate-in fade-in duration-200">
      <div className="w-full max-w-[1040px] h-[100dvh] sm:h-[88vh] sm:max-h-[820px] sm:min-h-[660px] bg-[#FAF7F2] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-0 sm:p-7 lg:p-8 shadow-none sm:shadow-[0_10px_35px_rgba(22,18,15,0.05)] flex flex-col overflow-hidden">
        {/* DESKTOP HEADER */}
        <div className="hidden sm:flex items-center gap-3 pb-4 border-b border-[#EADBCA]/70 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
            aria-label="Back to Discover"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="flex items-center gap-2 select-none"
          >
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </a>
        </div>

        <div className="flex-1 flex overflow-hidden sm:pt-4 h-full">
          {/* LEFT COLUMN: CHAT LIST */}
          <div
            className={`w-full sm:w-[330px] lg:w-[350px] shrink-0 flex flex-col h-full sm:border-r sm:border-[#EADBCA]/70 overflow-hidden ${
              mobileView === 'list' ? 'flex' : 'hidden sm:flex'
            }`}
          >
            {/* Mobile Header */}
            <div className="sm:hidden p-4 flex items-center gap-3.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
                aria-label="Back to Discover"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="font-serif font-bold text-2xl text-[#16120F] tracking-tight">
                Messages
              </h1>
            </div>

            {/* Search */}
            <div className="px-4 sm:px-0 sm:pr-6 mt-1 sm:mt-0 mb-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8A857D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name"
                  className="w-full bg-[#F5EFE6] sm:bg-[#FAF7F2] border border-[#E5DDD0] rounded-full pl-9 pr-4 py-2 text-xs sm:text-[13px] text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19]"
                />
              </div>
            </div>

            <div className="px-4 sm:px-0 sm:pr-6 mt-2 mb-2 shrink-0">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#16120F]">
                Chats
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-0 sm:pr-6 space-y-1.5 pb-6">
              {isLoadingContacts ? (
                <div className="py-10 flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-[#9F1E19]" />
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#E5DDD0] text-center text-xs text-[#6E6A63]">
                  Messages unlock once a date offer is accepted.
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const isActive = contact.offerId === activeOfferId;
                  return (
                    <div
                      key={contact.offerId}
                      onClick={() => {
                        setActiveOfferId(contact.offerId);
                        setMobileView('chat');
                      }}
                      className={`flex items-center gap-3 p-2.5 rounded-[20px] cursor-pointer transition-all active:scale-[0.99] ${
                        isActive
                          ? 'bg-[#F5EFE6] border border-[#E09094]/40 shadow-2xs'
                          : 'hover:bg-[#F5EFE6]/70 border border-transparent'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-11 h-11 rounded-full object-cover border border-[#E5DDD0]"
                        />
                        <span className="w-2.5 h-2.5 bg-[#22C55E] border-2 border-white rounded-full absolute bottom-0 right-0" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="font-semibold text-xs sm:text-[13px] text-[#16120F] truncate">
                              {contact.name}
                            </span>
                            {contact.verified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-[#8A857D] shrink-0">
                            {contact.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className="text-[11px] text-[#6E6A63] truncate">
                            {contact.lastMessage}
                          </p>
                          {contact.unreadCount > 0 && (
                            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#9F1E19] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: ACTIVE CHAT */}
          <div
            className={`flex-1 flex flex-col h-full overflow-hidden sm:pl-6 ${
              mobileView === 'chat' ? 'flex' : 'hidden sm:flex'
            }`}
          >
            {!activeContact ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MessageCircle className="w-10 h-10 text-[#9F1E19]/50 mb-3" />
                <h3 className="font-serif font-bold text-lg text-[#16120F]">
                  Chat Opens After Yes
                </h3>
                <p className="text-xs text-[#6E6A63] max-w-sm mt-1 leading-relaxed">
                  Private messaging unlocks automatically once a date offer is accepted.
                </p>
              </div>
            ) : (
              <>
                {/* Active Chat Header */}
                <div className="px-4 sm:px-0 py-3 sm:py-0 sm:pb-3 border-b border-[#EADBCA]/70 flex items-center justify-between shrink-0 relative">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMobileView('list')}
                      className="sm:hidden w-9 h-9 rounded-xl bg-[#9F1E19] text-white flex items-center justify-center"
                      aria-label="Back to chats"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <img
                      src={activeContact.avatar}
                      alt={activeContact.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#E5DDD0]"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#16120F] flex items-center gap-1.5">
                        <span>{activeContact.name}</span>
                        {activeContact.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                        )}
                      </h3>
                      <p className="text-[11px] text-[#6E6A63]">
                        {partnerTyping ? 'Typing...' : activeContact.venueName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => showToast(`Calling ${activeContact.name}... Voice call request sent.`)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-[#F5EFE6] text-[#6E6A63] hover:text-[#9F1E19] flex items-center justify-center cursor-pointer transition-colors"
                      title="Voice Call"
                      aria-label="Voice Call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast(`Connecting video with ${activeContact.name}... Video call request sent.`)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-[#F5EFE6] text-[#6E6A63] hover:text-[#9F1E19] flex items-center justify-center cursor-pointer transition-colors"
                      title="Video Call"
                      aria-label="Video Call"
                    >
                      <Video className="w-4 h-4" />
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-[#F5EFE6] text-[#6E6A63] flex items-center justify-center cursor-pointer"
                        aria-label="Chat options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpen && (
                        <div className="absolute right-0 mt-1 w-48 bg-[#FAF7F2] border border-[#E5DDD0] rounded-xl shadow-lg py-1 z-30">
                          <button
                            type="button"
                            onClick={handleFlagLatestMessage}
                            className="w-full px-4 py-2 text-left text-xs font-semibold text-[#9F1E19] hover:bg-[#F5EFE6] flex items-center gap-2 cursor-pointer"
                          >
                            <Flag className="w-3.5 h-3.5" />
                            <span>Flag for Safety Review</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-0 py-4 space-y-3">
                  {isLoadingMessages ? (
                    <div className="py-12 flex justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-[#9F1E19]" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-10 text-center text-xs text-[#6E6A63]">
                      Say hello to confirm your plans for {activeContact.venueName}!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender === 'me';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[82%] sm:max-w-[72%] px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                              isMe
                                ? 'bg-[#9F1E19] text-white rounded-br-sm'
                                : msg.isFlagged
                                ? 'bg-[#FBEFF0] border border-[#F3C5C7] text-[#16120F] rounded-bl-sm'
                                : 'bg-[#F5EFE6] border border-[#E5DDD0] text-[#16120F] rounded-bl-sm'
                            }`}
                          >
                            {msg.text.startsWith('📸 Live Camera Selfie') ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-xs font-semibold">
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>Live Camera Selfie (Verified)</span>
                                </div>
                                {msg.text.split('\n')[1] && (
                                  <img
                                    src={msg.text.split('\n')[1].trim()}
                                    alt="Live Selfie"
                                    className="rounded-xl max-h-56 max-w-full object-cover border border-white/20"
                                  />
                                )}
                              </div>
                            ) : (
                              <p>{msg.text}</p>
                            )}
                            {msg.isFlagged && (
                              <p className="mt-1 text-[10px] font-semibold text-[#9F1E19] inline-flex items-center gap-1">
                                <Flag className="w-3 h-3" /> Flagged for review
                              </p>
                            )}
                          </div>
                          {msg.time && (
                            <span className="text-[10px] text-[#8A857D] mt-1 px-1">
                              {msg.time}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Quick Replies + Input */}
                <div className="px-4 sm:px-0 pt-2 pb-4 sm:pb-0 border-t border-[#EADBCA]/70 shrink-0 space-y-2.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {QUICK_REPLIES.map((qr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(qr)}
                        className="px-3 py-1 rounded-full bg-[#F5EFE6] hover:bg-[#EFE7DA] border border-[#E5DDD0] text-[11px] font-medium text-[#16120F] whitespace-nowrap cursor-pointer"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>

                  {/* Hidden camera input: direct front camera selfie, preventing gallery upload */}
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    ref={liveCameraRef}
                    onChange={handleLiveCameraCapture}
                    className="hidden"
                  />

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => liveCameraRef.current?.click()}
                      disabled={isUploadingLivePhoto || isSending}
                      className="w-10 h-10 rounded-full bg-[#F5EFE6] hover:bg-[#EFE7DA] text-[#6E6A63] hover:text-[#9F1E19] border border-[#E5DDD0] flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:opacity-50"
                      title="Take Live Camera Selfie (Instant verification)"
                      aria-label="Take Live Camera Selfie"
                    >
                      {isUploadingLivePhoto ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#9F1E19]" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </button>

                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => {
                        setInputMessage(e.target.value);
                        getSocket()?.emit('typing', {
                          offerId: activeOfferId,
                          isTyping: e.target.value.length > 0,
                        });
                      }}
                      placeholder={`Message ${activeContact.name}...`}
                      className="flex-1 bg-[#F5EFE6] border border-[#E5DDD0] rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19]"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !inputMessage.trim()}
                      className="w-10 h-10 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:opacity-50"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#16120F] text-white text-xs px-5 py-3 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

export default MessagesChatView;
