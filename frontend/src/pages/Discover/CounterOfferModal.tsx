import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Plus } from 'lucide-react';

interface CounterOfferModalProps {
  recipientName: string;
  defaultOccasion?: string;
  defaultGiftAmount?: number;
  onClose: () => void;
  onSubmitSuccess: (counterData: any) => void;
}

const OCCASIONS = ['Dinner', 'Lunch', 'Events'];
const TIME_SLOTS = [
  'Thu, Nov 5 · 8:00 PM',
  'Fri, Nov 6 · 7:30 PM',
  'Sat, Nov 7 · 8:00 PM',
];
const GIFT_TIERS = [50, 100, 250, 350];

export function CounterOfferModal({
  recipientName,
  defaultOccasion = 'Dinner',
  defaultGiftAmount = 200,
  onClose,
  onSubmitSuccess,
}: CounterOfferModalProps) {
  const [selectedOccasion, setSelectedOccasion] = useState(defaultOccasion);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [whereLocation, setWhereLocation] = useState('Le Bernardin');
  const [giftAmount, setGiftAmount] = useState<number>(defaultGiftAmount);
  const [isCustomGift, setIsCustomGift] = useState(false);
  const [customGiftInput, setCustomGiftInput] = useState('');
  const [shortNote, setShortNote] = useState(
    'Would Saturday 8:30 PM suit your schedule instead?'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess({
        occasion: selectedOccasion,
        time: selectedTime,
        venue: whereLocation,
        giftAmount: isCustomGift ? Number(customGiftInput) || 200 : giftAmount,
        note: shortNote,
      });
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-[480px] min-h-screen sm:min-h-0 bg-[#FAF7F2] sm:rounded-[32px] border border-[#EADBCA] shadow-2xl p-5 sm:p-7 flex flex-col justify-between my-auto">
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#9F1E19] text-white flex items-center justify-center hover:bg-[#851713] transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="font-serif font-bold text-xl text-[#16120F]">
              Counter
            </h2>
          </div>

          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9F1E19] mb-1">
            Adjust invitation details for {recipientName}
          </div>

          <h1 className="font-serif text-2xl sm:text-[26px] font-bold text-[#16120F] leading-tight mb-4">
            Suggest Alternate Time & Place
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Occasion */}
            <div>
              <label className="block text-xs font-bold text-[#16120F] mb-1.5">
                Occasion
              </label>
              <div className="flex gap-2">
                {OCCASIONS.map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setSelectedOccasion(occ)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedOccasion === occ
                        ? 'bg-[#16120F] text-white shadow-xs'
                        : 'bg-[#F2ECE1] text-[#16120F] hover:bg-[#EAE2D4]'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* When */}
            <div>
              <label className="block text-xs font-bold text-[#16120F] mb-1.5">
                When
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTime === slot;
                  const [day, time] = slot.split(' · ');
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#16120F] border-[#16120F] text-white shadow-xs'
                          : 'bg-[#F5EFE6] border-[#E5DDD0] text-[#16120F] hover:bg-[#ECE4D6]'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{day}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-[#6E6A63]'}`}>
                        {time}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Where */}
            <div>
              <label className="block text-xs font-bold text-[#16120F] mb-1.5">
                Where
              </label>
              <input
                type="text"
                value={whereLocation}
                onChange={(e) => setWhereLocation(e.target.value)}
                placeholder="Neighborhood or city"
                className="w-full bg-[#F5EFE6] border border-[#E5DDD0] rounded-xl px-3.5 py-2.5 text-xs text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
              />
            </div>

            {/* Courtesy Gift / Appreciation */}
            <div>
              <label className="block text-xs font-bold text-[#16120F] mb-1.5">
                Courtesy Gift / Appreciation
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {GIFT_TIERS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setGiftAmount(amt);
                      setIsCustomGift(false);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      giftAmount === amt && !isCustomGift
                        ? 'bg-[#16120F] text-white shadow-xs'
                        : 'bg-[#F2ECE1] text-[#16120F] hover:bg-[#EAE2D4]'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomGift(true)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 border border-dashed ${
                    isCustomGift
                      ? 'border-[#9F1E19] bg-[#9F1E19]/10 text-[#9F1E19]'
                      : 'border-[#D9CFC1] text-[#6E6A63]'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  Custom
                </button>
              </div>

              {isCustomGift && (
                <div className="relative">
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

            {/* Escrow Note */}
            <div className="flex items-start gap-2 pt-1 text-[11px] text-[#6E6A63]">
              <ShieldCheck className="w-4 h-4 text-[#9F1E19] shrink-0 mt-0.5" />
              <span>
                Held securely when you send. Released once you both confirm the date happened.
              </span>
            </div>

            {/* Short Note */}
            <div>
              <label className="block text-xs font-bold text-[#16120F] mb-1.5">
                A Short Note (Optional)
              </label>
              <textarea
                rows={2}
                value={shortNote}
                onChange={(e) => setShortNote(e.target.value)}
                placeholder="I loved your dining idea! Let's meet at 8:30..."
                className="w-full bg-[#F5EFE6] border border-[#E5DDD0] rounded-xl p-3 text-xs text-[#16120F] focus:outline-none focus:border-[#9F1E19] resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#9F1E19] hover:bg-[#851713] text-white py-3 rounded-full font-semibold text-xs transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting Counter...' : 'Send Counter-Proposal'}
              </button>
              <p className="text-[10px] text-center text-[#8A857D] mt-2">
                Expires in 48 hours · Private chat unlocks once accepted
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
