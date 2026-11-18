import React, { useState } from 'react';
import { ArrowLeft, Send, ShieldCheck, Plus } from 'lucide-react';

export interface InviteDetailsViewProps {
  targetProfileName?: string;
  selectedEvents?: string[];
  onBack: () => void;
  onSendOffer: (offerData: {
    occasion: string;
    when: string;
    where: string;
    giftAmount: number;
    shortNote: string;
  }) => void;
}

export function InviteDetailsView({
  targetProfileName = 'Camila',
  selectedEvents = [],
  onBack,
  onSendOffer,
}: InviteDetailsViewProps) {
  // Occasion selection (Dinner, Lunch, Events) - default Dinner matching Figma
  const [occasion, setOccasion] = useState<string>('Dinner');

  // When selection options
  const whenOptions = [
    { id: 'thu', day: 'Thu, Nov 5', time: '8:00 PM' },
    { id: 'fri', day: 'Fri, Nov 6', time: '7:30 PM' },
    { id: 'sat', day: 'Sat, Nov 7', time: '8:00 PM' },
  ];
  const [selectedWhen, setSelectedWhen] = useState<string>('thu');

  // Location / Where
  const [whereLocation, setWhereLocation] = useState<string>('');

  // Gift Amount
  const [giftAmount, setGiftAmount] = useState<number>(150);
  const [showCustomGift, setShowCustomGift] = useState<boolean>(false);
  const [customGiftInput, setCustomGiftInput] = useState<string>('');

  // Note
  const [shortNote, setShortNote] = useState<string>(
    'Heard you like long dinners. I know a quiet table.'
  );

  const handleCustomGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customGiftInput.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      setGiftAmount(parsed);
      setShowCustomGift(false);
      setCustomGiftInput('');
    }
  };

  const handleSend = () => {
    const activeWhenObj = whenOptions.find((w) => w.id === selectedWhen);
    const whenString = activeWhenObj
      ? `${activeWhenObj.day} at ${activeWhenObj.time}`
      : 'Thu, Nov 5 at 8:00 PM';

    onSendOffer({
      occasion,
      when: whenString,
      where: whereLocation || 'Le Bernardin, Midtown Manhattan',
      giftAmount,
      shortNote,
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] sm:bg-[#EFE7DA] py-0 sm:py-10 px-0 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F] animate-in fade-in duration-200">
      {/* Centered White/Cream Card matching Figma Desktop View & edge-to-edge on mobile */}
      <div className="w-full max-w-[840px] bg-[#FAF7F2] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-5 sm:p-9 lg:p-11 shadow-none sm:shadow-[0_10px_35px_rgba(22,18,15,0.05)]">
        
        {/* Top Header: Dark Red Rounded Back Button + thedateboss Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            className="flex items-center gap-2 select-none"
          >
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </a>
        </div>

        {/* Eyebrow: — New offer to [Name] */}
        <div className="flex items-center gap-2 mt-6 sm:mt-7">
          <span className="w-4 h-[1.5px] bg-[#9F1E19]"></span>
          <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
            New offer to {targetProfileName}
          </span>
        </div>

        {/* Headline: What Are You Inviting Her To? */}
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] tracking-tight leading-tight mt-1.5">
          What Are You Inviting Her To?
        </h1>

        <div className="mt-6 space-y-5 sm:space-y-6">
          
          {/* 1. Occasion */}
          <div>
            <label className="block text-xs font-semibold text-[#16120F] mb-2.5">
              Occasion
            </label>
            <div className="flex items-center gap-2">
              {['Dinner', 'Lunch', 'Events'].map((item) => {
                const isSelected = occasion === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setOccasion(item)}
                    className={`px-5 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#16120F] text-white shadow-xs'
                        : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:bg-[#F5EFE6]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. When */}
          <div>
            <label className="block text-xs font-semibold text-[#16120F] mb-2.5">
              When
            </label>
            <div className="flex items-center gap-2 sm:gap-3 max-w-[380px]">
              {whenOptions.map((opt) => {
                const isSelected = selectedWhen === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedWhen(opt.id)}
                    className={`flex-1 rounded-[14px] sm:rounded-[16px] py-2.5 px-3 text-center cursor-pointer transition-all select-none ${
                      isSelected
                        ? 'bg-[#16120F] text-white shadow-xs'
                        : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:bg-[#F5EFE6]'
                    }`}
                  >
                    <div
                      className={`text-xs sm:text-[13px] font-semibold leading-tight ${
                        isSelected ? 'text-white' : 'text-[#16120F]'
                      }`}
                    >
                      {opt.day}
                    </div>
                    <div
                      className={`text-[11px] sm:text-xs mt-0.5 leading-tight ${
                        isSelected ? 'text-[#C8C4BC]' : 'text-[#6E6A63]'
                      }`}
                    >
                      {opt.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Where */}
          <div>
            <label className="block text-xs font-semibold text-[#16120F] mb-2.5">
              Where
            </label>
            <input
              type="text"
              value={whereLocation}
              onChange={(e) => setWhereLocation(e.target.value)}
              placeholder="Neighborhood or city"
              className="w-full bg-[#FAF7F2] border border-[#E5DDD0] rounded-full px-5 py-3 text-xs sm:text-sm text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19] transition-colors"
            />
          </div>

          {/* 4. Gift Amount */}
          <div>
            <label className="block text-xs font-semibold text-[#16120F] mb-2.5">
              Gift Amount
            </label>
            
            {/* Display / Input box */}
            <div className="w-full bg-[#FAF7F2] border border-[#E5DDD0] rounded-full px-5 py-3 text-xs sm:text-sm font-medium text-[#16120F] mb-3">
              ${giftAmount}
            </div>

            {/* Quick amount options */}
            <div className="flex items-center gap-2">
              {[50, 100, 150, 250].map((amt) => {
                const isSelected = giftAmount === amt && !showCustomGift;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setGiftAmount(amt);
                      setShowCustomGift(false);
                    }}
                    className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#16120F] text-white shadow-xs'
                        : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:bg-[#F5EFE6]'
                    }`}
                  >
                    ${amt}
                  </button>
                );
              })}
            </div>

            {/* Custom amount toggle on the line below */}
            <div className="mt-2.5">
              {showCustomGift ? (
                <form
                  onSubmit={handleCustomGiftSubmit}
                  className="inline-flex items-center gap-1.5 animate-in fade-in duration-150"
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#6E6A63]">$</span>
                    <input
                      type="number"
                      autoFocus
                      value={customGiftInput}
                      onChange={(e) => setCustomGiftInput(e.target.value)}
                      placeholder="Amount"
                      className="w-24 bg-[#FAF7F2] border border-[#9F1E19] rounded-full pl-6 pr-2 py-1 text-xs text-[#16120F] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#9F1E19] hover:bg-[#851713] text-white text-xs px-3 py-1 rounded-full font-medium cursor-pointer"
                  >
                    Set
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomGift(false)}
                    className="text-xs text-[#6E6A63] hover:text-[#16120F] px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomGift(true)}
                  className="border border-dashed border-[#E09094] bg-[#FBEFF0]/50 hover:bg-[#FBEFF0] text-[#9F1E19] rounded-full px-4 py-1.5 text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Custom</span>
                </button>
              )}
            </div>

            {/* Escrow safety badge */}
            <div className="flex items-center gap-1.5 mt-3 text-[11px] sm:text-xs text-[#8A857D]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9F1E19] shrink-0" />
              <span>
                Held securely when you send. Released once you both confirm the date happened.
              </span>
            </div>
          </div>

          {/* 5. A Short Note (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-[#16120F] mb-2.5">
              A Short Note (Optional)
            </label>
            <textarea
              rows={2}
              value={shortNote}
              onChange={(e) => setShortNote(e.target.value)}
              placeholder="Write a warm note..."
              className="w-full bg-[#FAF7F2] border border-[#E5DDD0] rounded-[20px] p-4 text-xs sm:text-sm text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* 6. Send Offer Action Button & Subtext */}
          <div className="pt-2">
            <div className="flex flex-col items-center sm:items-start">
              <button
                type="button"
                onClick={handleSend}
                className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-3.5 px-9 rounded-full shadow-sm transition-all active:scale-[0.99] cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 rotate-45" />
                <span>Send offer</span>
              </button>

              <p className="text-[11px] sm:text-xs text-[#8A857D] mt-2.5 text-center sm:text-left">
                Expires in 48 hours · Chat opens once she accepts
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default InviteDetailsView;
