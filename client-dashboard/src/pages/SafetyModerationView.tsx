import React, { useMemo, useState, useEffect } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Flag,
  ShieldCheck,
} from 'lucide-react';
import { dashboardApi } from '../services/api';

type ThreadStatus = 'Flagged' | 'Warned' | 'Resolved';
type ThreadFilter = ThreadStatus | 'ALL';

interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  align: 'left' | 'right';
  text: string;
  time: string;
  isFlagged?: boolean;
}

interface ModerationThread {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  queueName: string;
  queuePreview: string;
  queueTime: string;
  queueAvatar: string;
  verifiedBadge?: boolean;
  unreadCount?: number;
  status: ThreadStatus;
  flagReason: string;
  flagSubtext: string;
  dateLabel: string;
  messages: ChatMessage[];
}

const INITIAL_THREADS: ModerationThread[] = [
  {
    id: 'thr-1',
    code: 'CON-481',
    title: 'William Carter  &  Sophia Williams',
    subtitle: 'Private conversation',
    queueName: 'William Carter',
    queuePreview: "You still haven't replied. I'm going...",
    queueTime: '10:34 AM',
    queueAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    verifiedBadge: true,
    unreadCount: 1,
    status: 'Flagged',
    flagReason: 'Repeated unwanted contact',
    flagSubtext: 'Flagged for a thoughtful human review.',
    dateLabel: 'OCTOBER 24, 2024',
    messages: [
      {
        id: 'm1',
        senderName: 'William',
        senderAvatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
        align: 'left',
        text: 'I really enjoyed our conversation yesterday. Are you free to meet this weekend?',
        time: '10:15 AM',
      },
      {
        id: 'm2',
        senderName: 'Sophia',
        senderAvatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        align: 'right',
        text: "Thank you, but I don't think we're the right match. Wishing you the best.",
        time: '10:18 AM',
      },
      {
        id: 'm3',
        senderName: 'William',
        senderAvatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
        align: 'left',
        text: 'Are you sure? I think you should give this another chance.',
        time: '10:20 AM',
      },
      {
        id: 'm4',
        senderName: 'Sophia',
        senderAvatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        align: 'right',
        text: "I'd prefer not to continue this conversation. Please respect that.",
        time: '10:22 AM',
      },
      {
        id: 'm5',
        senderName: 'William',
        senderAvatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
        align: 'left',
        text: "You still haven't replied. I'm going to keep trying.",
        time: '10:34 AM',
        isFlagged: true,
      },
    ],
  },
  {
    id: 'thr-2',
    code: 'CON-479',
    title: 'Daniel Mitchell  &  Kristin Watson',
    subtitle: 'Private conversation',
    queueName: 'Kristin Watson',
    queuePreview: "Let's catch up off-platform on...",
    queueTime: '02:11 PM',
    queueAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    unreadCount: 1,
    status: 'Flagged',
    flagReason: 'Off-platform link solicitation',
    flagSubtext: 'Detected external messaging link shared prior to venue confirmation.',
    dateLabel: 'OCTOBER 24, 2024',
    messages: [
      {
        id: 'k1',
        senderName: 'Daniel',
        senderAvatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        align: 'left',
        text: 'Looking forward to Friday evening at Osteria Verde!',
        time: '02:04 PM',
      },
      {
        id: 'k2',
        senderName: 'Kristin',
        senderAvatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        align: 'right',
        text: "Let's catch up off-platform on this external link before we confirm.",
        time: '02:11 PM',
        isFlagged: true,
      },
    ],
  },
  {
    id: 'thr-3',
    code: 'CON-465',
    title: 'Oliver Thompson  &  Olivia Bennett',
    subtitle: 'Private conversation',
    queueName: 'Oliver Thompson',
    queuePreview: 'Can we move dinner to a private...',
    queueTime: 'Yesterday',
    queueAvatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    status: 'Warned',
    flagReason: 'Non-public venue suggestion',
    flagSubtext: 'Member reminded that all initial dates must take place in public venues.',
    dateLabel: 'OCTOBER 23, 2024',
    messages: [
      {
        id: 'o1',
        senderName: 'Oliver',
        senderAvatar:
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
        align: 'left',
        text: 'Can we move dinner to a private residence instead of the restaurant?',
        time: '06:12 PM',
        isFlagged: true,
      },
      {
        id: 'o2',
        senderName: 'Olivia',
        senderAvatar:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        align: 'right',
        text: 'I prefer keeping our first meeting at a public restaurant as planned.',
        time: '06:19 PM',
      },
    ],
  },
  {
    id: 'thr-4',
    code: 'CON-452',
    title: 'James Alexander  &  Emma Laurent',
    subtitle: 'Private conversation',
    queueName: 'Emma Laurent',
    queuePreview: 'Thanks for confirming our 24h check-in.',
    queueTime: '2 days ago',
    queueAvatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
    status: 'Resolved',
    flagReason: 'Automated keyword check',
    flagSubtext: 'Reviewed by Trust & Safety and cleared as safe.',
    dateLabel: 'OCTOBER 22, 2024',
    messages: [
      {
        id: 'e1',
        senderName: 'James',
        senderAvatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        align: 'left',
        text: 'Just checking in ahead of tomorrow night at 8:00 PM!',
        time: '04:00 PM',
      },
      {
        id: 'e2',
        senderName: 'Emma',
        senderAvatar:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
        align: 'right',
        text: 'Thanks for confirming our 24h check-in. Looking forward to it!',
        time: '04:05 PM',
      },
    ],
  },
];

