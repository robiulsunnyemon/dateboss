import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import { DiscoverProfile } from './DiscoverPage';

interface AskForAnOfferModalProps {
  hostProfile?: DiscoverProfile | null;
  onClose: () => void;
  onSubmitSuccess: (data: any) => void;
}

const PLAN_OPTIONS = ['Dinner', 'Lunch', 'Concerts', 'Walks', 'Weddings'];

const TIME_OPTIONS = [
  'Thu, Nov 5 · 8:00 PM',
  'Fri, Nov 6 · 7:30 PM',
  'Sat, Nov 7 · 8:00 PM',
];

const GIFT_OPTIONS = [50, 100, 250, 350];

export function AskForAnOfferModal({ hostProfile, onClose, onSubmitSuccess }: AskForAnOfferModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('Dinner');
  const [customPlan, setCustomPlan] = useState<string>('');
  const [isCustomPlanActive, setIsCustomPlanActive] = useState<boolean>(false);

  const [selectedTime, setSelectedTime] = useState<string>('Thu, Nov 5 · 8:00 PM');
  const [location, setLocation] = useState<string>('');
  const [idealDateNote, setIdealDateNote] = useState<string>('');

  const [giftAmount, setGiftAmount] = useState<number>(250);
  const [isCustomGiftActive, setIsCustomGiftActive] = useState<boolean>(false);
  const [customGiftInput, setCustomGiftInput] = useState<string>('');

  const [targetHostAudience, setTargetHostAudience] = useState<string>(
    hostProfile ? hostProfile.name : 'Any verified host'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess({
        plan: isCustomPlanActive ? customPlan : selectedPlan,
        time: selectedTime,
        location: location || 'Midtown Manhattan',
        note: idealDateNote,
        giftAmount: isCustomGiftActive ? Number(customGiftInput) || 250 : giftAmount,
        targetHost: targetHostAudience,
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[480px] min-h-screen sm:min-h-0 bg-[#FAF7F2] sm:rounded-[32px] border border-[#EADBCA] shadow-2xl p-5 sm:p-7 flex flex-col justify-between my-auto">
        
        {/* Top Header Bar */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#9F1E19] text-white flex items-center justify-center hover:bg-[#851713] transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <span className="font-serif italic font-bold text-xl text-[#9F1E19] tracking-tight">
              thedateboss
            </span>
          </div>

          {/* Subtitle tag */}
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9F1E19] mb-1">
            Requests a date
          </div>

          {/* Title & Description */}
          <h1 className="font-serif text-2xl sm:text-[28px] font-bold text-[#16120F] leading-tight">
            Ask For An Offer
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6E6A63] mt-1.5 leading-relaxed font-normal">
            Tell Hosts what you'd love. They send you a gifted offer and you choose who to accept.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* 1. The Plan */}
            <div>
              <label className="block text-xs font-bold text-[#16120F] mb-2">
                The Plan
              </label>
              <div className="flex flex-wrap gap-2">
                {PLAN_OPTIONS.map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setIsCustomPlanActive(false);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedPlan === plan && !isCustomPlanActive
                        ? 'bg-[#16120F] text-white shadow-xs'
                        : 'bg-[#F2ECE1] text-[#16120F] hover:bg-[#EAE2D4]'
                    }`}
                  >
                    {plan}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomPlanActive(true)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 border border-dashed ${
                    isCustomPlanActive
                      ? 'border-[#9F1E19] bg-[#9F1E19]/10 text-[#9F1E19]'
                      : 'border-[#D9CFC1] text-[#6E6A63] hover:text-[#16120F]'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  Custom
                </button>
              </div>

              {isCustomPlanActive && (
                <input
                  type="text"
                  value={customPlan}
                  onChange={(e) => setCustomPlan(e.target.value)}
                  placeholder="Enter custom plan (e.g. Rooftop Jazz, Opera)"
                  className="mt-2 w-full bg-[#FAF7F2] border border-[#E0D7C7] rounded-xl px-3 py-2 text-xs text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
                  autoFocus
                />
              )}
            </div>

            {/* 2. When */}
            <div>
              <label className="block text-xs font-bold text-[#16120F] mb-2">
                When
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_OPTIONS.map((timeOpt) => {
                  const isSelected = selectedTime === timeOpt;
                  const [dayDate, time] = timeOpt.split(' · ');
                  return (
                    <button
                      key={timeOpt}
                      type="button"
                      onClick={() => setSelectedTime(timeOpt)}
                      className={`py-2 px-2 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#16120F] border-[#16120F] text-white shadow-xs'
                          : 'bg-[#F5EFE6] border-[#E5DDD0] text-[#16120F] hover:bg-[#ECE4D6]'
                      }`}
                    >
                      <span className="text-[11px] font-bold leading-tight">{dayDate}</span>
                      <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-gray-300' : 'text-[#6E6A63]'}`}>
                        {time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Where */}
            <div>
              <label className="block text-xs font-bold text-[#16120F] mb-1.5">
                Where
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Neighborhood or city"
                className="w-full bg-[#F5EFE6] border border-[#E5DDD0] rounded-xl px-3.5 py-2.5 text-xs text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19] focus:bg-white transition-all"
              />
            </div>

            {/* 4. What Would Make It Perfect? */}
            <div>
              <label className="block text-xs font-bold text-[#16120F] mb-1.5">
                What Would Make It Perfect?
              </label>
              <input
                type="text"
                value={idealDateNote}
                onChange={(e) => setIdealDateNote(e.target.value)}
                placeholder="Describe your ideal date"
                className="w-full bg-[#F5EFE6] border border-[#E5DDD0] rounded-xl px-3.5 py-2.5 text-xs text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19] focus:bg-white transition-all"
              />
            </div>

            {/* 5. Gift I'm Hoping For */}
            <div>
              <label className="block text-xs font-bold text-[#16120F] mb-1.5">
                Gift I'm Hoping For
              </label>
              <div className="w-full bg-[#F5EFE6] border border-[#E5DDD0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#16120F] mb-2 flex items-center justify-between">
                <span>Selected Escrow Gift:</span>
                <span className="text-[#9F1E19] text-sm">
                  ${isCustomGiftActive ? customGiftInput || '0' : giftAmount}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {GIFT_OPTIONS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setGiftAmount(amt);
                      setIsCustomGiftActive(false);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      giftAmount === amt && !isCustomGiftActive
                        ? 'bg-[#16120F] text-white shadow-xs'
                        : 'bg-[#F2ECE1] text-[#16120F] hover:bg-[#EAE2D4]'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomGiftActive(true)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 border border-dashed ${
                    isCustomGiftActive
                      ? 'border-[#9F1E19] bg-[#9F1E19]/10 text-[#9F1E19]'
                      : 'border-[#D9CFC1] text-[#6E6A63] hover:text-[#16120F]'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  Custom
                </button>
              </div>

              {isCustomGiftActive && (
                <div className="relative mt-2">
                  <span className="absolute left-3 top-2 text-xs font-bold text-[#6E6A63]">$</span>
                  <input
                    type="number"
                    value={customGiftInput}
                    onChange={(e) => setCustomGiftInput(e.target.value)}
                    placeholder="Enter custom gift amount"
                    className="w-full pl-7 pr-3 py-2 bg-[#FAF7F2] border border-[#E0D7C7] rounded-xl text-xs text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* 6. Who Can Answer */}
            <div>
              <label className="block text-xs font-bold text-[#16120F] mb-1.5">
                Who Can Answer
              </label>
              <div className="relative">
                <select
                  value={targetHostAudience}
                  onChange={(e) => setTargetHostAudience(e.target.value)}
                  className="w-full appearance-none bg-[#F5EFE6] border border-[#E5DDD0] rounded-xl px-3.5 py-2.5 text-xs text-[#16120F] font-medium pr-8 focus:outline-none focus:border-[#9F1E19] cursor-pointer"
                >
                  <option value="Any verified host">Any verified host</option>
                  {hostProfile && (
                    <option value={hostProfile.name}>
                      Only {hostProfile.name}
                    </option>
                  )}
                  <option value="Hosts with 4.9+ Reliability">Hosts with 4.9+ Reliability</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#6E6A63] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Escrow Disclaimer */}
            <div className="flex items-start gap-2 pt-1 text-[11px] text-[#6E6A63] leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[#9F1E19] shrink-0 mt-0.5" />
              <span>
                Held securely when you send. Released once you both confirm the date happened.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#9F1E19] hover:bg-[#851713] text-white py-3 rounded-full font-semibold text-xs transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Sending Request...' : 'Send offer'}
              </button>
              <p className="text-[10px] text-center text-[#8A857D] mt-2">
                Expires in 48 hours · Chat opens once host accepts
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
