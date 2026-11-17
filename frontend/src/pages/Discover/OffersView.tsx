import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  MessageCircle,
  Check,
  AlertCircle,
  ChevronRight,
  X,
} from 'lucide-react';

export type OfferFilterType = 'sent' | 'counter' | 'pass' | 'received' | 'expired';

export interface OfferItem {
  id: string;
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
}

export interface CounterOfferItem {
  id: string;
  statusHeader: string;
  respondTime: string;
  userName: string;
  userAvatar: string;
  reliability: number;
  isVerified: boolean;
  guestName: string;
  note: string;
  // Original Offer (to show strikethrough)
  originalOccasion: string;
  originalTime: string;
  originalEscrow: number;
  originalVenue: string;
  originalLocation: string;
  // Suggested Alternative
  suggestedOccasion: string;
  suggestedTime: string;
  suggestedEscrow: number;
  suggestedVenue: string;
  suggestedLocation: string;
}

const SAMPLE_SENT_OFFERS: OfferItem[] = [
  {
    id: 'off-1',
    statusHeader: 'Awaiting Guest Decision',
    statusType: 'awaiting',
    remainingTime: '~47h 38m remaining',
    userName: 'Farhan Ahmed',
    userAvatar: '/assets/discover-card-2.jpg',
    reliability: 4.97,
    isVerified: true,
    occasion: 'Fine French Dinner & Wine Pairing',
    timeText: 'Tomorrow at 8:00 PM',
    escrowAmount: 150,
    venueName: 'Le Bernardin',
    venueLocation: 'Midtown Manhattan · Fine French & Seafood',
    note: 'Good evening Victoria, I have a reserved corner table at Le Bernardin tomorrow night. Would be delighted to have you join me for the chef tasting menu.',
    chatOpen: false,
  },
  {
    id: 'off-2',
    statusHeader: 'Offer Accepted · Date Confirmed',
    statusType: 'accepted',
    statusBadgeText: 'Chat Unlocked',
    userName: 'Sophia Laurent',
    userAvatar: '/assets/discover-card-1.jpg',
    reliability: 4.97,
    isVerified: true,
    occasion: 'Fine French Dinner & Wine Pairing',
    timeText: 'Tomorrow at 8:00 PM',
    escrowAmount: 150,
    venueName: 'Le Bernardin',
    venueLocation: 'Midtown Manhattan · Fine French & Seafood',
    note: 'Table reserved at Caviar Russe. Delighted to host you.',
    chatOpen: true,
  },
  {
    id: 'off-3',
    statusHeader: 'Offer Accepted · Date Confirmed',
    statusType: 'accepted',
    statusBadgeText: 'Chat Unlocked',
    userName: 'Sophia Laurent',
    userAvatar: '/assets/discover-card-3.jpg',
    reliability: 4.97,
    isVerified: true,
    occasion: 'Fine French Dinner & Wine Pairing',
    timeText: 'Tomorrow at 8:00 PM',
    escrowAmount: 150,
    venueName: 'Le Bernardin',
    venueLocation: 'Midtown Manhattan · Fine French & Seafood',
    note: 'Table reserved at Caviar Russe. Delighted to host you.',
    chatOpen: true,
  },
];

