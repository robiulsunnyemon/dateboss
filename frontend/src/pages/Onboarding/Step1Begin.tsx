import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { UserRole, GenderIdentity, GenderPreference } from '../../types/onboarding';

interface Step1BeginProps {
  initialRole?: UserRole;
  onBack: () => void;
  onContinueToStep2?: (data: {
    role: UserRole;
    whoYouAre: GenderIdentity;
    whoToMeet: GenderPreference;
  }) => void;
}

export function Step1Begin({
  initialRole = 'host',
  onBack,
  onContinueToStep2,
}: Step1BeginProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [whoYouAre, setWhoYouAre] = useState<GenderIdentity>('Men');
  const [whoToMeet, setWhoToMeet] = useState<GenderPreference>('Women');

  const handleContinue = () => {
    if (onContinueToStep2) {
      onContinueToStep2({
        role: selectedRole,
        whoYouAre,
        whoToMeet,
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] sm:bg-[#EFE7DA] py-5 sm:py-12 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#1E1C1A]">
      
      {/* Container: Edge-to-edge on mobile, centered card on desktop */}
      <div className="w-full max-w-[760px] bg-[#FAF7F2] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-10 lg:p-12 shadow-none sm:shadow-[0_10px_40px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
        
        {/* Top Header: Dark Red Rounded Back Button + Official thedateboss Logo */}
        <div className="flex items-center gap-3 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-[#961C23] hover:bg-[#7D141A] text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
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
          <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
          <span className="text-xs font-semibold text-[#961C23] tracking-wide">
            Step 1 of 3
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif font-bold text-2xl sm:text-4xl text-[#1A1816] tracking-tight leading-tight mt-2">
          How Would You Like <br />
          To Begin?
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6860] text-xs sm:text-sm font-normal mt-2 leading-relaxed">
          Your role is about what you do here. You can switch any time.
        </p>

        {/* Two Role Cards (Stacked on mobile, side-by-side on desktop) */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3.5 sm:gap-4 my-5 sm:my-6">
          
          {/* Card 1: Host */}
          <div
            onClick={() => setSelectedRole('host')}
            className={`bg-[#FAF7F2] rounded-[22px] sm:rounded-[24px] p-5 flex flex-col justify-between min-h-[185px] sm:min-h-[195px] cursor-pointer transition-all ${
              selectedRole === 'host'
                ? 'border-[1.5px] border-[#961C23] shadow-xs'
                : 'border border-[#E8DFD0] hover:border-[#961C23]/60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[#6E6861]">
                <span className="text-[#F3A83B] text-sm leading-none">👑</span>
                <span className="font-medium">Host</span>
              </div>
              <h3 className="font-serif font-bold text-[#1A1816] text-base sm:text-lg leading-snug">
                You Send The Offers. Pick The Place And The Time.
              </h3>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRole('host');
                if (onContinueToStep2) {
                  onContinueToStep2({
                    role: 'host',
                    whoYouAre,
                    whoToMeet,
                  });
                }
              }}
              className="w-full bg-[#F3A83B] hover:bg-[#DE952B] text-[#1E1C1A] font-bold text-xs py-3.5 px-4 rounded-full transition-colors mt-4 text-center shadow-xs"
            >
              Join as a Host
            </button>
          </div>

          {/* Card 2: Guest of Honor */}
          <div
            onClick={() => setSelectedRole('guest')}
            className={`bg-[#FAF7F2] rounded-[22px] sm:rounded-[24px] p-5 flex flex-col justify-between min-h-[185px] sm:min-h-[195px] cursor-pointer transition-all ${
              selectedRole === 'guest'
                ? 'border-[1.5px] border-[#961C23] shadow-xs'
                : 'border border-[#E8DFD0] hover:border-[#961C23]/60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[#6E6861]">
                <span className="text-[#8E8A83] text-sm leading-none">👑</span>
                <span className="font-medium">Guest of Honor</span>
              </div>
              <h3 className="font-serif font-bold text-[#1A1816] text-base sm:text-lg leading-snug">
                You Receive The Offers. Say Yes, Counter Or Pass.
              </h3>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRole('guest');
              }}
              className="w-full bg-[#961C23] hover:bg-[#7D141A] text-white font-bold text-xs py-3.5 px-4 rounded-full transition-colors mt-4 text-center shadow-xs"
            >
              Join as a Guest of Honor
            </button>
          </div>

        </div>

        {/* Question 1: Who You Are? */}
        <div className="mt-5 sm:mt-6">
          <h4 className="font-serif font-bold text-base sm:text-lg text-[#1A1816] mb-2.5">
            Who You Are?
          </h4>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
            {(['Men', 'Women', 'Everyone'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setWhoYouAre(option)}
                className={`w-full sm:w-auto text-center text-xs font-medium py-3 sm:py-2.5 sm:px-6 rounded-full transition-all ${
                  whoYouAre === option
                    ? 'bg-[#141414] text-white shadow-xs'
                    : 'bg-transparent border border-[#E5DECF] text-[#5F5B54] hover:border-[#1A1816]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Who Would You Like To Meet? */}
        <div className="mt-4 sm:mt-5">
          <h4 className="font-serif font-bold text-base sm:text-lg text-[#1A1816] mb-2.5">
            Who Would You Like To Meet?
          </h4>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
            {(['Men', 'Women', 'Everyone'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setWhoToMeet(option)}
                className={`w-full sm:w-auto text-center text-xs font-medium py-3 sm:py-2.5 sm:px-6 rounded-full transition-all ${
                  whoToMeet === option
                    ? 'bg-[#141414] text-white shadow-xs'
                    : 'bg-transparent border border-[#E5DECF] text-[#5F5B54] hover:border-[#1A1816]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button & ID verification note */}
        <div className="mt-6 sm:mt-8 pt-1 text-center">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full bg-[#961C23] hover:bg-[#7D141A] text-white font-bold text-xs py-4 sm:py-3.5 px-10 rounded-full transition-colors shadow-sm text-center"
          >
            Continue
          </button>

          <p className="text-xs text-[#8E8880] mt-3 font-normal">
            ID verification comes next
          </p>
        </div>

      </div>

    </div>
  );
}

export default Step1Begin;
