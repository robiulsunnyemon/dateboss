import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Star,
  X,
  Check,
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export interface ConfirmedDateItem {
  id: string;
  userName: string;
  userAvatar: string;
  reliability: number;
  isVerified: boolean;
  escrowGift: number;
  venueName: string;
  venueAddress: string;
  dateTime: string;
  courtesyWindow: string;
  checkInStatus: 'Confirmed' | 'Pending';
  youStatus: 'Confirmed' | 'Pending';
  counterpartStatus: 'Confirmed' | 'Pending';
}

const SAMPLE_GUEST_CONFIRMED_DATES: ConfirmedDateItem[] = [
  {
    id: 'date-g-1',
    userName: 'Farhan Ahmed',
    userAvatar: '/assets/discover-card-2.jpg',
    reliability: 4.97,
    isVerified: true,
    escrowGift: 200,
    venueName: 'Caviar Russe',
    venueAddress: '538 Madison Ave, New York',
    dateTime: 'Friday, Nov 1 · 8:30 PM',
    courtesyWindow: 'Arrival window: 15 min courtesy',
    checkInStatus: 'Confirmed',
    youStatus: 'Confirmed',
    counterpartStatus: 'Pending',
  },
  {
    id: 'date-g-2',
    userName: 'Marcus Montgomery',
    userAvatar: '/assets/discover-card-3.jpg',
    reliability: 4.98,
    isVerified: true,
    escrowGift: 350,
    venueName: 'Le Bernardin',
    venueAddress: '155 W 51st St, New York',
    dateTime: 'Saturday, Nov 9 · 8:00 PM',
    courtesyWindow: 'Arrival window: 15 min courtesy',
    checkInStatus: 'Confirmed',
    youStatus: 'Confirmed',
    counterpartStatus: 'Confirmed',
  },
];

const SAMPLE_HOST_CONFIRMED_DATES: ConfirmedDateItem[] = [
  {
    id: 'date-h-1',
    userName: 'Sophia Laurent',
    userAvatar: '/assets/discover-card-1.jpg',
    reliability: 4.97,
    isVerified: true,
    escrowGift: 200,
    venueName: 'Caviar Russe',
    venueAddress: '538 Madison Ave, New York',
    dateTime: 'Friday, Nov 1 · 8:30 PM',
    courtesyWindow: 'Arrival window: 15 min courtesy',
    checkInStatus: 'Confirmed',
    youStatus: 'Confirmed',
    counterpartStatus: 'Pending',
  },
];

interface ConfirmedDatesViewProps {
  onOpenChat?: (date: ConfirmedDateItem) => void;
}