const SAMPLE_COUNTER_OFFERS: CounterOfferItem[] = [
  {
    id: 'cnt-1',
    statusHeader: 'Counter Received · Action Required',
    respondTime: 'Respond within 48 hours',
    userName: 'Farhan Ahmed',
    userAvatar: '/assets/discover-card-2.jpg',
    reliability: 4.97,
    isVerified: true,
    guestName: 'Elena Rostova',
    note: 'Thank you Julian, the invitation is lovely! Thursday is difficult due to rehearsal at Lincoln Center. Would Saturday 8:30 PM at Carbone suit your schedule instead?',
    originalOccasion: 'Fine French Dinner & Wine Pairing',
    originalTime: 'Tomorrow at 8:00 PM',
    originalEscrow: 150,
    originalVenue: 'Le Bernardin',
    originalLocation: 'Midtown Manhattan · Fine French & Seafood',
    suggestedOccasion: 'Carbone',
    suggestedTime: 'Tomorrow at 10:00 PM',
    suggestedEscrow: 200,
    suggestedVenue: 'Le Bernardin',
    suggestedLocation: 'Midtown Manhattan · Fine French & Seafood',
  },
  {
    id: 'cnt-2',
    statusHeader: 'Counter Received · Action Required',
    respondTime: 'Respond within 48 hours',
    userName: 'Farhan Ahmed',
    userAvatar: '/assets/discover-card-1.jpg',
    reliability: 4.97,
    isVerified: true,
    guestName: 'Elena Rostova',
    note: 'Thank you Julian, the invitation is lovely! Thursday is difficult due to rehearsal at Lincoln Center. Would Saturday 8:30 PM at Carbone suit your schedule instead?',
    originalOccasion: 'Fine French Dinner & Wine Pairing',
    originalTime: 'Tomorrow at 8:00 PM',
    originalEscrow: 150,
    originalVenue: 'Le Bernardin',
    originalLocation: 'Midtown Manhattan · Fine French & Seafood',
    suggestedOccasion: 'Carbone',
    suggestedTime: 'Tomorrow at 10:00 PM',
    suggestedEscrow: 200,
    suggestedVenue: 'Le Bernardin',
    suggestedLocation: 'Midtown Manhattan · Fine French & Seafood',
  },
  {
    id: 'cnt-3',
    statusHeader: 'Counter Received · Action Required',
    respondTime: 'Respond within 48 hours',
    userName: 'Farhan Ahmed',
    userAvatar: '/assets/discover-card-3.jpg',
    reliability: 4.97,
    isVerified: true,
    guestName: 'Elena Rostova',
    note: 'Thank you Julian, the invitation is lovely! Thursday is difficult due to rehearsal at Lincoln Center. Would Saturday 8:30 PM at Carbone suit your schedule instead?',
    originalOccasion: 'Fine French Dinner & Wine Pairing',
    originalTime: 'Tomorrow at 8:00 PM',
    originalEscrow: 150,
    originalVenue: 'Le Bernardin',
    originalLocation: 'Midtown Manhattan · Fine French & Seafood',
    suggestedOccasion: 'Carbone',
    suggestedTime: 'Tomorrow at 10:00 PM',
    suggestedEscrow: 200,
    suggestedVenue: 'Le Bernardin',
    suggestedLocation: 'Midtown Manhattan · Fine French & Seafood',
  },
];

interface OffersViewProps {
  onOpenChat?: (offer: OfferItem) => void;
}

