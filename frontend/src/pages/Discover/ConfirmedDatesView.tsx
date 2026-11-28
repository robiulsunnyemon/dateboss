import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  MapPin,
  ShieldCheck,
  Star,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { api } from '../../services/api';

export interface ConfirmedDateItem {
  id: string;
  rawStatus: string;
  userName: string;
  userAvatar: string;
  reliability: number;
  isVerified: boolean;
  escrowGift: number;
  venueName: string;
  venueAddress: string;
  dateTime: string;
  courtesyWindow: string;
  youStatus: 'Confirmed' | 'Pending';
  counterpartStatus: 'Confirmed' | 'Pending';
  hasReview: boolean;
}

interface ConfirmedDatesViewProps {
  onOpenChat?: (date: ConfirmedDateItem) => void;
}

function parseEscrowAmount(guarantee?: string | null): number {
  if (!guarantee) return 150;
  const match = guarantee.match(/\$(\d+)/);
  return match ? Number(match[1]) : 150;
}

function formatDateTime(dt?: string): string {
  if (!dt) return 'Scheduled Evening';
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return dt;
  return d.toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ConfirmedDatesView({ onOpenChat }: ConfirmedDatesViewProps) {
  const { isGuest } = useRole();
  const [datesList, setDatesList] = useState<ConfirmedDateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [ratingModalDate, setRatingModalDate] = useState<ConfirmedDateItem | null>(null);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const loadConfirmedDates = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.offers.getAll();
      if (res.success && Array.isArray(res.data)) {
        const confirmed = res.data
          .filter((o: any) => o.status === 'ACCEPTED' || o.status === 'COMPLETED')
          .map((o: any): ConfirmedDateItem => {
            const counterpart = isGuest ? o.host : o.guest;
            const counterpartProfile = isGuest
              ? counterpart?.hostProfile
              : counterpart?.guestProfile;
            const youCheckedIn = isGuest ? Boolean(o.guestCheckedIn) : Boolean(o.hostCheckedIn);
            const otherCheckedIn = isGuest ? Boolean(o.hostCheckedIn) : Boolean(o.guestCheckedIn);

            return {
              id: o.id,
              rawStatus: o.status,
              userName: counterpart?.nickname || counterpart?.email?.split('@')[0] || 'Member',
              userAvatar: counterpartProfile?.photos?.[0] || '/assets/discover-card-1.jpg',
              reliability: counterpartProfile?.reliabilityScore ?? 4.9,
              isVerified: Boolean(counterpart?.isVerified),
              escrowGift: parseEscrowAmount(o.hospitalityGuarantee),
              venueName: o.venueName || 'Curated Venue',
              venueAddress: o.venueAddress || 'New York, NY',
              dateTime: formatDateTime(o.proposedDateTime),
              courtesyWindow: 'Arrival window: 15 min courtesy',
              youStatus: youCheckedIn ? 'Confirmed' : 'Pending',
              counterpartStatus: otherCheckedIn ? 'Confirmed' : 'Pending',
              hasReview: Boolean(o.review),
            };
          });
        setDatesList(confirmed);
      } else {
        setDatesList([]);
      }
    } catch (err: any) {
      showToast(err?.message || 'Unable to load confirmed dates.');
      setDatesList([]);
    } finally {
      setIsLoading(false);
    }
  }, [isGuest]);

  useEffect(() => {
    loadConfirmedDates();
  }, [loadConfirmedDates]);

  const handleCheckIn = async (dateId: string) => {
    setBusyId(dateId);
    try {
      const res = await api.offers.checkin(dateId);
      showToast(res.message || '24-hour attendance check-in confirmed!');
      await loadConfirmedDates();
    } catch (err: any) {
      showToast(err?.message || 'Unable to confirm check-in.');
    } finally {
      setBusyId(null);
    }
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModalDate) return;
    if (stars === 0) {
      showToast('Please tap the stars to rate before submitting.');
      return;
    }

    setIsVerifying(true);
    try {
      if (ratingModalDate.youStatus !== 'Confirmed') {
        await api.offers.checkin(ratingModalDate.id);
      }
      await api.offers.review(ratingModalDate.id, {
        rating: stars,
        feedback: feedback.trim() || undefined,
      });

      showToast(
        isGuest
          ? 'Attendance & rating recorded! Reliability score updated.'
          : 'Attendance & rating verified! Reliability score updated.'
      );
      setRatingModalDate(null);
      setStars(0);
      setFeedback('');
      await loadConfirmedDates();
    } catch (err: any) {
      showToast(err?.message || 'Failed to submit rating.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-200">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-5 h-[1.5px] bg-[#9F1E19]" />
        <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
          Confirmed Itineraries
        </span>
      </div>

      <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] tracking-tight leading-tight mb-5 sm:mb-7">
        Confirmed Dates
      </h1>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#6E6A63]">
          <Loader2 className="w-7 h-7 animate-spin text-[#9F1E19]" />
          <span className="text-xs font-medium">Loading confirmed itineraries...</span>
        </div>
      ) : datesList.length === 0 ? (
        <div className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] p-10 text-center max-w-lg mx-auto">
          <Calendar className="w-10 h-10 text-[#9F1E19]/60 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-[#16120F]">
            No confirmed dates yet
          </h3>
          <p className="text-xs text-[#6E6A63] mt-1.5 leading-relaxed">
            Once an invitation is accepted, your itinerary, 24-hour check-in, and private chat appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {datesList.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] sm:rounded-[26px] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] pb-3 mb-3 border-b border-[#EADBCA]/60">
                  <span className="text-[#8A857D] font-normal">
                    {item.rawStatus === 'COMPLETED' ? 'Completed Date' : 'Confirmed Date'}
                  </span>
                  <span className="flex items-center gap-1 text-[#059669] font-medium text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Escrow Gift: ${item.escrowGift}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3.5">
                  <img
                    src={item.userAvatar}
                    alt={item.userName}
                    className="w-10 h-10 rounded-full object-cover border border-[#EADBCA]"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#16120F]">
                      {item.userName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6E6A63] mt-0.5">
                      <span>{item.reliability.toFixed(2)} Reliability</span>
                      <span>·</span>
                      <span className="text-[#2563EB] font-medium flex items-center gap-0.5">
                        <Check className="w-3 h-3 text-[#2563EB]" />{' '}
                        {item.isVerified ? 'ID Verified' : 'Member'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Celebratory Approved Green Venue Box (Client Meeting Requirement) */}
                <div className="bg-[#ECFDF5]/90 rounded-[20px] p-4 mb-3.5 border-2 border-[#10B981]/40 space-y-3 shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#059669] text-white text-[10px] sm:text-[11px] font-bold tracking-wide uppercase inline-flex items-center gap-1 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" /> Reserved Venue
                      </span>
                      <span className="text-[11px] font-semibold text-[#059669] bg-[#D1FAE5] px-2 py-0.5 rounded-full">
                        Confirmed &amp; Approved
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-serif font-bold text-[#065F46] mt-1.5 leading-snug">
                      {item.venueName}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#047857] mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                      <span className="font-medium">{item.venueAddress}</span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#10B981]/20">
                    <div className="text-[10px] uppercase font-bold text-[#065F46] tracking-wider">
                      Reserved Date &amp; Time
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[#16120F] mt-0.5">
                      {item.dateTime}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#6E6A63] mt-0.5">
                      <Calendar className="w-3 h-3 text-[#059669] shrink-0" />
                      <span>{item.courtesyWindow}</span>
                    </div>
                  </div>
                </div>

                {/* 24-Hour Attendance Check-In Box */}
                <div className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[18px] p-3 mb-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#16120F]">
                      24-Hour Attendance Check-In
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.youStatus === 'Confirmed'
                          ? 'bg-[#ECFDF5] text-[#059669] border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.youStatus}
                    </span>
                  </div>

                  <div className="text-[11px] flex items-center gap-2 pt-0.5 font-medium">
                    <span
                      className={
                        item.youStatus === 'Confirmed' ? 'text-[#059669]' : 'text-[#9F1E19]'
                      }
                    >
                      You: <strong className="font-semibold">{item.youStatus}</strong>
                    </span>
                    <span className="text-[#8A857D]">·</span>
                    <span
                      className={
                        item.counterpartStatus === 'Confirmed'
                          ? 'text-[#059669]'
                          : 'text-[#9F1E19]'
                      }
                    >
                      {item.userName}:{' '}
                      <strong className="font-semibold">{item.counterpartStatus}</strong>
                    </span>
                  </div>

                  {item.youStatus === 'Pending' && (
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => handleCheckIn(item.id)}
                      className="mt-1.5 w-full py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {busyId === item.id ? 'Confirming...' : 'Confirm 24h Check-In'}
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 border-t border-[#EADBCA]/60">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenChat) onOpenChat(item);
                    else showToast(`Opening chat with ${item.userName}...`);
                  }}
                  className="flex-1 bg-[#FAF7F2] hover:bg-[#F5F1E6] border border-[#D9CFC1] text-[#16120F] text-xs font-semibold py-2.5 px-3 rounded-full transition-all active:scale-95 cursor-pointer text-center whitespace-nowrap shadow-2xs"
                >
                  Open Chat
                </button>

                <button
                  type="button"
                  onClick={() => setRatingModalDate(item)}
                  className="flex-1 bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-semibold py-2.5 px-3 rounded-full transition-all shadow-xs active:scale-95 cursor-pointer text-center whitespace-nowrap"
                >
                  {item.hasReview
                    ? 'Update Rating'
                    : isGuest
                    ? 'Confirm & Rate'
                    : 'Rate Attendance'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating & Attendance Modal */}
      {ratingModalDate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full sm:max-w-[460px] bg-[#FAF7F2] rounded-t-[28px] sm:rounded-[28px] p-5 sm:p-6 shadow-2xl border border-[#EADBCA] animate-in slide-in-from-bottom duration-250">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setRatingModalDate(null)}
                className="w-8 h-8 rounded-full bg-[#9F1E19] text-white flex items-center justify-center hover:bg-[#851713] transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div>
                <h3 className="font-serif font-bold text-base text-[#16120F] mb-2.5">
                  Tap The Stars To Rate {ratingModalDate.userName}
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

              <div>
                <label className="font-serif font-bold text-base text-[#16120F] block mb-2">
                  Write Something
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full bg-[#FAF7F2] border border-[#D9CFC1] rounded-[16px] p-3 text-xs sm:text-sm text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19] focus:ring-1 focus:ring-[#9F1E19] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full sm:w-auto px-8 py-2.5 bg-[#9F1E19] hover:bg-[#851713] text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#16120F] text-white text-xs px-5 py-3 rounded-full shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
