import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface Step4DetailsProps {
  onBack: () => void;
  onComplete?: (data: { nickname: string; location: string }) => void;
}

export function Step4Details({ onBack, onComplete }: Step4DetailsProps) {
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle current location crosshair click
  const handleDetectLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          // If in real environment or demo, show friendly detected city or coordinates
          setLocation('Current Location');
        },
        () => {
          setIsLocating(false);
          setLocation('New York, NY');
        },
        { timeout: 4000 }
      );
    } else {
      setLocation('New York, NY');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onComplete) {
      onComplete({
        nickname: nickname.trim() || 'Boss Member',
        location: location.trim() || 'New York, NY',
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F1E6] sm:bg-[#EFE7DA] py-5 sm:py-12 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F]">
      
      {/* Container: Edge-to-edge on mobile, centered card on desktop matching Figma */}
      <div className="w-full max-w-[760px] bg-[#F5F1E6] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-10 lg:p-12 shadow-none sm:shadow-[0_10px_40px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
        
        {/* Top Header: Dark Red Rounded Back Button + Official thedateboss Logo */}
        <div className="flex items-center gap-3 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl sm:rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
            aria-label="Go back"
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

        {/* Main Headline */}
        <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#16120F] tracking-tight leading-tight mt-6 sm:mt-7">
          Great! You&apos;re Almost There
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-2 mb-6 sm:mb-8 leading-relaxed">
          Let&apos;s start with a few essential details.
        </p>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Field 1: First Name / Nickname */}
          <div>
            <label
              htmlFor="nickname-input"
              className="block font-serif font-bold text-sm text-[#16120F] mb-2"
            >
              First Name/Nickname
            </label>
            <input
              id="nickname-input"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Type your Nickname here.."
              className="w-full bg-[#F5F1E6] border border-[#E5DECF] rounded-full px-5 py-3.5 text-xs sm:text-sm text-[#16120F] placeholder:text-[#6E6A63] focus:outline-none focus:border-[#9F1E19] focus:ring-1 focus:ring-[#9F1E19] transition-colors"
            />
          </div>

          {/* Field 2: Location */}
          <div>
            <label
              htmlFor="location-input"
              className="block font-serif font-bold text-sm text-[#16120F] mb-2"
            >
              Location
            </label>
            <div className="relative w-full">
              <input
                id="location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Type your location"
                className="w-full bg-[#F5F1E6] border border-[#E5DECF] rounded-full pl-5 pr-12 py-3.5 text-xs sm:text-sm text-[#16120F] placeholder:text-[#6E6A63] focus:outline-none focus:border-[#9F1E19] focus:ring-1 focus:ring-[#9F1E19] transition-colors"
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                title="Detect current location"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E6A63] hover:text-[#9F1E19] transition-colors p-1"
              >
                {/* 4-point diamond crosshair icon matching screenshot */}
                <svg
                  className={`w-4 h-4 ${isLocating ? 'animate-spin text-[#9F1E19]' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3 L21 12 L12 21 L3 12 Z" />
                  <line x1="12" y1="1" x2="12" y2="4" />
                  <line x1="12" y1="20" x2="12" y2="23" />
                  <line x1="1" y1="12" x2="4" y2="12" />
                  <line x1="20" y1="12" x2="23" y2="12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Action Button & Terms: Full-width on mobile, Left-aligned compact pill on desktop */}
          <div className="pt-2 sm:pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-3.5 sm:py-3 px-8 rounded-full shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Create account</span>
              {submitted && <CheckCircle2 className="w-4 h-4 text-white" />}
            </button>

            {/* Terms of Use Notice */}
            <p className="text-center sm:text-left text-xs text-[#6E6A63] mt-3 sm:mt-3.5 leading-relaxed">
              By creating an account, you agree to{' '}
              <a
                href="#terms"
                onClick={(e) => e.preventDefault()}
                className="underline hover:text-[#9F1E19] transition-colors"
              >
                Terms of Use.
              </a>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}
