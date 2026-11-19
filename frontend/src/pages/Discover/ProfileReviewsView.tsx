import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, MoreVertical, Star, X, Check, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export interface ProfileReviewItem {
  id: string;
  authorName: string;
  avatar: string;
  rating: number;
  timeText: string;
  comment: string;
}

export interface AppealReviewItem {
  id: string;
  authorName: string;
  avatar: string;
  rating: number;
  status: 'accepted' | 'rejected' | 'pending';
  statusLabel: string;
  timeText: string;
  comment: string;
}

export interface ProfileReviewsViewProps {
  onBack: () => void;
}

const REPORT_REASONS = [
  'False Review',
  'Abuse',
  'Off Topic',
  'Misleading',
  'Policy Violation',
  'Spam',
  'Mistake',
  'Other',
];

function formatReviewTime(iso?: string): string {
  if (!iso) return 'Recently';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Recently';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ProfileReviewsView({ onBack }: ProfileReviewsViewProps) {
  const [viewMode, setViewMode] = useState<'reviews' | 'appeals'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#appeals' ? 'appeals' : 'reviews';
    }
    return 'reviews';
  });

  const [reviews, setReviews] = useState<ProfileReviewItem[]>([]);
  const [appeals, setAppeals] = useState<AppealReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reportingReview, setReportingReview] = useState<ProfileReviewItem | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('Other');
  const [reportComment, setReportComment] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const loadReviewsAndAppeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.profile.getMe();
      if (res.success && res.data) {
        const rawReviews = Array.isArray(res.data.reviews) ? res.data.reviews : [];
        const rawAppeals = Array.isArray(res.data.appeals) ? res.data.appeals : [];

        setReviews(
          rawReviews.map((r: any): ProfileReviewItem => {
            const reviewerAvatar =
              r.reviewer?.hostProfile?.photos?.[0] ||
              r.reviewer?.guestProfile?.photos?.[0] ||
              '/assets/discover-card-1.jpg';
            return {
              id: r.id,
              authorName: r.reviewer?.nickname || 'Verified Member',
              avatar: reviewerAvatar,
              rating: r.rating || 5,
              timeText: formatReviewTime(r.createdAt),
              comment: r.feedback || 'Great date experience.',
            };
          })
        );

        setAppeals(
          rawAppeals.map((a: any): AppealReviewItem => {
            const reviewerAvatar =
              a.review?.reviewer?.hostProfile?.photos?.[0] ||
              a.review?.reviewer?.guestProfile?.photos?.[0] ||
              '/assets/discover-card-2.jpg';
            const st = String(a.status || 'PENDING').toUpperCase();
            const status: AppealReviewItem['status'] =
              st === 'ACCEPTED' ? 'accepted' : st === 'REJECTED' ? 'rejected' : 'pending';
            return {
              id: a.id,
              authorName: a.review?.reviewer?.nickname || 'Review Appeal',
              avatar: reviewerAvatar,
              rating: a.review?.rating || 1,
              status,
              statusLabel:
                status === 'accepted'
                  ? 'APPEAL ACCEPTED'
                  : status === 'rejected'
                  ? 'APPEAL REJECTED'
                  : 'APPEAL PENDING',
              timeText: formatReviewTime(a.createdAt),
              comment: a.adminNote || a.reason || '',
            };
          })
        );
      }
    } catch (err: any) {
      showToast(err?.message || 'Unable to load reviews.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviewsAndAppeals();
  }, [loadReviewsAndAppeals]);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#appeals') {
        setViewMode('appeals');
      } else if (window.location.hash === '#reviews') {
        setViewMode('reviews');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const switchView = (mode: 'reviews' | 'appeals') => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: mode }, '', `#${mode}`);
    }
  };

  const handleBack = () => {
    if (viewMode === 'appeals') {
      switchView('reviews');
    } else {
      onBack();
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingReview) return;

    const reasonText =
      selectedReason === 'Other' && reportComment.trim()
        ? reportComment.trim()
        : selectedReason;

    setIsSubmitting(true);
    try {
      await api.profile.submitAppeal({
        reviewId: reportingReview.id,
        reason: reasonText,
      });
      showToast(`Appeal for "${reportingReview.authorName}'s review" submitted.`);
      setReportingReview(null);
      setReportComment('');
      setSelectedReason('Other');
      await loadReviewsAndAppeals();
    } catch (err: any) {
      showToast(err?.message || 'Unable to submit appeal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] sm:bg-[#EFE7DA] py-0 sm:py-10 px-0 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F] animate-in fade-in duration-200">
      <div className="w-full max-w-[760px] bg-[#FAF7F2] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-4 sm:p-8 lg:p-9 shadow-none sm:shadow-[0_10px_35px_rgba(22,18,15,0.05)]">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-[#EADBCA]/70">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="w-10 h-10 rounded-2xl sm:rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-serif font-bold text-2xl sm:text-[28px] text-[#16120F] tracking-tight">
              {viewMode === 'appeals' ? 'Appeal Statuses' : 'Reviews'}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => switchView(viewMode === 'appeals' ? 'reviews' : 'appeals')}
            className="bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-[13px] px-5 py-2 rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            {viewMode === 'appeals' ? 'View Reviews' : `Appeal statuses (${appeals.length})`}
          </button>
        </div>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-[#6E6A63]">
            <Loader2 className="w-6 h-6 animate-spin text-[#9F1E19]" />
            <span className="text-xs">Loading reviews...</span>
          </div>
        ) : viewMode === 'reviews' ? (
          reviews.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-serif font-semibold text-base text-[#16120F]">
                No reviews received yet
              </p>
              <p className="text-xs text-[#6E6A63] mt-1">
                Reviews from your completed dates will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EADBCA]/60">
              {reviews.map((rev) => (
                <article key={rev.id} className="py-4 sm:py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.authorName}
                        className="w-9 h-9 rounded-full object-cover border border-[#E5DDD0]"
                      />
                      <div>
                        <h3 className="font-serif font-bold text-sm sm:text-[15px] text-[#16120F] leading-tight">
                          {rev.authorName}
                        </h3>
                        <div className="flex items-center gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-[#D9CFC1]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setReportingReview(rev)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A857D] hover:text-[#16120F] hover:bg-[#F5EFE6] transition-colors cursor-pointer"
                      title="Appeal or report review"
                      aria-label="Appeal or report review"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-2 text-[11px] sm:text-xs text-[#8A857D] font-normal">
                    {rev.timeText}
                  </div>

                  <p className="mt-1 text-xs sm:text-[13px] text-[#6E6A63] leading-relaxed">
                    {rev.comment}
                  </p>
                </article>
              ))}
            </div>
          )
        ) : appeals.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-serif font-semibold text-base text-[#16120F]">
              No review appeals submitted
            </p>
            <p className="text-xs text-[#6E6A63] mt-1">
              You can submit an appeal from any review&apos;s menu.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#EADBCA]/60 animate-in fade-in duration-150">
            {appeals.map((item) => (
              <article key={item.id} className="py-4 sm:py-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.authorName}
                      className="w-9 h-9 rounded-full object-cover border border-[#E5DDD0]"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-sm sm:text-[15px] text-[#16120F] leading-tight">
                        {item.authorName}
                      </h3>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= item.rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-[#D9CFC1]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {item.status === 'accepted' ? (
                    <span className="border border-[#22C55E] bg-[#F0FDF4] text-[#16A34A] text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 select-none">
                      {item.statusLabel}
                    </span>
                  ) : item.status === 'rejected' ? (
                    <span className="border border-[#F87171] bg-[#FEF2F2] text-[#EF4444] text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 select-none">
                      {item.statusLabel}
                    </span>
                  ) : (
                    <span className="border border-amber-300 bg-amber-50 text-amber-700 text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 select-none">
                      {item.statusLabel}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-[11px] sm:text-xs text-[#8A857D] font-normal">
                  {item.timeText}
                </div>

                <p className="mt-1 text-xs sm:text-[13px] text-[#6E6A63] leading-relaxed">
                  {item.comment}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* REPORT / APPEAL MODAL */}
      {reportingReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] p-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setReportingReview(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#F5EFE6] hover:bg-[#EADBCA] text-[#6E6A63] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif font-bold text-base text-[#16120F] mb-3 pr-6">
              Appeal / Report Review
            </h3>

            <form onSubmit={handleReportSubmit}>
              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => {
                  const isChecked = selectedReason === reason;
                  return (
                    <label
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className="flex items-center gap-3 cursor-pointer group select-none py-0.5"
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-[#9F1E19] text-white'
                            : 'border border-[#C8C4BC] group-hover:border-[#9F1E19]'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span className="text-xs sm:text-[13px] text-[#16120F] font-normal">
                        {reason}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-3.5">
                <input
                  type="text"
                  disabled={selectedReason !== 'Other'}
                  value={selectedReason === 'Other' ? reportComment : ''}
                  onChange={(e) => setReportComment(e.target.value)}
                  placeholder="Type your reason"
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs transition-colors ${
                    selectedReason === 'Other'
                      ? 'bg-[#FAF7F2] border-[#E5DDD0] text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19]'
                      : 'bg-[#F2ECE1]/70 border-[#E5DDD0]/60 text-[#8A857D]/60 placeholder-[#8A857D]/40 cursor-not-allowed'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#9F1E19] hover:bg-[#851713] text-white font-semibold text-xs sm:text-[13px] py-3 rounded-full mt-4 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Appeal'}
              </button>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16120F] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
          <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
          </div>
          <p className="text-xs font-medium text-white">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}

export default ProfileReviewsView;