export function SafetyModerationView() {
  const [threads, setThreads] = useState<ModerationThread[]>(INITIAL_THREADS);
  const [activeFilter, setActiveFilter] = useState<ThreadFilter>('Flagged');
  const [selectedThreadId, setSelectedThreadId] = useState<string>('thr-1');
  const [actionToast, setActionToast] = useState<string | null>(null);

  useEffect(() => {
    async function loadModerationThreads() {
      try {
        const res = await dashboardApi.admin.getModerationThreads();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: ModerationThread[] = res.data.map((offer: any) => {
            const hostName = offer.host?.nickname || 'Host';
            const guestName = offer.guest?.nickname || 'Guest';
            const hostAvatar =
              offer.host?.hostProfile?.photos?.[0] ||
              'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80';
            const guestAvatar =
              offer.guest?.guestProfile?.photos?.[0] ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
            const statusMap: Record<string, ThreadStatus> = {
              FLAGGED: 'Flagged',
              WARNED: 'Warned',
              RESOLVED: 'Resolved',
            };
            const msgs: ChatMessage[] = Array.isArray(offer.messages)
              ? offer.messages.map((m: any) => {
                  const isHostSender = m.senderId === offer.hostId;
                  return {
                    id: m.id,
                    senderName: m.sender?.nickname || (isHostSender ? hostName : guestName),
                    senderAvatar: isHostSender ? hostAvatar : guestAvatar,
                    align: isHostSender ? 'left' : 'right',
                    text: m.content,
                    time: m.createdAt
                      ? new Date(m.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '',
                    isFlagged: Boolean(m.isFlagged),
                  };
                })
              : [];
            const lastMsg = msgs[msgs.length - 1];
            return {
              id: offer.id,
              code: offer.threadCode || 'CON-481',
              title: `${hostName}  &  ${guestName}`,
              subtitle: 'Private conversation',
              queueName: hostName,
              queuePreview: lastMsg?.text || offer.flagReason || 'Flagged conversation',
              queueTime: lastMsg?.time || 'Today',
              queueAvatar: hostAvatar,
              verifiedBadge: Boolean(offer.host?.isVerified),
              unreadCount: offer.moderationStatus === 'FLAGGED' ? 1 : 0,
              status: statusMap[offer.moderationStatus] || 'Flagged',
              flagReason: offer.flagReason || 'Flagged conversation',
              flagSubtext: offer.flagSubtext || 'Flagged for a thoughtful human review.',
              dateLabel: new Date(offer.updatedAt || Date.now())
                .toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
                .toUpperCase(),
              messages: msgs,
            };
          });
          setThreads(mapped);
          setSelectedThreadId(mapped[0].id);
        }
      } catch {
        // Fallback to demo threads if offline
      }
    }
    loadModerationThreads();
  }, []);

  const flaggedCount = threads.filter((t) => t.status === 'Flagged').length;
  const warnedCount = threads.filter((t) => t.status === 'Warned').length;
  const resolvedCount = threads.filter((t) => t.status === 'Resolved').length;

  const visibleThreads = useMemo(() => {
    if (activeFilter === 'ALL') return threads;
    return threads.filter((t) => t.status === activeFilter);
  }, [threads, activeFilter]);

  const activeThread =
    visibleThreads.find((t) => t.id === selectedThreadId) || visibleThreads[0] || null;

  const handleAction = async (
    threadId: string,
    nextStatus: ThreadStatus,
    label: string,
    apiAction: 'SUSPEND' | 'WARN' | 'RESOLVE'
  ) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, status: nextStatus, unreadCount: 0 } : t
      )
    );
    setActionToast(label);
    setTimeout(() => setActionToast(null), 3000);

    try {
      await dashboardApi.admin.moderateThread(threadId, apiAction);
    } catch {
      // Keep optimistic update in demo mode
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-[1.5px] bg-[#9F1E19]" />
          <span className="text-[11px] font-semibold text-[#9F1E19] tracking-wide">
            A Community Worth Caring for
          </span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-[28px] text-[#16120F] leading-tight">
          Safety &amp; Moderation
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6A63] mt-1">
          Thoughtful oversight for a respectful, welcoming community.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveFilter('Flagged')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeFilter === 'Flagged'
                ? 'bg-[#9F1E19] text-white shadow-sm'
                : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
            }`}
          >
            <span>Flagged</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeFilter === 'Flagged'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#EFE7DA] text-[#6E6A63]'
              }`}
            >
              {flaggedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('Warned')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeFilter === 'Warned'
                ? 'bg-[#9F1E19] text-white shadow-sm'
                : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
            }`}
          >
            <span>Warned</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeFilter === 'Warned'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#EFE7DA] text-[#6E6A63]'
              }`}
            >
              {warnedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('Resolved')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeFilter === 'Resolved'
                ? 'bg-[#9F1E19] text-white shadow-sm'
                : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
            }`}
          >
            <span>Resolved</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeFilter === 'Resolved'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#EFE7DA] text-[#6E6A63]'
              }`}
            >
              {resolvedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeFilter === 'ALL'
                ? 'bg-[#9F1E19] text-white shadow-sm'
                : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
            }`}
          >
            <span>All threads</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeFilter === 'ALL'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#EFE7DA] text-[#6E6A63]'
              }`}
            >
              {threads.length}
            </span>
          </button>
        </div>

        {actionToast && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {actionToast}
          </span>
        )}
      </div>

      {/* Split-Pane Moderation Card */}
      <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* Left Sidebar: Conversation Queue */}
        <div className="lg:col-span-4 xl:col-span-3 border-b lg:border-b-0 lg:border-r border-[#E5DDD0] flex flex-col">
          <div className="p-4 sm:p-5 border-b border-[#E5DDD0]/70">
            <h2 className="font-serif font-bold text-sm text-[#16120F]">
              Conversation queue
            </h2>
            <p className="text-[11px] text-[#6E6A63] mt-0.5">
              {visibleThreads.length}{' '}
              {visibleThreads.length === 1 ? 'thread' : 'threads'}
            </p>
          </div>

          <div className="p-3 space-y-2 flex-1 overflow-y-auto">
            {visibleThreads.length === 0 ? (
              <p className="text-xs text-[#6E6A63] text-center py-8">
                No conversations in this queue.
              </p>
            ) : (
              visibleThreads.map((thread) => {
                const isSelected = activeThread?.id === thread.id;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-[#F5F1E6] border border-[#9F1E19]/60 shadow-sm'
                        : 'hover:bg-[#F5F1E6]/60 border border-transparent'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={thread.queueAvatar}
                        alt={thread.queueName}
                        className="w-10 h-10 rounded-full object-cover border border-[#E5DDD0]"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#FAF7F2]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-[#16120F] truncate flex items-center gap-1">
                          <span className="truncate">{thread.queueName}</span>
                          {thread.verifiedBadge && (
                            <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white inline-flex items-center justify-center text-[8px] shrink-0">
                              ✓
                            </span>
                          )}
                        </p>
                        <span className="text-[10px] text-[#8A857D] shrink-0">
                          {thread.queueTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-[11px] text-[#6E6A63] truncate">
                          {thread.queuePreview}
                        </p>
                        {thread.unreadCount ? (
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {thread.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Conversation Review */}
        {activeThread ? (
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between">
            {/* Thread Header */}
            <div className="px-5 py-4 border-b border-[#E5DDD0]/80 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-base sm:text-lg text-[#16120F]">
                  {activeThread.title}
                </h2>
                <p className="text-[11px] text-[#8A857D]">
                  {activeThread.code} · {activeThread.subtitle}
                </p>
              </div>

              {activeThread.status === 'Flagged' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBEFF0] border border-[#F3C5C7] text-[#9F1E19] text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9F1E19]" />
                  Flagged
                </span>
              )}
              {activeThread.status === 'Warned' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF6E4] border border-[#F2DFB0] text-[#B7791F] text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B7791F]" />
                  Warned
                </span>
              )}
              {activeThread.status === 'Resolved' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Resolved
                </span>
              )}
            </div>

            {/* Thread Body */}
            <div className="p-5 sm:p-6 space-y-5 flex-1 overflow-y-auto">
              {/* Alert Banner */}
              <div className="bg-[#FDF6E4] border border-[#F2DFB0] rounded-xl px-4 py-3 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[#B7791F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#8B5E12]">
                    {activeThread.flagReason}
                  </p>
                  <p className="text-[11px] text-[#9C7428] mt-0.5">
                    {activeThread.flagSubtext}
                  </p>
                </div>
              </div>

              {/* Date Divider */}
              <div className="text-center">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A857D]">
                  {activeThread.dateLabel}
                </span>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                {activeThread.messages.map((msg) => {
                  const isRight = msg.align === 'right';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isRight ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 mb-1 ${
                          isRight ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-6 h-6 rounded-full object-cover border border-[#E5DDD0]"
                        />
                        <span className="text-[11px] font-semibold text-[#16120F]">
                          {msg.senderName}
                        </span>
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          msg.isFlagged
                            ? 'bg-[#FBEFF0] border border-[#F3C5C7] text-[#16120F]'
                            : 'bg-[#EFE7DA] text-[#16120F]'
                        } ${isRight ? 'mr-8' : 'ml-8'}`}
                      >
                        <p>{msg.text}</p>
                        {msg.isFlagged && (
                          <p className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#9F1E19]">
                            <Flag className="w-3 h-3" />
                            Flagged message
                          </p>
                        )}
                      </div>

                      <span
                        className={`text-[10px] text-[#8A857D] mt-1 ${
                          isRight ? 'mr-8' : 'ml-8'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Moderation Action Bar */}
            <div className="px-5 py-3.5 border-t border-[#E5DDD0]/80 bg-[#FAF7F2] flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#6E6A63]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8A857D]" />
                Your review makes a difference.
              </span>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    handleAction(
                      activeThread.id,
                      'Resolved',
                      `Account suspended & ${activeThread.code} resolved`,
                      'SUSPEND'
                    )
                  }
                  className="text-xs font-semibold text-[#9F1E19] hover:underline px-2 py-1.5 cursor-pointer"
                >
                  Suspend account
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleAction(
                      activeThread.id,
                      'Warned',
                      `Warning issued for ${activeThread.code}`,
                      'WARN'
                    )
                  }
                  className="px-4 py-1.5 rounded-full bg-white border border-[#E5DDD0] hover:border-[#9F1E19] text-xs font-semibold text-[#16120F] transition-colors cursor-pointer"
                >
                  Issue warning
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleAction(
                      activeThread.id,
                      'Resolved',
                      `${activeThread.code} marked as Resolved`,
                      'RESOLVE'
                    )
                  }
                  className="px-4 py-1.5 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Resolve
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 xl:col-span-9 flex items-center justify-center p-10 text-center">
            <div>
              <p className="font-serif font-semibold text-base text-[#16120F]">
                Select a conversation to review
              </p>
              <p className="text-xs text-[#6E6A63] mt-1">
                All flagged or warned conversations will appear in the queue on the left.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
