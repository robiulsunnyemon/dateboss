import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { UserRole, GenderIdentity, GenderPreference } from '../../types/onboarding';

interface Step1BeginProps {
  initialRole?: UserRole | null;
  onBack: () => void;
  onContinueToStep2?: (data: {
    role: UserRole;
    whoYouAre: GenderIdentity;
    whoToMeet: GenderPreference;
  }) => void;
  onJoinAsHostDirect?: () => void;
  onJoinAsGuestDirect?: () => void;
}

export function Step1Begin({
  onBack,
  onContinueToStep2,
  onJoinAsHostDirect,
  onJoinAsGuestDirect,
}: Step1BeginProps) {
  const [whoYouAre, setWhoYouAre] = useState<GenderIdentity | null>(null);
  const [whoToMeet, setWhoToMeet] = useState<GenderPreference | null>(null);
  const [hasPromptError, setHasPromptError] = useState(false);

  const canContinue = Boolean(whoYouAre && whoToMeet);

  const handleContinue = () => {
    // Both 'Who You Are' and 'Who Would You Like To Meet' MUST be selected for Continue button navigation
    if (!whoYouAre || !whoToMeet) {
      setHasPromptError(true);
      return;
    }

    setHasPromptError(false);

    if (onContinueToStep2) {
      onContinueToStep2({
        role: whoYouAre === 'Women' ? 'guest' : 'host',
        whoYouAre,
        whoToMeet,
      });
    } else if (whoYouAre === 'Women' && onJoinAsGuestDirect) {
      onJoinAsGuestDirect();
    } else if (onJoinAsHostDirect) {
      onJoinAsHostDirect();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F1E6] sm:bg-[#EFE7DA] py-5 sm:py-12 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F]">
      
      {/* Container: Edge-to-edge on mobile, centered card on desktop */}
      <div className="w-full max-w-[760px] bg-[#F5F1E6] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-10 lg:p-12 shadow-none sm:shadow-[0_10px_40px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
        
        {/* Top Header: Dark Red Rounded Back Button + Official thedateboss Logo */}
        <div className="flex items-center gap-3 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
            aria-label="Go back to landing page"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="flex items-center shrink-0">
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </a>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-5 sm:mt-7">
          <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
          <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
            Step 1 of 3
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif font-bold text-2xl sm:text-4xl text-[#16120F] tracking-tight leading-tight mt-2">
          How Would You Like <br />
          To Begin?
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-2 leading-relaxed">
          Your role is about what you do here. You can switch any time.
        </p>

        {/* Two Role Cards (Stacked on mobile, side-by-side on desktop) */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3.5 sm:gap-4 my-5 sm:my-6">
          
          {/* Card 1: Host (Hover effect only, not selectable as a card) */}
          <div className="bg-[#F5F1E6] rounded-[22px] sm:rounded-[24px] p-5 flex flex-col justify-between min-h-[185px] sm:min-h-[195px] border border-[#E8DFD0] hover:border-[#9F1E19]/40 hover:shadow-xs transition-all">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[#6E6A63]">
                <span className="text-[#FCB943] text-sm leading-none">👑</span>
                <span className="font-medium">Host (Men)</span>
              </div>
              <h3 className="font-serif font-bold text-[#16120F] text-base sm:text-lg leading-snug">
                You Send The Invitations. Pick The Place And The Time.
              </h3>
            </div>

            {/* Direct Join as Host button -> directly navigates to Step 2 Interests */}
            <button
              type="button"
              onClick={() => {
                if (onJoinAsHostDirect) {
                  onJoinAsHostDirect();
                } else if (onContinueToStep2) {
                  onContinueToStep2({
                    role: 'host',
                    whoYouAre: whoYouAre || 'Men',
                    whoToMeet: whoToMeet || 'Women',
                  });
                }
              }}
              className="w-full bg-[#FCB943] hover:bg-[#E09C2C] text-[#16120F] font-bold text-xs py-3.5 px-4 rounded-full transition-colors mt-4 text-center shadow-xs cursor-pointer active:scale-[0.99]"
            >
              Join as a Host (Men)
            </button>
          </div>

          {/* Card 2: Guest of Honor (Hover effect only, not selectable as a card) */}
          <div className="bg-[#F5F1E6] rounded-[22px] sm:rounded-[24px] p-5 flex flex-col justify-between min-h-[185px] sm:min-h-[195px] border border-[#E8DFD0] hover:border-[#9F1E19]/40 hover:shadow-xs transition-all">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[#6E6A63]">
                <span className="text-[#8E8A83] text-sm leading-none">👑</span>
                <span className="font-medium">Guest of Honor (Women)</span>
              </div>
              <h3 className="font-serif font-bold text-[#16120F] text-base sm:text-lg leading-snug">
                You Receive The Invitations. Say Yes, Counter Or Pass.
              </h3>
            </div>

            {/* Direct Join as Guest button -> directly navigates to Guest Events */}
            <button
              type="button"
              onClick={() => {
                if (onJoinAsGuestDirect) {
                  onJoinAsGuestDirect();
                } else if (onContinueToStep2) {
                  onContinueToStep2({
                    role: 'guest',
                    whoYouAre: whoYouAre || 'Women',
                    whoToMeet: whoToMeet || 'Men',
                  });
                }
              }}
              className="w-full bg-[#9F1E19] hover:bg-[#851713] text-white font-bold text-xs py-3.5 px-4 rounded-full transition-colors mt-4 text-center shadow-xs cursor-pointer active:scale-[0.99]"
            >
              Join as a Guest of Honor (Women)
            </button>
          </div>

        </div>

        {/* Question 1: Who You Are? */}
        <div className="mt-5 sm:mt-6">
          <h4 className="font-serif font-bold text-base sm:text-lg text-[#16120F] mb-2.5">
            Who You Are?
          </h4>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
            {(['Men', 'Women', 'Everyone'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setWhoYouAre(option);
                  setHasPromptError(false);
                }}
                className={`w-full sm:w-auto text-center text-xs font-medium py-3 sm:py-2.5 sm:px-6 rounded-full transition-all cursor-pointer ${
                  whoYouAre === option
                    ? 'bg-[#16120F] text-white shadow-xs'
                    : 'bg-transparent border border-[#E5DECF] text-[#6E6A63] hover:border-[#16120F]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Who Would You Like To Meet? */}
        <div className="mt-4 sm:mt-5">
          <h4 className="font-serif font-bold text-base sm:text-lg text-[#16120F] mb-2.5">
            Who Would You Like To Meet?
          </h4>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
            {(['Men', 'Women', 'Everyone'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setWhoToMeet(option);
                  setHasPromptError(false);
                }}
                className={`w-full sm:w-auto text-center text-xs font-medium py-3 sm:py-2.5 sm:px-6 rounded-full transition-all cursor-pointer ${
                  whoToMeet === option
                    ? 'bg-[#16120F] text-white shadow-xs'
                    : 'bg-transparent border border-[#E5DECF] text-[#6E6A63] hover:border-[#16120F]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button & ID verification note */}
        <div className="mt-6 sm:mt-8 pt-1 text-center">
          {hasPromptError && (!whoYouAre || !whoToMeet) && (
            <p className="text-xs text-[#9F1E19] font-medium mb-3 animate-in fade-in">
              Please select who you are and who you would like to meet to continue.
            </p>
          )}

          <button
            type="button"
            onClick={handleContinue}
            className={`w-full font-bold text-xs py-4 sm:py-3.5 px-10 rounded-full transition-all text-center shadow-sm ${
              canContinue
                ? 'bg-[#9F1E19] hover:bg-[#851713] text-white cursor-pointer active:scale-[0.99]'
                : 'bg-[#9F1E19]/45 text-white/80 cursor-not-allowed'
            }`}
          >
            Continue
          </button>

          <p className="text-xs text-[#6E6A63] mt-3 font-normal">
            ID verification comes next
          </p>
        </div>

      </div>

    </div>
  );
}

export default Step1Begin;
