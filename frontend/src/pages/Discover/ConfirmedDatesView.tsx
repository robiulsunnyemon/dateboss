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
  guestStatus: 'Confirmed' | 'Pending';
}

const SAMPLE_DATES: ConfirmedDateItem[] = [
  {
    id: 'date-1',
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
    guestStatus: 'Pending',
  },
  {
    id: 'date-2',
    userName: "Liam O'Connor",
    userAvatar: '/assets/discover-card-2.jpg',
    reliability: 4.85,
    isVerified: true,
    escrowGift: 150,
    venueName: 'Blue Hill',
    venueAddress: '75 Washington Pl, New York',
    dateTime: 'Saturday, Nov 2 · 7:00 PM',
    courtesyWindow: 'Arrival window: 20 min courtesy',
    checkInStatus: 'Confirmed',
    youStatus: 'Confirmed',
    guestStatus: 'Confirmed',
  },
  {
    id: 'date-3',
    userName: 'Maya Fernandez',
    userAvatar: '/assets/discover-card-3.jpg',
    reliability: 4.99,
    isVerified: true,
    escrowGift: 250,
    venueName: 'Le Bernardin',
    venueAddress: '155 W 51st St, New York',
    dateTime: 'Sunday, Nov 3 · 6:45 PM',
    courtesyWindow: 'Arrival window: 10 min courtesy',
    checkInStatus: 'Confirmed',
    youStatus: 'Confirmed',
    guestStatus: 'Pending',
  },
];

interface ConfirmedDatesViewProps {
  onOpenChat?: (date: ConfirmedDateItem) => void;
}

export function ConfirmedDatesView({ onOpenChat }: ConfirmedDatesViewProps) {
  const [datesList, setDatesList] = useState<ConfirmedDateItem[]>(SAMPLE_DATES);
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
    if (!ratingModalDate) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      showToast(
        `Attendance verified for ${ratingModalDate.userName}! $${ratingModalDate.escrowGift} escrow gift released.`
      );
      setRatingModalDate(null);
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
      <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] tracking-tight leading-tight mb-6 sm:mb-8">
        Confirmed Dates
      </h1>

      {/* Grid of Confirmed Date Cards: 1 col on mobile, 3 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {datesList.map((item) => (
          <div
            key={item.id}
            className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              {/* Top Status Row: Confirmed Date | Escrow Gift: $XXX Protected */}
              <div className="flex items-center justify-between text-[11px] pb-3 mb-3 border-b border-[#EADBCA]/60">
                <span className="font-medium text-[#6E6A63]">
                  Confirmed Date
                </span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                  <span>Escrow Gift: ${item.escrowGift}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Protected</span>
                </span>
              </div>

              {/* User Info Row: Avatar + Name + Reliability & Verification */}
              <div className="flex items-center gap-3 mb-3.5">
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

              {/* Inner Details Container: Reserved Venue + Reserved Time */}
              <div className="bg-[#F5F1E6] rounded-[20px] p-3.5 space-y-2.5 mb-3.5">
                {/* Reserved Venue */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#9F1E19] font-semibold mb-0.5">
                    Reserved Venue
                  </div>
                  <div className="text-xs sm:text-[13px] font-bold text-[#16120F]">
                    {item.venueName}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#6E6A63] mt-0.5">
                    <MapPin className="w-3 h-3 text-[#9F1E19] shrink-0" />
                    <span className="truncate">{item.venueAddress}</span>
                  </div>
                </div>

                {/* Reserved Time */}
                <div className="pt-2 border-t border-[#EADBCA]/60">
                  <div className="text-[10px] uppercase tracking-wider text-[#9F1E19] font-semibold mb-0.5">
                    Reserved Time
                  </div>
                  <div className="text-xs sm:text-[13px] font-bold text-[#16120F]">
                    {item.dateTime}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#6E6A63] mt-0.5">
                    <Clock className="w-3 h-3 text-[#9F1E19] shrink-0" />
                    <span>{item.courtesyWindow}</span>
                  </div>
                </div>
              </div>

              {/* 24-Hour Attendance Check-In Section */}
              <div className="bg-[#FAF7F2] border border-[#E8DFD0] rounded-[18px] p-3 mb-4 space-y-1.5">
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
                  <span className={item.guestStatus === 'Confirmed' ? 'text-emerald-700' : 'text-[#9F1E19]'}>
                    {item.userName}: <strong className="font-semibold">{item.guestStatus}</strong>
                  </span>
                </div>

                <p className="text-[10px] text-[#8A857D] pt-0.5">
                  Host Action: Verify attendance to release escrow gift.
                </p>
              </div>

            </div>

            {/* Bottom Action Buttons: Open Chat & Report Attendance & Rating */}
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
                Report Attendance & Rating
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* RATING & ATTENDANCE REPORT BOTTOM SHEET (FIGMA DESIGN)       */}
      {/* ============================================================ */}
      {ratingModalDate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end items-center animate-in fade-in duration-200">
          <div className="w-full max-w-[580px] sm:max-w-[620px] bg-[#FAF7F2] rounded-t-[32px] sm:rounded-t-[36px] p-6 pt-5 pb-8 shadow-2xl border-t border-[#EADBCA] animate-in slide-in-from-bottom duration-300 relative">
            
            {/* Top Right Close Button (Red Rounded Square) */}
            <div className="flex justify-end mb-1">
              <button
                type="button"
                onClick={() => setRatingModalDate(null)}
                className="w-8 h-8 rounded-lg bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-xs"
                aria-label="Close"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleRatingSubmit}>
              {/* 1. Tap The Stars To Rate */}
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#16120F] tracking-tight mb-2">
                  Tap The Stars To Rate
                </h3>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStars(star)}
                      className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-6 h-6 stroke-[1.5] ${
                          star <= stars
                            ? 'text-[#9F1E19] fill-[#9F1E19]'
                            : 'text-[#16120F] fill-transparent'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Write Something */}
              <div className="mt-4 sm:mt-5">
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#16120F] tracking-tight mb-2">
                  Write Something
                </h3>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Input your review"
                  className="w-full bg-[#FAF7F2] border border-[#8A857D]/60 rounded-[14px] sm:rounded-[16px] p-3.5 text-xs sm:text-sm text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19] resize-none leading-relaxed transition-colors"
                />
              </div>

              {/* 3. Submit Button */}
              <div className="mt-5 sm:mt-6">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] disabled:opacity-50 text-white font-medium text-xs sm:text-sm py-3 px-8 rounded-full shadow-sm transition-all active:scale-[0.98] cursor-pointer inline-flex items-center justify-center"
                >
                  {isVerifying ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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

export default ConfirmedDatesView;