export function ConfirmedDatesView({ onOpenChat }: ConfirmedDatesViewProps) {
  const { isGuest } = useRole();
  const [datesList, setDatesList] = useState<ConfirmedDateItem[]>(
    isGuest ? SAMPLE_GUEST_CONFIRMED_DATES : SAMPLE_HOST_CONFIRMED_DATES
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Rating & Attendance Modal state
  const [ratingModalDate, setRatingModalDate] = useState<ConfirmedDateItem | null>(null);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stars === 0) {
      showToast('Please tap the stars to rate before submitting.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (ratingModalDate) {
        setDatesList((prev) =>
          prev.map((d) =>
            d.id === ratingModalDate.id
              ? {
                  ...d,
                  counterpartStatus: 'Confirmed',
                  checkInStatus: 'Confirmed',
                }
              : d
          )
        );
      }
      showToast(
        isGuest
          ? 'Attendance confirmed! Your $200 escrow gift has been released to your wallet.'
          : 'Attendance & rating verified! Escrow payout released to guest.'
      );
      setRatingModalDate(null);
      setStars(0);
      setFeedback('');
    }, 600);
  };

  return (
    <div className="w-full animate-in fade-in duration-200">
      
      {/* Eyebrow: — Confirmed Itineraries */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-5 h-[1.5px] bg-[#9F1E19]"></span>
        <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
          Confirmed Itineraries
        </span>
      </div>

      {/* Headline: Confirmed Dates */}
      <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] tracking-tight leading-tight mb-5 sm:mb-6">
        Confirmed Dates
      </h1>

      {/* Dates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
        {datesList.map((item) => (
          <div
            key={item.id}
            className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              {/* Top Bar: Confirmed Date & Escrow Gift */}
              <div className="flex items-center justify-between text-[11px] pb-3 mb-4 border-b border-[#EADBCA]/60">
                <span className="font-medium text-[#6E6A63]">Confirmed Date</span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Escrow Gift: ${item.escrowGift} Protected
                </span>
              </div>

              {/* Host / Counterpart Profile Header */}
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={item.userAvatar}
                  alt={item.userName}
                  className="w-13 h-13 rounded-full object-cover border-2 border-[#EADBCA] shadow-2xs"
                />
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#16120F]">
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

              {/* Reserved Venue Info */}
              <div className="bg-[#F5EFE6] rounded-2xl p-3.5 mb-3.5 border border-[#E5DDD0] space-y-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#8A857D] tracking-wider">
                    Reserved Venue
                  </div>
                  <div className="text-xs sm:text-[13px] font-bold text-[#16120F] mt-0.5">
                    {item.venueName}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#6E6A63] mt-0.5">
                    <MapPin className="w-3 h-3 text-[#9F1E19] shrink-0" />
                    <span>{item.venueAddress}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5DDD0]">
                  <div className="text-[10px] uppercase font-bold text-[#8A857D] tracking-wider">
                    Reserved Time
                  </div>
                  <div className="text-xs sm:text-[13px] font-bold text-[#16120F] mt-0.5">
                    {item.dateTime}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#6E6A63] mt-0.5">
                    <Clock className="w-3 h-3 text-[#9F1E19] shrink-0" />
                    <span>{item.courtesyWindow}</span>
                  </div>
                </div>
              </div>

              {/* 24-Hour Attendance Check-In Section */}
              <div className="bg-[#FAF7F2] border border-[#E8DFD0] rounded-[18px] p-3.5 mb-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#16120F]">
                    24-Hour Attendance Check-In
                  </h4>
                  <span className="bg-[#ECFDF5] text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Confirmed
                  </span>
                </div>

                <p className="text-[11px] text-[#6E6A63] leading-relaxed">
                  Attendance confirmed! Your refundable hold releases upon arrival.
                </p>

                <div className="text-[11px] flex items-center gap-2 pt-0.5 font-medium">
                  <span className="text-emerald-700">
                    You: <strong className="font-semibold">Confirmed</strong>
                  </span>
                  <span className="text-[#8A857D]">·</span>
                  <span className={item.counterpartStatus === 'Confirmed' ? 'text-emerald-700' : 'text-[#9F1E19]'}>
                    {item.userName}: <strong className="font-semibold">{item.counterpartStatus}</strong>
                  </span>
                </div>

                <p className="text-[10px] text-[#8A857D] pt-0.5">
                  {isGuest
                    ? 'Host Action: Verify attendance to release escrow gift.'
                    : 'Your Action: Verify attendance to release escrow gift to guest.'}
                </p>
              </div>

            </div>

            {/* Bottom Action Buttons: Open Chat & Confirm/Report Attendance & Rating */}
            <div className="pt-2 flex items-center gap-2 border-t border-[#EADBCA]/60">
              <button
                type="button"
                onClick={() => {
                  if (onOpenChat) onOpenChat(item);
                  else showToast(`Opening chat with ${item.userName}...`);
                }}
                className="flex-1 bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#EADBCA] text-[#16120F] text-xs font-semibold py-2.5 px-3 rounded-full transition-all active:scale-95 cursor-pointer text-center whitespace-nowrap"
              >
                Open Chat
              </button>

              <button
                type="button"
                onClick={() => setRatingModalDate(item)}
                className="flex-1 bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-semibold py-2.5 px-3 rounded-full transition-all shadow-xs active:scale-95 cursor-pointer text-center whitespace-nowrap"
              >
                {isGuest ? 'Confirm Attendance & Rating' : 'Report Attendance & Rating'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* RATING & ATTENDANCE BOTTOM SHEET MODAL (Figma Screen 4)      */}
      {/* ============================================================ */}
      {ratingModalDate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full sm:max-w-[460px] bg-[#FAF7F2] rounded-t-[28px] sm:rounded-[28px] p-5 sm:p-6 shadow-2xl border border-[#EADBCA] animate-in slide-in-from-bottom duration-250">
            {/* Top Close Button */}
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setRatingModalDate(null)}
                className="w-8 h-8 rounded-full bg-[#9F1E19] text-white flex items-center justify-center hover:bg-[#851713] transition-all cursor-pointer shadow-xs"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRatingSubmit} className="space-y-4">
              {/* Tap The Stars To Rate */}
              <div>
                <h3 className="font-serif font-bold text-base text-[#16120F] mb-2.5">
                  Tap The Stars To Rate
                </h3>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starIdx) => (
                    <button
                      key={starIdx}
                      type="button"
                      onClick={() => setStars(starIdx)}
                      className="cursor-pointer focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 ${
                          starIdx <= stars
                            ? 'text-[#9F1E19] fill-[#9F1E19]'
                            : 'text-[#D9CFC1] hover:text-[#9F1E19]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Write Something */}
              <div>
                <label className="font-serif font-bold text-base text-[#16120F] block mb-2">
                  Write Something
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Input your review"
                  className="w-full bg-[#FAF7F2] border border-[#D9CFC1] rounded-[16px] p-3 text-xs sm:text-sm text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19] focus:ring-1 focus:ring-[#9F1E19] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full sm:w-auto px-8 py-2.5 bg-[#9F1E19] hover:bg-[#851713] text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying & Releasing Escrow...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
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
