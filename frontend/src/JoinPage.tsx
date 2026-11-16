import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface JoinPageProps {
  initialRole?: 'host' | 'guest';
  onBack: () => void;
}

export function JoinPage({ initialRole = 'host', onBack }: JoinPageProps) {
  const [selectedRole, setSelectedRole] = useState<'host' | 'guest'>(initialRole);
  const [whoYouAre, setWhoYouAre] = useState<'Men' | 'Women' | 'Everyone'>('Men');
  const [whoToMeet, setWhoToMeet] = useState<'Men' | 'Women' | 'Everyone'>('Women');
  const [submitted, setSubmitted] = useState(false);

  const handleContinue = () => {
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#EFE7DA] py-6 sm:py-12 px-4 sm:px-6 flex items-center justify-center font-sans antialiased text-[#1E1C1A]">
      
      {/* Centered White/Cream Card Container matching Figma */}
      <div className="w-full max-w-[760px] bg-[#FAF7F2] border border-[#E8DFD0] rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
        
        {/* Top Header: Dark Red Rounded Back Button + Official thedateboss Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#961C23] hover:bg-[#7D141A] text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
            aria-label="Go back to landing page"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="flex items-center shrink-0">
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </a>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-6 sm:mt-8">
          <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
          <span className="text-xs font-semibold text-[#961C23] tracking-wide">
            Step 1 of 3
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#1A1816] tracking-tight leading-tight mt-2">
          How Would You Like <br className="hidden sm:inline" />
          To Begin?
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6860] text-xs sm:text-sm font-normal mt-2 leading-relaxed">
          Your role is about what you do here. You can switch any time.
        </p>

        {/* Two Role Cards (Host and Guest of Honor) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          
          {/* Card 1: Host */}
          <div
            onClick={() => setSelectedRole('host')}
            className={`bg-[#FAF7F2] border-2 rounded-[20px] p-5 flex flex-col justify-between min-h-[195px] cursor-pointer transition-all ${
              selectedRole === 'host'
                ? 'border-[#F3A83B] shadow-sm'
                : 'border-[#E8E1D3] hover:border-[#F3A83B]/60'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-[#6E6861]">
                <span className="text-[#F3A83B] text-sm leading-none">👑</span>
                <span className="font-medium">Host</span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg leading-snug">
                You Send The Offers. Pick The Place And The Time.
              </h3>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRole('host');
              }}
              className={`w-full font-bold text-xs py-3 px-4 rounded-full transition-colors mt-4 text-center shadow-sm ${
                selectedRole === 'host'
                  ? 'bg-[#F3A83B] hover:bg-[#DE952B] text-[#1E1C1A]'
                  : 'bg-[#F3A83B]/80 hover:bg-[#F3A83B] text-[#1E1C1A]'
              }`}
            >
              Join as a Host
            </button>
          </div>

          {/* Card 2: Guest of Honor */}
          <div
            onClick={() => setSelectedRole('guest')}
            className={`bg-[#FAF7F2] border-2 rounded-[20px] p-5 flex flex-col justify-between min-h-[195px] cursor-pointer transition-all ${
              selectedRole === 'guest'
                ? 'border-[#961C23] shadow-sm'
                : 'border-[#E8E1D3] hover:border-[#961C23]/60'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-[#6E6861]">
                <span className="text-[#8E8A83] text-sm leading-none">👑</span>
                <span className="font-medium">Guest of Honor</span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg leading-snug">
                You Receive The Offers. Say Yes, Counter Or Pass.
              </h3>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRole('guest');
              }}
              className={`w-full font-bold text-xs py-3 px-4 rounded-full transition-colors mt-4 text-center shadow-sm ${
                selectedRole === 'guest'
                  ? 'bg-[#961C23] hover:bg-[#7D141A] text-white'
                  : 'bg-[#961C23]/80 hover:bg-[#961C23] text-white'
              }`}
            >
              Join as a Guest of Honor
            </button>
          </div>

        </div>

        {/* Question 1: Who You Are? */}
        <div className="mt-6 sm:mt-7">
          <h4 className="font-bold text-xs sm:text-sm text-[#1A1816] mb-2.5">
            Who You Are?
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {(['Men', 'Women', 'Everyone'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setWhoYouAre(option)}
                className={`text-xs font-medium px-5 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all ${
                  whoYouAre === option
                    ? 'bg-[#1A1816] text-white shadow-xs'
                    : 'bg-transparent border border-[#E5DECF] text-[#5F5B54] hover:border-[#1A1816]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Who Would You Like To Meet? */}
        <div className="mt-5 sm:mt-6">
          <h4 className="font-bold text-xs sm:text-sm text-[#1A1816] mb-2.5">
            Who Would You Like To Meet?
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {(['Men', 'Women', 'Everyone'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setWhoToMeet(option)}
                className={`text-xs font-medium px-5 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all ${
                  whoToMeet === option
                    ? 'bg-[#1A1816] text-white shadow-xs'
                    : 'bg-transparent border border-[#E5DECF] text-[#5F5B54] hover:border-[#1A1816]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button & ID verification note */}
        <div className="mt-8 pt-2">
          {submitted ? (
            <div className="p-4 rounded-2xl bg-[#EDE5D6] border border-[#DDD3C2] text-xs text-[#1A1816] space-y-1 animate-in fade-in">
              <p className="font-bold">Step 1 complete!</p>
              <p className="text-[#6E6860]">
                Proceeding to Step 2: ID verification for {selectedRole === 'host' ? 'Host' : 'Guest of Honor'} ({whoYouAre} seeking {whoToMeet}).
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto bg-[#961C23] hover:bg-[#7D141A] text-white font-semibold text-xs px-10 py-3.5 rounded-full transition-colors shadow-sm"
            >
              Continue
            </button>
          )}

          <p className="text-xs text-[#8E8880] mt-3">
            ID verification comes next
          </p>
        </div>

      </div>

    </div>
  );
}

export default JoinPage;
