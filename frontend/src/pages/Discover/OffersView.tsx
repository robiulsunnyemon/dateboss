import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  ShieldCheck,
  Check,
  Loader2,
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { api } from '../../services/api';
import { CounterOfferModal } from './CounterOfferModal';

export type OfferFilterType = 'sent' | 'counter' | 'pass' | 'received' | 'expired';

export interface OfferItem {
  id: string;
  rawStatus: string;
  statusHeader: string;
  statusType: 'awaiting' | 'accepted' | 'counter' | 'pass' | 'expired';
  statusBadgeText?: string;
  remainingTime?: string;
  userName: string;
  userAvatar: string;
  reliability: number;
  isVerified: boolean;
  occasion: string;
  timeText: string;
  escrowAmount: number;
  venueName: string;
  venueLocation: string;
  note: string;
  chatOpen?: boolean;
  counterVenue?: string;
  counterTime?: string;
  counterNote?: string;
}

interface OffersViewProps {
  onNavigateExplore?: () => void;
  onOpenChat?: (offer: OfferItem) => void;
}

function parseEscrowAmount(guarantee?: string | null): number {
  if (!guarantee) return 150;
  const match = guarantee.match(/\$(\d+)/);
  return match ? Number(match[1]) : 150;
}

function formatRemaining(expiresAt?: string): string | undefined {
  if (!expiresAt) return undefined;
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return 'Expired';
  const totalMins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return `~${hrs}h ${mins}m remaining`;
}

