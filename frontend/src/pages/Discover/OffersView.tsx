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
  RotateCcw,
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { CounterOfferModal } from './CounterOfferModal';

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
  originalOccasion: string;
  originalTime: string;
  originalEscrow: number;
  originalVenue: string;
  originalLocation: string;
  suggestedOccasion: string;
  suggestedTime: string;
  suggestedEscrow: number;
  suggestedVenue: string;
  suggestedLocation: string;
}

export interface PassOfferItem {
  id: string;
  statusHeader: string;
  refundBadge: string;
  userName: string;
  userAvatar: string;
  reliability: number;
  isVerified: boolean;
  note: string;
  registryNote: string;
  buttonLabel: 'Explore' | 'Discover' | 'See More';
}

const SAMPLE_HOST_SENT_OFFERS: OfferItem[] = [
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
];

const SAMPLE_GUEST_RECEIVED_OFFERS: OfferItem[] = [
  {
    id: 'g-off-1',
    statusHeader: 'Awaiting your decision',
    statusType: 'awaiting',
    remainingTime: '~41h 56m remaining',
    userName: 'Farhan Ahmed',
    userAvatar: '/assets/discover-card-2.jpg',
    reliability: 4.97,
    isVerified: true,
    occasion: 'Fine French Dinner & Wine Pairing',
    timeText: 'Tomorrow at 8:00 PM',
    escrowAmount: 150,
    venueName: 'Le Bernardin',
    venueLocation: 'Midtown Manhattan · Fine French & Seafood',
    note: "Good evening Victoria, I have a reserved corner table at Le Bernardin tomorrow night. Would be delighted to have you join me for the chef's tasting menu.",
    chatOpen: false,
  },
  {
    id: 'g-off-2',
    statusHeader: 'Offer Accepted · Date Confirmed',
    statusType: 'accepted',
    statusBadgeText: 'Chat Unlocked',
    userName: 'Jenny Wilson',
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
];

const SAMPLE_COUNTER_OFFERS: CounterOfferItem[] = [
  {
    id: 'cnt-1',
    statusHeader: 'Counter is pending - Action Required',
    respondTime: '~42h 36m remaining',
    userName: 'Farhan Ahmed',
    userAvatar: '/assets/discover-card-2.jpg',
    reliability: 4.97,
    isVerified: true,
    guestName: 'Elena Rostova',
    note: 'Thank you Julian, the invitation is lovely! Thursday is difficult due to rehearsal at Lincoln Center. Would Saturday 8:30 at Le Bernardin suit your schedule instead?',
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

const SAMPLE_GUEST_SENT_REQUESTS: OfferItem[] = [
  {
    id: 'g-sent-1',
    statusHeader: 'Awaiting Host Decision',
    statusType: 'awaiting',
    remainingTime: '~43h 36m remaining',
    userName: 'Farhan Ahmed',
    userAvatar: '/assets/discover-card-2.jpg',
    reliability: 4.97,
    isVerified: true,
    occasion: 'Fine French Dinner & Wine Pairing',
    timeText: 'Tomorrow at 8:00 PM',
    escrowAmount: 150,
    venueName: 'Le Bernardin',
    venueLocation: 'Midtown Manhattan · Fine French & Seafood',
    note: 'Taste tasting and lively conversation on Saturday evening.',
    chatOpen: false,
  },
  {
    id: 'g-sent-2',
    statusHeader: 'Awaiting Host Decision',
    statusType: 'awaiting',
    remainingTime: '~45h 10m remaining',
    userName: 'Marcus Montgomery',
    userAvatar: '/assets/discover-card-3.jpg',
    reliability: 4.98,
    isVerified: true,
    occasion: 'Concerts & Symphony',
    timeText: 'Friday at 7:30 PM',
    escrowAmount: 250,
    venueName: 'Lincoln Center',
    venueLocation: 'Upper West Side, NY',
    note: 'Would love to see the philharmonic performance this weekend.',
    chatOpen: false,
  },
];

const SAMPLE_PASS_OFFERS: PassOfferItem[] = [
  {
    id: 'pass-1',
    statusHeader: 'Invitation Graciously Declined',
    refundBadge: 'Deposit Fully Returned',
    userName: 'Liam Chen',
    userAvatar: '/assets/discover-card-2.jpg',
    reliability: 4.85,
    isVerified: true,
    note: 'Guest responded: "Regrettably, I have prior commitments at the tech conference this weekend."',
    registryNote: 'Logged for user experience analysis',
    buttonLabel: 'Explore',
  },
  {
    id: 'pass-2',
    statusHeader: 'Offer Courteously Passed',
    refundBadge: 'Escrow 100% Refunded',
    userName: 'Sophia Laurent',
    userAvatar: '/assets/discover-card-1.jpg',
    reliability: 4.97,
    isVerified: true,
    note: 'Guest was unable to accept this invitation: "Thank you for the thoughtful proposal, Julian. My schedule is occupied with previews this weekend."',
    registryNote: 'Record kept for personal dating registry',
    buttonLabel: 'Discover',
  },
];

interface OffersViewProps {
  onOpenChat?: (offer: OfferItem) => void;
  onNavigateExplore?: () => void;
}

export function OffersView({ onOpenChat, onNavigateExplore }: OffersViewProps) {
  const { role, isGuest } = useRole();

  // Active filter tab
  const [activeFilter, setActiveFilter] = useState<OfferFilterType>(() => {
    return isGuest ? 'received' : 'sent';
  });

  const [guestOffers, setGuestOffers] = useState<OfferItem[]>(SAMPLE_GUEST_RECEIVED_OFFERS);
  const [hostOffers, setHostOffers] = useState<OfferItem[]>(SAMPLE_HOST_SENT_OFFERS);
  const [guestSentRequests, setGuestSentRequests] = useState<OfferItem[]>(SAMPLE_GUEST_SENT_REQUESTS);
  const [counterList, setCounterList] = useState<CounterOfferItem[]>(SAMPLE_COUNTER_OFFERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Counter Modal State
  const [activeCounterOffer, setActiveCounterOffer] = useState<OfferItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Guest Accept Action
  const handleGuestAccept = (offerId: string, hostName: string) => {
    setGuestOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              statusHeader: 'Offer Accepted · Date Confirmed',
              statusType: 'accepted',
              statusBadgeText: 'Chat Unlocked',
              chatOpen: true,
            }
          : o
      )
    );
    showToast(`You accepted ${hostName}'s offer! Date confirmed and chat is now open.`);
  };

  // Guest Pass Action
  const handleGuestPass = (offerId: string, hostName: string) => {
    setGuestOffers((prev) => prev.filter((o) => o.id !== offerId));
    showToast(`Politely passed on ${hostName}'s offer. Host escrow deposit refunded.`);
  };

  // Withdraw Counter Action
  const handleWithdrawCounter = (counterId: string) => {
    setCounterList((prev) => prev.filter((c) => c.id !== counterId));
    showToast('Counter offer withdrawn successfully.');
  };

  // Withdraw Sent Offer Action
  const handleWithdrawSentOffer = (offerId: string) => {
    setGuestSentRequests((prev) => prev.filter((o) => o.id !== offerId));
    showToast('Date request withdrawn successfully.');
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

      {/* Tabs Row matching Figma role layouts */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 sm:pb-3 no-scrollbar mb-6 sm:mb-8">
        {isGuest ? (
          // Guest Tabs: Received (Primary) | Counter | Sent | Expired/History
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
              Received
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
              onClick={() => setActiveFilter('sent')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeFilter === 'sent'
                  ? 'bg-[#16120F] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6E6A63] border border-[#EADBCA] hover:text-[#16120F]'
              }`}
            >
              Sent ({guestSentRequests.length})
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
          </>
        ) : (
          // Host Tabs: Sent (2) | Counter | Pass | Received | Expired/History
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
              Sent ({hostOffers.length})
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
          </>
        )}
      </div>

      {/* ============================================================ */}
      {/* 1. GUEST RECEIVED TAB (FIGMA SCREEN 3)                       */}
      {/* ============================================================ */}
      {isGuest && activeFilter === 'received' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 animate-in fade-in duration-150">
          {guestOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Status Bar */}
                <div className="flex items-center justify-between text-[11px] pb-3 mb-3 border-b border-[#EADBCA]/60">
                  <span className="font-medium text-[#6E6A63]">
                    {offer.statusHeader}
                  </span>
                  {offer.remainingTime && (
                    <span className="text-[#9F1E19] font-semibold">
                      {offer.remainingTime}
                    </span>
                  )}
                </div>

                {/* Host Profile Header */}
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
                      <span>{offer.reliability} Reliability</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> ID Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Occasion & Time Card */}
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
                    <span>${offer.escrowAmount} Locked in Escrow</span>
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

                {/* Host Note */}
                <div className="text-xs text-[#16120F] italic bg-[#FAF7F2] p-3 rounded-xl border border-[#EADBCA] mb-4">
                  "{offer.note}"
                </div>
              </div>

              {/* Action Buttons for Guest */}
              {offer.statusType === 'accepted' ? (
                <div className="pt-2 flex items-center justify-between border-t border-[#EADBCA]">
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Date confirmed. Chat open.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenChat) onOpenChat(offer);
                      else showToast(`Opening chat with ${offer.userName}...`);
                    }}
                    className="bg-[#9F1E19] hover:bg-[#851713] text-white px-5 py-2 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Open chat
                  </button>
                </div>
              ) : (
                <div className="pt-2 flex items-center gap-2 border-t border-[#EADBCA]">
                  <button
                    type="button"
                    onClick={() => handleGuestAccept(offer.id, offer.userName)}
                    className="flex-1 bg-[#9F1E19] hover:bg-[#851713] text-white py-2.5 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 text-center"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCounterOffer(offer)}
                    className="flex-1 bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#D9CFC1] text-[#16120F] py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 text-center"
                  >
                    Counter
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGuestPass(offer.id, offer.userName)}
                    className="flex-1 bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#D9CFC1] text-[#6E6A63] hover:text-[#16120F] py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 text-center"
                  >
                    Pass
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. COUNTER TAB (FIGMA SCREEN 5)                              */}
      {/* ============================================================ */}
      {activeFilter === 'counter' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 animate-in fade-in duration-150">
          {counterList.map((cnt) => (
            <div
              key={cnt.id}
              className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] pb-3 mb-3 border-b border-[#EADBCA]/60">
                  <span className="font-medium text-[#6E6A63]">{cnt.statusHeader}</span>
                  <span className="text-[#9F1E19] font-semibold">{cnt.respondTime}</span>
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
                    <div className="flex items-center gap-1.5 text-xs text-[#6E6A63] mt-0.5">
                      <span>{cnt.reliability} Reliability</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> ID Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#16120F] italic bg-[#FAF7F2] p-3 rounded-xl border border-[#EADBCA] mb-3">
                  "{cnt.note}"
                </div>

                {/* Proposed Modifications comparison */}
                <div className="space-y-3 mb-4">
                  {/* Original */}
                  <div className="bg-[#F5EFE6] rounded-2xl p-3 border border-[#E5DDD0]">
                    <span className="text-[10px] uppercase font-bold text-[#8A857D] block mb-1">
                      Original Offer
                    </span>
                    <div className="text-xs font-bold text-[#16120F]">{cnt.originalOccasion}</div>
                    <div className="text-[11px] text-[#6E6A63]">{cnt.originalTime}</div>
                    <div className="text-xs font-semibold text-emerald-800 mt-1">
                      ${cnt.originalEscrow} Locked in Escrow
                    </div>
                    <div className="text-[11px] text-[#6E6A63] mt-1">{cnt.originalVenue}</div>
                  </div>

                  {/* Alternative Requested */}
                  <div className="bg-[#FAF7F2] rounded-2xl p-3 border-2 border-[#9F1E19]/30">
                    <span className="text-[10px] uppercase font-bold text-[#9F1E19] block mb-1">
                      Your Suggested Alternative (Requested)
                    </span>
                    <div className="text-xs font-bold text-[#16120F]">{cnt.suggestedOccasion}</div>
                    <div className="text-[11px] text-[#6E6A63]">{cnt.suggestedTime}</div>
                    <div className="text-xs font-semibold text-[#9F1E19] mt-1">
                      ${cnt.suggestedEscrow} request for gift
                    </div>
                    <div className="text-[11px] text-[#6E6A63] mt-1">{cnt.suggestedVenue}</div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-[#EADBCA]">
                <button
                  type="button"
                  onClick={() => handleWithdrawCounter(cnt.id)}
                  className="w-full bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#D9CFC1] text-[#16120F] py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 text-center"
                >
                  Withdraw Counter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. SENT TAB (FOR GUEST: FIGMA SCREEN 6 / FOR HOST: OFFERS)    */}
      {/* ============================================================ */}
      {activeFilter === 'sent' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 animate-in fade-in duration-150">
          {(isGuest ? guestSentRequests : hostOffers).map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] pb-3 mb-3 border-b border-[#EADBCA]/60">
                  <span className="font-medium text-[#6E6A63]">{item.statusHeader}</span>
                  <span className="text-[#9F1E19] font-semibold">{item.remainingTime}</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={item.userAvatar}
                    alt={item.userName}
                    className="w-12 h-12 rounded-full object-cover border border-[#EADBCA]"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#16120F]">
                      {item.userName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6E6A63] mt-0.5">
                      <span>{item.reliability} Reliability</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> ID Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F5EFE6] rounded-2xl p-3.5 mb-3 space-y-1.5 border border-[#E5DDD0]">
                  <span className="text-[10px] uppercase font-bold text-[#8A857D] block">
                    Occasion & Time
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-[#16120F]">
                    {item.occasion}
                  </div>
                  <div className="text-xs text-[#6E6A63] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#9F1E19]" />
                    <span>{item.timeText}</span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-800 pt-1">
                    ${item.escrowAmount} {isGuest ? "Gift I'm hoping for" : 'Locked in Escrow'}
                  </div>
                  <div className="text-[11px] text-[#6E6A63]">
                    {item.venueName} · {item.venueLocation}
                  </div>
                </div>

                <div className="text-xs text-[#16120F] italic bg-[#FAF7F2] p-3 rounded-xl border border-[#EADBCA] mb-3">
                  "{item.note}"
                </div>
              </div>

              <div className="pt-2 border-t border-[#EADBCA]">
                {isGuest ? (
                  <button
                    type="button"
                    onClick={() => handleWithdrawSentOffer(item.id)}
                    className="w-full bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#D9CFC1] text-[#16120F] py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 text-center"
                  >
                    Withdraw Offer
                  </button>
                ) : (
                  <div className="flex items-center justify-between text-xs text-[#6E6A63]">
                    <span>Awaiting guest acceptance</span>
                    <span className="text-[#9F1E19] font-medium">Chat locked until accepted</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. PASS TAB (FOR HOST: PASS OFFERS)                          */}
      {/* ============================================================ */}
      {activeFilter === 'pass' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-in fade-in duration-150">
          {SAMPLE_PASS_OFFERS.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] pb-3 mb-3 border-b border-[#EADBCA]/60">
                  <span className="font-medium text-[#6E6A63]">{item.statusHeader}</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    {item.refundBadge}
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
                    <div className="flex items-center gap-1.5 text-xs text-[#6E6A63]">
                      <span>{item.reliability} Reliability</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#16120F] leading-relaxed mb-3">
                  {item.note}
                </p>

                <p className="text-[10px] text-[#8A857D] italic border-t border-[#EADBCA]/50 pt-2">
                  {item.registryNote}
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateExplore) onNavigateExplore();
                    else showToast('Navigating back to Discover feed...');
                  }}
                  className="w-full bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#D9CFC1] text-[#16120F] py-2 rounded-full text-xs font-semibold transition-all cursor-pointer text-center"
                >
                  {item.buttonLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. EXPIRED / HISTORY TAB                                     */}
      {/* ============================================================ */}
      {activeFilter === 'expired' && (
        <div className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] p-8 text-center max-w-lg mx-auto">
          <Clock className="w-10 h-10 text-[#8A857D] mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-[#16120F] mb-1">
            Expired & Archived Itineraries
          </h3>
          <p className="text-xs text-[#6E6A63] leading-relaxed">
            Offers that lapsed past their 48-hour deadline or completed historical dates are preserved here for safety and accountability.
          </p>
        </div>
      )}

      {/* Counter Modal */}
      {activeCounterOffer && (
        <CounterOfferModal
          recipientName={activeCounterOffer.userName}
          defaultOccasion={activeCounterOffer.occasion}
          defaultGiftAmount={activeCounterOffer.escrowAmount}
          onClose={() => setActiveCounterOffer(null)}
          onSubmitSuccess={(counterData) => {
            setActiveCounterOffer(null);
            setGuestOffers((prev) => prev.filter((o) => o.id !== activeCounterOffer.id));
            setCounterList((prev) => [
              {
                id: `cnt-${Date.now()}`,
                statusHeader: 'Counter is pending - Action Required',
                respondTime: '~48h remaining',
                userName: activeCounterOffer.userName,
                userAvatar: activeCounterOffer.userAvatar,
                reliability: activeCounterOffer.reliability,
                isVerified: true,
                guestName: 'You',
                note: counterData.note || 'Suggested an alternative schedule and venue.',
                originalOccasion: activeCounterOffer.occasion,
                originalTime: activeCounterOffer.timeText,
                originalEscrow: activeCounterOffer.escrowAmount,
                originalVenue: activeCounterOffer.venueName,
                originalLocation: activeCounterOffer.venueLocation,
                suggestedOccasion: counterData.occasion,
                suggestedTime: counterData.time,
                suggestedEscrow: counterData.giftAmount,
                suggestedVenue: counterData.venue,
                suggestedLocation: 'New York',
              },
              ...prev,
            ]);
            setActiveFilter('counter');
            showToast('Counter offer sent to host successfully!');
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#16120F] text-white text-xs px-5 py-3 rounded-full shadow-lg z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
