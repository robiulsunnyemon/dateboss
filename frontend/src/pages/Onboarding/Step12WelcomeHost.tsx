import React, { useEffect, useState } from 'react';
import { ArrowLeft, Send, Crown, Award, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Step12WelcomeHostProps {
  onBack: () => void;
  onStartHosting?: () => void;
  onBackToLanding?: () => void;
}

interface PlanInfo {
  id: string;
  name: string;
  tierLabel: string;
  priceDisplay: string;
  features: { icon: string; text: string }[];
  footerNote: string;
}

export function Step12WelcomeHost({
  onBack,
  onStartHosting,
  onBackToLanding,
}: Step12WelcomeHostProps) {
  const { user, hasActiveSubscription, refreshUser } = useAuth();
  const [plan, setPlan] = useState<PlanInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlansAndConfirmBilling() {
      try {
        const res = await api.billing.getPlans();
        if (res.success && Array.isArray(res.data)) {
          const hostPlan = res.data.find((p: any) => p.variant === 'host') || res.data[0];
          if (hostPlan) setPlan(hostPlan);
        }
      } catch {
        // Fallback display if plans endpoint temporarily unavailable
      }

      if (typeof window !== 'undefined') {
        const hashPart = window.location.hash.split('?')[1] || '';
        const params = new URLSearchParams(hashPart || window.location.search);
        const billing = params.get('billing');
        const sessionId = params.get('session_id');

        if (billing === 'success' && sessionId) {
          setIsProcessing(true);
          try {
            await api.billing.confirmSession(sessionId);
            await refreshUser();
            setStatusMessage('Subscription activated! Redirecting to Discover...');
            setTimeout(() => {
              if (onStartHosting) onStartHosting();
            }, 900);
          } catch (err: any) {
            setErrorMessage(err?.message || 'Unable to verify Stripe payment.');
          } finally {
            setIsProcessing(false);
          }
        } else if (billing === 'cancelled') {
          setErrorMessage('Payment was cancelled. An active Host subscription is required to access Discover.');
        }
      }
    }

    loadPlansAndConfirmBilling();
  }, [refreshUser, onStartHosting]);

  const handleBuyNow = async () => {
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      if (user?.role === 'GUEST') {
        await api.onboarding.finalize();
        await refreshUser();
        if (onStartHosting) onStartHosting();
        return;
      }

      const res = await api.billing.createCheckout();
      if (res.success && res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
        return;
      }
      throw new Error('Could not start Stripe checkout session.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to start checkout.');
      setIsProcessing(false);
    }
  };

  const handleStartHosting = async () => {
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const res = await api.onboarding.finalize();
      if (res.success) {
        await refreshUser();
        if (onStartHosting) onStartHosting();
      }
    } catch (err: any) {
      if (err?.requiresPayment) {
        setErrorMessage('Please complete your Host subscription via "Buy now" to unlock Discover & Offers.');
      } else {
        setErrorMessage(err?.message || 'Subscription required before entering Discover.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const features = plan?.features?.length
    ? plan.features
    : [
        { icon: 'send', text: 'Send invitations to verified Guests of Honor' },
        { icon: 'crown', text: 'Gold crown on your profile' },
        { icon: 'award', text: 'A reliability score that builds trust' },
      ];

  return (
    <div className="min-h-screen w-full bg-[#F5F1E6] sm:bg-[#EFE7DA] py-5 sm:py-12 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F]">
      <div className="w-full max-w-[760px] bg-[#F5F1E6] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-10 lg:p-12 shadow-none sm:shadow-[0_10px_40px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="flex items-center gap-3 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl sm:rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onBackToLanding) onBackToLanding();
              else onBack();
            }}
            className="flex items-center shrink-0"
          >
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </a>
        </div>

        {/* Status Eyebrow */}
        <div className="flex items-center gap-2 mt-5 sm:mt-7">
          <span className="w-6 h-[1.5px] bg-[#9F1E19]" />
          <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
            {hasActiveSubscription ? 'Membership Active' : "You're signed up"}
          </span>
        </div>

        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] tracking-tight leading-tight mt-2">
          Welcome, {user?.nickname || (user?.role === 'GUEST' ? 'Guest of Honor' : 'Host')}
        </h1>

        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-1 leading-relaxed">
          {hasActiveSubscription
            ? 'Your membership is active. You can now enter Discover.'
            : 'An active membership is required to access Discover, Offers, and Confirmed Dates.'}
        </p>

        {statusMessage && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#FBEFF0] border border-[#F3C5C7] text-xs text-[#9F1E19] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Pricing Card */}
        <div className="mt-5 sm:mt-6 bg-[#F5F1E6]/70 border border-[#EADBCA] rounded-[24px] p-5 sm:p-6 max-w-[580px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#16120F]">
              <span className="text-amber-500 text-sm">👑</span>
              <span>{plan?.name || 'Host'}</span>
            </div>
            <span className="text-xs text-[#6E6A63] font-normal">
              {plan?.tierLabel || 'Pro'}
            </span>
          </div>

          <div className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] mt-2 mb-3.5 tracking-tight">
            {plan?.priceDisplay || '$9.99/Mo'}
          </div>

          {!hasActiveSubscription ? (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleBuyNow}
              className="w-full bg-[#FCB943] hover:bg-[#E09C2C] text-[#16120F] font-semibold text-xs sm:text-sm py-3 px-6 rounded-full transition-colors shadow-xs active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isProcessing ? 'Redirecting to Stripe...' : 'Buy now'}</span>
            </button>
          ) : (
            <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs py-3 px-6 rounded-full text-center">
              Active Subscription Verified
            </div>
          )}

          <div className="space-y-2.5 mt-4 text-xs text-[#524D46]">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                {feat.icon === 'crown' ? (
                  <Crown className="w-3.5 h-3.5 text-[#FCB943] shrink-0 stroke-[2.2]" />
                ) : feat.icon === 'award' ? (
                  <Award className="w-3.5 h-3.5 text-[#FCB943] shrink-0 stroke-[2.2]" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-[#FCB943] shrink-0 rotate-45 stroke-[2.2]" />
                )}
                <span>{feat.text}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#EAE3D6] my-4" />

          <p className="text-[11px] text-[#6E6A63] font-normal">
            {plan?.footerNote || 'Cancel any time. Guests of honor never pay.'}
          </p>
        </div>

        {/* Footer Action Buttons */}
        <div className="mt-6 sm:mt-7 max-w-[580px]">
          {hasActiveSubscription && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleStartHosting}
              className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-3.5 sm:py-3 px-10 rounded-full shadow-sm transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer"
            >
              Start hosting
            </button>
          )}

          <button
            type="button"
            onClick={onBackToLanding || onBack}
            className="mt-3 text-xs sm:text-sm text-center sm:text-left block transition-colors cursor-pointer"
          >
            <span className="font-semibold text-[#16120F]">Return to landing page</span>
          </button>
        </div>
      </div>
    </div>
  );
}