function formatDateTime(dt?: string): string {
  if (!dt) return 'Upcoming Evening';
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return dt;
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function OffersView({ onNavigateExplore, onOpenChat }: OffersViewProps) {
  const { isGuest } = useRole();
  const [activeFilter, setActiveFilter] = useState<OfferFilterType>(
    isGuest ? 'received' : 'sent'
  );
  const [allOffers, setAllOffers] = useState<OfferItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeCounterOffer, setActiveCounterOffer] = useState<OfferItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  useEffect(() => {
    setActiveFilter(isGuest ? 'received' : 'sent');
  }, [isGuest]);

  const loadOffers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.offers.getAll();
      if (res.success && Array.isArray(res.data)) {
        const mapped: OfferItem[] = res.data.map((raw: any) => {
          const counterpart = isGuest ? raw.host : raw.guest;
          const counterpartProfile = isGuest
            ? counterpart?.hostProfile
            : counterpart?.guestProfile;
          const rawStatus: string = raw.status || 'PENDING';

          let statusType: OfferItem['statusType'] = 'awaiting';
          let statusHeader = isGuest ? 'Awaiting your decision' : 'Awaiting Guest Decision';
          let statusBadgeText: string | undefined;

          if (rawStatus === 'ACCEPTED') {
            statusType = 'accepted';
            statusHeader = 'Invitation Accepted · Date Confirmed';
            statusBadgeText = 'Chat Unlocked';
          } else if (rawStatus === 'COUNTERED') {
            statusType = 'counter';
            statusHeader = isGuest
              ? 'Counter-Proposal Sent · Awaiting Host'
              : 'Counter-Proposal Received · Action Required';
          } else if (rawStatus === 'PASSED') {
            statusType = 'pass';
            statusHeader = 'Invitation Passed';
          } else if (
            rawStatus === 'EXPIRED' ||
            rawStatus === 'CANCELLED' ||
            rawStatus === 'COMPLETED'
          ) {
            statusType = 'expired';
            statusHeader =
              rawStatus === 'COMPLETED'
                ? 'Completed Date'
                : rawStatus === 'CANCELLED'
                ? 'Withdrawn / Cancelled'
                : 'Invitation Expired (48h)';
          }

          return {
            id: raw.id,
            rawStatus,
            statusHeader,
            statusType,
            statusBadgeText,
            remainingTime:
              rawStatus === 'PENDING' || rawStatus === 'COUNTERED'
                ? formatRemaining(raw.expiresAt)
                : undefined,
            userName: counterpart?.nickname || counterpart?.email?.split('@')[0] || 'Member',
            userAvatar: counterpartProfile?.photos?.[0] || '/assets/discover-card-1.jpg',
            reliability: counterpartProfile?.reliabilityScore ?? 4.9,
            isVerified: Boolean(counterpart?.isVerified),
            occasion: raw.activityType || 'Dinner',
            timeText: formatDateTime(raw.proposedDateTime),
            escrowAmount: parseEscrowAmount(raw.hospitalityGuarantee),
            venueName: raw.venueName || 'Curated Venue',
            venueLocation: raw.venueAddress || 'New York',
            note: raw.personalMessage || 'Looking forward to meeting you.',
            chatOpen: rawStatus === 'ACCEPTED' || rawStatus === 'COMPLETED',
            counterVenue: raw.counterVenue || undefined,
            counterTime: raw.counterTime ? formatDateTime(raw.counterTime) : undefined,
            counterNote: raw.counterNote || undefined,
          };
        });
        setAllOffers(mapped);
      } else {
        setAllOffers([]);
      }
    } catch (err: any) {
      showToast(err?.message || 'Unable to load offers.');
      setAllOffers([]);
    } finally {
      setIsLoading(false);
    }
  }, [isGuest]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  // Bucket offers cleanly by status
  const activeOffers = allOffers.filter(
    (o) => o.rawStatus === 'PENDING' || o.rawStatus === 'ACCEPTED'
  );
  const counterOffers = allOffers.filter((o) => o.rawStatus === 'COUNTERED');
  const passedOffers = allOffers.filter((o) => o.rawStatus === 'PASSED');
  const archivedOffers = allOffers.filter((o) =>
    ['EXPIRED', 'CANCELLED', 'COMPLETED'].includes(o.rawStatus)
  );

  const handleGuestRespond = async (
    offerId: string,
    action: 'ACCEPT' | 'PASS',
    hostName: string
  ) => {
    setBusyId(offerId);
    try {
      await api.offers.respond(offerId, { action });
      showToast(
        action === 'ACCEPT'
          ? `You accepted ${hostName}'s invitation! Date confirmed and chat is unlocked.`
          : `Politely passed on ${hostName}'s invitation.`
      );
      await loadOffers();
    } catch (err: any) {
      showToast(err?.message || 'Action failed.');
    } finally {
      setBusyId(null);
    }
  };

  const handleHostRespondCounter = async (
    offerId: string,
    action: 'ACCEPT' | 'DECLINE'
  ) => {
    setBusyId(offerId);
    try {
      await api.offers.hostRespond(offerId, action);
      showToast(
        action === 'ACCEPT'
          ? 'Counter-proposal accepted! Date confirmed and chat unlocked.'
          : 'Counter-proposal declined.'
      );
      await loadOffers();
    } catch (err: any) {
      showToast(err?.message || 'Unable to respond to counter-offer.');
    } finally {
      setBusyId(null);
    }
  };

  const handleWithdraw = async (offerId: string) => {
    setBusyId(offerId);
    try {
      await api.offers.withdraw(offerId);
      showToast('Invitation withdrawn successfully.');
      await loadOffers();
    } catch (err: any) {
      showToast(err?.message || 'Unable to withdraw offer.');
    } finally {
      setBusyId(null);
    }
  };

  const renderEmpty = (title: string, subtitle: string) => (
    <div className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] p-8 text-center max-w-lg mx-auto">
      <Clock className="w-9 h-9 text-[#8A857D] mx-auto mb-3" />
      <h3 className="font-serif font-bold text-lg text-[#16120F] mb-1">{title}</h3>
      <p className="text-xs text-[#6E6A63] leading-relaxed">{subtitle}</p>
      {onNavigateExplore && (
        <button
          type="button"
          onClick={onNavigateExplore}
          className="mt-4 bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-semibold px-5 py-2 rounded-full cursor-pointer"
        >
          Explore Profiles
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full animate-in fade-in duration-200">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-5 h-[1.5px] bg-[#9F1E19]" />
        <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">Date Invitations</span>
      </div>

      {/* Headline */}
      <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] tracking-tight leading-tight mb-5 sm:mb-6">
        The First Move, Organized.
      </h1>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 sm:pb-3 no-scrollbar mb-6 sm:mb-8">
        {isGuest ? (
          <>
            <button
              type="button"
              onClick={() => setActiveFilter('received')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeFilter === 'received'
                  ? 'bg-[#16120F] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6E6A63] border border-[#EADBCA] hover:text-[#16120F]'
              }`}
            >
              Received ({activeOffers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('counter')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeFilter === 'counter'
                  ? 'bg-[#16120F] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6E6A63] border border-[#EADBCA] hover:text-[#16120F]'
              }`}
            >
              Counter ({counterOffers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('pass')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeFilter === 'pass'
                  ? 'bg-[#16120F] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6E6A63] border border-[#EADBCA] hover:text-[#16120F]'
              }`}
            >
              Passed ({passedOffers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('expired')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeFilter === 'expired'
                  ? 'bg-[#16120F] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6E6A63] border border-[#EADBCA] hover:text-[#16120F]'
              }`}
            >
              Expired/History ({archivedOffers.length})
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveFilter('sent')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeFilter === 'sent'
                  ? 'bg-[#16120F] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6E6A63] border border-[#EADBCA] hover:text-[#16120F]'
              }`}
            >
              Sent ({activeOffers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('counter')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeFilter === 'counter'
                  ? 'bg-[#16120F] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6E6A63] border border-[#EADBCA] hover:text-[#16120F]'
              }`}
            >
              Counter ({counterOffers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('pass')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeFilter === 'pass'
                  ? 'bg-[#16120F] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6E6A63] border border-[#EADBCA] hover:text-[#16120F]'
              }`}
            >
              Pass ({passedOffers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('expired')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeFilter === 'expired'
                  ? 'bg-[#16120F] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6E6A63] border border-[#EADBCA] hover:text-[#16120F]'
              }`}
            >
              Expired/History ({archivedOffers.length})
            </button>
          </>
        )}
      </div>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#6E6A63]">
          <Loader2 className="w-7 h-7 animate-spin text-[#9F1E19]" />
          <span className="text-xs font-medium">Loading your offers...</span>
        </div>
      ) : (
        <>
          {/* 1. ACTIVE OFFERS TAB (Guest: Received | Host: Sent) */}
          {((isGuest && activeFilter === 'received') || (!isGuest && activeFilter === 'sent')) && (
            activeOffers.length === 0 ? (
              renderEmpty(
                isGuest ? 'No incoming invitations yet' : 'No active invitations sent yet',
                isGuest
                  ? 'Verified hosts can send you curated invitations at vetted public venues.'
                  : 'Browse Discover to invite a Guest of Honor to a curated dinner or outing.'
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 animate-in fade-in duration-150">
                {activeOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] pb-3 mb-3 border-b border-[#EADBCA]/60">
                        <span className="font-medium text-[#6E6A63]">{offer.statusHeader}</span>
                        {offer.remainingTime ? (
                          <span className="text-[#9F1E19] font-semibold">{offer.remainingTime}</span>
                        ) : offer.statusBadgeText ? (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {offer.statusBadgeText}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={offer.userAvatar}
                          alt={offer.userName}
                          className="w-12 h-12 rounded-full object-cover border border-[#EADBCA]"
                        />
                        <div>
                          <h3 className="font-serif font-bold text-base text-[#16120F]">
                            {offer.userName}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-[#6E6A63] mt-0.5">
                            <span>{offer.reliability.toFixed(2)} Reliability</span>
                            <span>·</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> {offer.isVerified ? 'ID Verified' : 'Member'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#F5EFE6] rounded-2xl p-3.5 mb-3 space-y-2 border border-[#E5DDD0]">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#8A857D] tracking-wider block">
                            Occasion & Time
                          </span>
                          <div className="text-xs sm:text-sm font-bold text-[#16120F] mt-0.5">
                            {offer.occasion}
                          </div>
                          <div className="text-xs text-[#6E6A63] mt-0.5 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#9F1E19]" />
                            <span>{offer.timeText}</span>
                          </div>
                        </div>

                        <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          <span>${offer.escrowAmount} Courtesy Gift (Held in Escrow)</span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#8A857D] tracking-wider block">
                            Venue Destination
                          </span>
                          <div className="text-xs font-bold text-[#16120F] mt-0.5">
                            {offer.venueName}
                          </div>
                          <div className="text-[11px] text-[#6E6A63] mt-0.5">
                            {offer.venueLocation}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-[#16120F] italic bg-[#FAF7F2] p-3 rounded-xl border border-[#EADBCA] mb-4">
                        <span className="not-italic font-semibold text-[#9F1E19]">{offer.userName} imagines: </span>
                        &ldquo;{offer.note}&rdquo;
                      </div>
                    </div>

                    {offer.statusType === 'accepted' ? (
                      <div className="pt-2 flex items-center justify-between border-t border-[#EADBCA]">
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Date confirmed. Chat open.
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenChat && onOpenChat(offer)}
                          className="bg-[#9F1E19] hover:bg-[#851713] text-white px-5 py-2 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          Open chat
                        </button>
                      </div>
                    ) : isGuest ? (
                      <div className="pt-2 flex items-center gap-2 border-t border-[#EADBCA]">
                        <button
                          type="button"
                          disabled={busyId === offer.id}
                          onClick={() => handleGuestRespond(offer.id, 'ACCEPT', offer.userName)}
                          className="flex-1 bg-[#9F1E19] hover:bg-[#851713] text-white py-2.5 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 text-center disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          disabled={busyId === offer.id}
                          onClick={() => setActiveCounterOffer(offer)}
                          className="flex-1 bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#D9CFC1] text-[#16120F] py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 text-center disabled:opacity-50"
                        >
                          Counter
                        </button>
                        <button
                          type="button"
                          disabled={busyId === offer.id}
                          onClick={() => handleGuestRespond(offer.id, 'PASS', offer.userName)}
                          className="flex-1 bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#D9CFC1] text-[#6E6A63] hover:text-[#16120F] py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 text-center disabled:opacity-50"
                        >
                          Pass
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#EADBCA]">
                        <span className="text-[11px] text-[#6E6A63]">
                          Chat locked until accepted
                        </span>
                        <button
                          type="button"
                          disabled={busyId === offer.id}
                          onClick={() => handleWithdraw(offer.id)}
                          className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#D9CFC1] text-xs font-semibold text-[#16120F] cursor-pointer disabled:opacity-50"
                        >
                          Withdraw Invitation
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {/* 2. COUNTER TAB */}
          {activeFilter === 'counter' && (
            counterOffers.length === 0 ? (
              renderEmpty(
                'No counter-proposals right now',
                'When a Guest proposes an alternate time or venue, it appears here for review.'
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 animate-in fade-in duration-150">
                {counterOffers.map((cnt) => (
                  <div
                    key={cnt.id}
                    className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] pb-3 mb-3 border-b border-[#EADBCA]/60">
                        <span className="font-medium text-[#6E6A63]">{cnt.statusHeader}</span>
                        {cnt.remainingTime && (
                          <span className="text-[#9F1E19] font-semibold">{cnt.remainingTime}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={cnt.userAvatar}
                          alt={cnt.userName}
                          className="w-12 h-12 rounded-full object-cover border border-[#EADBCA]"
                        />
                        <div>
                          <h3 className="font-serif font-bold text-base text-[#16120F]">
                            {cnt.userName}
                          </h3>
                          <p className="text-xs text-[#6E6A63]">
                            {cnt.reliability.toFixed(2)} Reliability
                          </p>
                        </div>
                      </div>

                      {cnt.counterNote && (
                        <div className="text-xs text-[#16120F] italic bg-[#FAF7F2] p-3 rounded-xl border border-[#EADBCA] mb-3">
                          &ldquo;{cnt.counterNote}&rdquo;
                        </div>
                      )}

                      <div className="space-y-3 mb-4">
                        <div className="bg-[#F5EFE6] rounded-2xl p-3 border border-[#E5DDD0]">
                          <span className="text-[10px] uppercase font-bold text-[#8A857D] block mb-1">
                            Original Invitation
                          </span>
                          <div className="text-xs font-bold text-[#16120F]">{cnt.occasion}</div>
                          <div className="text-[11px] text-[#6E6A63]">{cnt.timeText}</div>
                          <div className="text-[11px] text-[#6E6A63] mt-0.5">{cnt.venueName}</div>
                        </div>

                        <div className="bg-[#FAF7F2] rounded-2xl p-3 border-2 border-[#9F1E19]/30">
                          <span className="text-[10px] uppercase font-bold text-[#9F1E19] block mb-1">
                            Suggested Alternative
                          </span>
                          <div className="text-xs font-bold text-[#16120F]">
                            {cnt.counterVenue || cnt.venueName}
                          </div>
                          <div className="text-[11px] text-[#6E6A63]">
                            {cnt.counterTime || cnt.timeText}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#EADBCA] flex items-center gap-2">
                      {isGuest ? (
                        <button
                          type="button"
                          disabled={busyId === cnt.id}
                          onClick={() => handleWithdraw(cnt.id)}
                          className="w-full bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#D9CFC1] text-[#16120F] py-2.5 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50"
                        >
                          Withdraw Counter-Proposal
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={busyId === cnt.id}
                            onClick={() => handleHostRespondCounter(cnt.id, 'ACCEPT')}
                            className="flex-1 bg-[#9F1E19] hover:bg-[#851713] text-white py-2.5 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50"
                          >
                            Accept Proposal
                          </button>
                          <button
                            type="button"
                            disabled={busyId === cnt.id}
                            onClick={() => handleHostRespondCounter(cnt.id, 'DECLINE')}
                            className="flex-1 bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#D9CFC1] text-[#16120F] py-2.5 rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* 3. PASS TAB */}
          {activeFilter === 'pass' && (
            passedOffers.length === 0 ? (
              renderEmpty(
                'No passed invitations',
                'Invitations that were politely declined are recorded here.'
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-in fade-in duration-150">
                {passedOffers.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] pb-3 mb-3 border-b border-[#EADBCA]/60">
                        <span className="font-medium text-[#6E6A63]">{item.statusHeader}</span>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          Escrow Released
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={item.userAvatar}
                          alt={item.userName}
                          className="w-10 h-10 rounded-full object-cover border border-[#EADBCA]"
                        />
                        <div>
                          <h3 className="font-serif font-bold text-sm text-[#16120F]">
                            {item.userName}
                          </h3>
                          <p className="text-xs text-[#6E6A63]">
                            {item.occasion} · {item.venueName}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-[#6E6A63] leading-relaxed">{item.note}</p>
                    </div>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => onNavigateExplore && onNavigateExplore()}
                        className="w-full bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#D9CFC1] text-[#16120F] py-2 rounded-full text-xs font-semibold cursor-pointer"
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* 4. EXPIRED / HISTORY TAB */}
          {activeFilter === 'expired' && (
            archivedOffers.length === 0 ? (
              renderEmpty(
                'Expired & Archived Invitations',
                'Invitations that lapsed past their 48-hour deadline or completed historical dates are preserved here.'
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 animate-in fade-in duration-150">
                {archivedOffers.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between text-[11px] pb-2.5 border-b border-[#EADBCA]/60">
                      <span className="font-semibold text-[#6E6A63]">{item.statusHeader}</span>
                      <span className="text-[#8A857D]">{item.timeText}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={item.userAvatar}
                        alt={item.userName}
                        className="w-11 h-11 rounded-full object-cover border border-[#EADBCA]"
                      />
                      <div>
                        <h3 className="font-serif font-bold text-sm text-[#16120F]">
                          {item.userName}
                        </h3>
                        <p className="text-xs text-[#6E6A63]">
                          {item.occasion} · {item.venueName}
                        </p>
                      </div>
                    </div>
                    {item.chatOpen && onOpenChat && (
                      <button
                        type="button"
                        onClick={() => onOpenChat(item)}
                        className="px-4 py-1.5 rounded-full bg-white border border-[#E5DDD0] hover:border-[#9F1E19] text-xs font-semibold text-[#16120F] cursor-pointer"
                      >
                        View chat history
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}

      {/* Counter Modal */}
      {activeCounterOffer && (
        <CounterOfferModal
          recipientName={activeCounterOffer.userName}
          defaultOccasion={activeCounterOffer.occasion}
          defaultGiftAmount={activeCounterOffer.escrowAmount}
          onClose={() => setActiveCounterOffer(null)}
          onSubmitSuccess={async (counterData) => {
            const targetId = activeCounterOffer.id;
            setActiveCounterOffer(null);
            try {
              await api.offers.respond(targetId, {
                action: 'COUNTER',
                counterVenue: counterData.venue,
                counterNote: counterData.note,
              });
              setActiveFilter('counter');
              showToast('Counter offer sent to host successfully!');
              await loadOffers();
            } catch (err: any) {
              showToast(err?.message || 'Unable to submit counter-offer.');
            }
          }}
        />
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#16120F] text-white text-xs px-5 py-3 rounded-full shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
