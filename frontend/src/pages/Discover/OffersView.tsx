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
} from 'lucide-react';

export type OfferFilterType = 'sent' | 'counter' | 'reject' | 'received' | 'expired';

export interface OfferItem {
  id: string;
  statusHeader: string;
  statusType: 'awaiting' | 'accepted' | 'counter' | 'rejected' | 'expired';
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

const SAMPLE_OFFERS: OfferItem[] = [
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

interface OffersViewProps {
  onOpenChat?: (offer: OfferItem) => void;
}

export function OffersView({ onOpenChat }: OffersViewProps) {
  const [activeFilter, setActiveFilter] = useState<OfferFilterType>('sent');

  // Filter count badge numbers
  const sentCount = SAMPLE_OFFERS.length;

  const filteredOffers = SAMPLE_OFFERS.filter((offer) => {
    if (activeFilter === 'sent') return true;
    if (activeFilter === 'counter') return offer.statusType === 'counter';
    if (activeFilter === 'reject') return offer.statusType === 'rejected';
    if (activeFilter === 'received') return false;
    if (activeFilter === 'expired') return offer.statusType === 'expired';
    return true;
  });

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

      {/* Filter Pills Row */}
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
          Sent ({sentCount})
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
          onClick={() => setActiveFilter('reject')}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
            activeFilter === 'reject'
              ? 'bg-[#16120F] text-white shadow-xs'
              : 'bg-[#FAF7F2] text-[#6E6A63] border border-[#EADBCA] hover:text-[#16120F]'
          }`}
        >
          Reject
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

      {/* Offers Grid: 1 col on mobile, 3 cols on desktop */}
      {filteredOffers.length === 0 ? (
        <div className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] p-8 text-center text-[#6E6A63] my-8">
          <p className="font-serif text-lg text-[#16120F] mb-1">No offers in this section</p>
          <p className="text-xs">Explore profiles and send an offer to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredOffers.map((offer) => (
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

                {/* Inner Highlight Container: Occasion, Time, Escrow, Destination */}
                <div className="bg-[#F5F1E6] rounded-[20px] p-3.5 space-y-2.5 mb-3.5">
                  {/* Occasion & Time */}
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

                  {/* Venue Destination */}
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

                {/* Personal Note */}
                <div className="text-xs mb-3">
                  <span className="font-semibold text-[#16120F]">Note:</span>
                  <p className="text-[#6E6A63] italic mt-0.5 leading-relaxed text-[11px] sm:text-xs">
                    &ldquo;{offer.note}&rdquo;
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              {offer.chatOpen ? (
                <div className="pt-2 flex items-center justify-between border-t border-[#EADBCA]/60 mt-1">
                  <span className="text-[11px] text-[#8A857D]">
                    Date confirmed · Chat open
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenChat) onOpenChat(offer);
                      else alert(`Opening chat with ${offer.userName}`);
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

    </div>
  );
}

export default OffersView;