export function OffersView({ onOpenChat }: OffersViewProps) {
  const [activeFilter, setActiveFilter] = useState<OfferFilterType>('counter');
  const [counterList, setCounterList] = useState<CounterOfferItem[]>(SAMPLE_COUNTER_OFFERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAcceptCounter = (id: string, name: string) => {
    setCounterList((prev) => prev.filter((item) => item.id !== id));
    showToast(`Counter offer from ${name} accepted! Date confirmed.`);
  };

  const handleDeclineCounter = (id: string, name: string) => {
    setCounterList((prev) => prev.filter((item) => item.id !== id));
    showToast(`Counter offer from ${name} declined.`);
  };

  return (
    <div className="w-full animate-in fade-in duration-200">
      
      {/* Eyebrow: — Offers */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-5 h-[1.5px] bg-[#9F1E19]"></span>
        <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
          Offers
        </span>
      </div>

      {/* Headline: The First Move, Organized. */}
      <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] tracking-tight leading-tight mb-5 sm:mb-6">
        The First Move, Organized.
      </h1>

      {/* Filter Pills Row matching Figma: Sent (2) | Counter | Pass | Received | Expired/History */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 sm:pb-3 no-scrollbar mb-6 sm:mb-8">
        <button
          type="button"
          onClick={() => setActiveFilter('sent')}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
            activeFilter === 'sent'
              ? 'bg-[#16120F] text-white shadow-xs'
              : 'bg-[#FAF7F2] text-[#6E6A63] border border-[#EADBCA] hover:text-[#16120F]'
          }`}
        >
          Sent (2)
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
          Counter
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
          Pass
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('received')}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
            activeFilter === 'received'
              ? 'bg-[#16120F] text-white shadow-xs'
              : 'bg-[#FAF7F2] text-[#6E6A63] border border-[#EADBCA] hover:text-[#16120F]'
          }`}
        >
          Received
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
          Expired/History
        </button>
      </div>

      {/* ============================================================ */}
      {/* 1. COUNTER TAB VIEW                                          */}
      {/* ============================================================ */}
      {activeFilter === 'counter' && (
        <>
          {counterList.length === 0 ? (
            <div className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] p-8 text-center text-[#6E6A63] my-8">
              <p className="font-serif text-lg text-[#16120F] mb-1">No pending counter offers</p>
              <p className="text-xs">Counter proposals from guests will appear here for review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {counterList.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Top Status Header */}
                    <div className="flex items-center justify-between text-[11px] pb-3 mb-3 border-b border-[#EADBCA]/60">
                      <span className="font-medium text-[#6E6A63]">
                        {item.statusHeader}
                      </span>
                      <span className="text-[#9F1E19] font-semibold">
                        {item.respondTime}
                      </span>
                    </div>

                    {/* User Row: Avatar + Name + Reliability & Verification */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={item.userAvatar}
                        alt={item.userName}
                        className="w-10 h-10 rounded-full object-cover border border-[#EADBCA]"
                      />
                      <div>
                        <h3 className="font-serif font-bold text-sm text-[#16120F] leading-tight">
                          {item.userName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8A857D] mt-0.5">
                          <span>{item.reliability} Reliability</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-0.5 text-[#3B82F6]">
                            <ShieldCheck className="w-3 h-3" />
                            <span>ID Verified</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Note from Guest */}
                    <div className="text-xs mb-3 text-[#16120F]">
                      <div className="font-medium text-[11px] text-[#8A857D] mb-1">
                        Note from {item.guestName}:
                      </div>
                      <p className="text-[#4A453E] text-[11px] leading-relaxed italic">
                        &ldquo;{item.note}&rdquo;
                      </p>
                    </div>

                    {/* Sub-label: Comparison · Proposed Modifications */}
                    <div className="text-[10px] uppercase tracking-wider text-[#8A857D] font-semibold mb-2">
                      Comparison · Proposed Modifications
                    </div>

                    {/* Box 1: Original Offer (with Strikethroughs) */}
                    <div className="bg-[#F5F1E6] rounded-[18px] p-3 space-y-2 mb-2.5 opacity-85">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-[#8A857D] font-semibold mb-0.5">
                          Occasion & Time
                        </div>
                        <div className="text-xs font-bold text-[#16120F] line-through decoration-[#9F1E19]/70">
                          {item.originalOccasion}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#6E6A63] line-through mt-0.5">
                          <Calendar className="w-3 h-3 text-[#9F1E19]/70" />
                          <span>{item.originalTime}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-[#6E6A63] line-through mt-0.5">
                          <span>${item.originalEscrow} Locked in Escrow</span>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-[#EADBCA]/60">
                        <div className="text-[9px] uppercase tracking-wider text-[#8A857D] font-semibold mb-0.5">
                          Venue Destination
                        </div>
                        <div className="text-xs font-bold text-[#16120F] line-through decoration-[#9F1E19]/70">
                          {item.originalVenue}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#6E6A63] line-through mt-0.5">
                          <MapPin className="w-3 h-3 text-[#9F1E19]/70 shrink-0" />
                          <span className="truncate">{item.originalLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Box 2 Header: Elena Rostova's Suggested Alternative | Requested */}
                    <div className="flex items-center justify-between text-[11px] mb-1.5 px-0.5">
                      <span className="font-semibold text-[#16120F]">
                        {item.guestName}&apos;s Suggested Alternative
                      </span>
                      <span className="text-[#9F1E19] font-bold text-[10px] tracking-wide uppercase">
                        Requested
                      </span>
                    </div>

                    {/* Box 2: Suggested Alternative Offer */}
                    <div className="bg-[#F5F1E6] rounded-[18px] p-3 space-y-2 mb-4 border border-[#E0D7C6]">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-[#8A857D] font-semibold mb-0.5">
                          Occasion & Time
                        </div>
                        <div className="text-xs font-bold text-[#16120F]">
                          {item.suggestedOccasion}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#6E6A63] mt-0.5">
                          <Calendar className="w-3 h-3 text-[#9F1E19]" />
                          <span>{item.suggestedTime}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-[#16120F] mt-0.5">
                          <span className="text-[#9F1E19] font-bold">${item.suggestedEscrow}</span>{' '}
                          <span className="text-[#6E6A63] font-normal">Locked in Escrow</span>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-[#EADBCA]/60">
                        <div className="text-[9px] uppercase tracking-wider text-[#8A857D] font-semibold mb-0.5">
                          Venue Destination
                        </div>
                        <div className="text-xs font-bold text-[#16120F]">
                          {item.suggestedVenue}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#6E6A63] mt-0.5">
                          <MapPin className="w-3 h-3 text-[#9F1E19] shrink-0" />
                          <span className="truncate">{item.suggestedLocation}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Action Buttons: Decline counter & Accept Counter */}
                  <div className="pt-2 flex items-center gap-2.5 border-t border-[#EADBCA]/60">
                    <button
                      type="button"
                      onClick={() => handleDeclineCounter(item.id, item.userName)}
                      className="flex-1 bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#EADBCA] text-[#16120F] text-xs font-semibold py-2.5 px-3 rounded-full transition-all active:scale-95 cursor-pointer text-center"
                    >
                      Decline counter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAcceptCounter(item.id, item.userName)}
                      className="flex-1 bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-semibold py-2.5 px-3 rounded-full transition-all shadow-xs active:scale-95 cursor-pointer text-center"
                    >
                      Accept Counter
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* 2. SENT TAB VIEW                                             */}
      {/* ============================================================ */}
      {activeFilter === 'sent' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SAMPLE_SENT_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Top Status Header */}
                <div className="flex items-center justify-between text-[11px] pb-3 mb-3 border-b border-[#EADBCA]/60">
                  <span className="font-medium text-[#6E6A63]">
                    {offer.statusHeader}
                  </span>
                  {offer.remainingTime && (
                    <span className="text-[#9F1E19] font-semibold">
                      {offer.remainingTime}
                    </span>
                  )}
                  {offer.statusBadgeText && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {offer.statusBadgeText}
                    </span>
                  )}
                </div>

                {/* User Row: Avatar + Name + Reliability & Verification */}
                <div className="flex items-center gap-3 mb-3.5">
                  <img
                    src={offer.userAvatar}
                    alt={offer.userName}
                    className="w-10 h-10 rounded-full object-cover border border-[#EADBCA]"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#16120F] leading-tight">
                      {offer.userName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8A857D] mt-0.5">
                      <span>{offer.reliability} Reliability</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-0.5 text-[#3B82F6]">
                        <ShieldCheck className="w-3 h-3" />
                        <span>ID Verified</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inner Highlight Container */}
                <div className="bg-[#F5F1E6] rounded-[20px] p-3.5 space-y-2.5 mb-3.5">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#8A857D] font-semibold mb-0.5">
                      Occasion & Time
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-[#16120F]">
                      {offer.occasion}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#6E6A63] mt-0.5">
                      <Calendar className="w-3 h-3 text-[#9F1E19]" />
                      <span>{offer.timeText}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#16120F] mt-1">
                      <span className="text-[#9F1E19]">${offer.escrowAmount}</span>{' '}
                      <span className="text-[#6E6A63] font-normal">Locked in Escrow</span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-[#EADBCA]/60">
                    <div className="text-[10px] uppercase tracking-wider text-[#8A857D] font-semibold mb-0.5">
                      Venue Destination
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-[#16120F]">
                      {offer.venueName}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#6E6A63] mt-0.5">
                      <MapPin className="w-3 h-3 text-[#9F1E19] shrink-0" />
                      <span className="truncate">{offer.venueLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs mb-3">
                  <span className="font-semibold text-[#16120F]">Note:</span>
                  <p className="text-[#6E6A63] italic mt-0.5 leading-relaxed text-[11px] sm:text-xs">
                    &ldquo;{offer.note}&rdquo;
                  </p>
                </div>
              </div>

              {offer.chatOpen ? (
                <div className="pt-2 flex items-center justify-between border-t border-[#EADBCA]/60 mt-1">
                  <span className="text-[11px] text-[#8A857D]">
                    Date confirmed · Chat open
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenChat) onOpenChat(offer);
                      else showToast(`Opening chat with ${offer.userName}`);
                    }}
                    className="bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors active:scale-95 cursor-pointer shadow-xs"
                  >
                    Open chat
                  </button>
                </div>
              ) : null}

            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. OTHER TABS (PASS, RECEIVED, EXPIRED)                      */}
      {/* ============================================================ */}
      {['pass', 'received', 'expired'].includes(activeFilter) && (
        <div className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] p-8 text-center text-[#6E6A63] my-8">
          <p className="font-serif text-lg text-[#16120F] mb-1">
            No offers in {activeFilter}
          </p>
          <p className="text-xs">Offers will appear here as dates progress.</p>
        </div>
      )}

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16120F] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">{toastMessage}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default OffersView;
