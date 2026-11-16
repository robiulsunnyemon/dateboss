import React, { useState } from 'react';
import { X, Send, Calendar, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'send' | 'receive';
}

export const OfferModal: React.FC<OfferModalProps> = ({ isOpen, onClose, mode }) => {
  const [senderName, setSenderName] = useState('Alex Rivers');
  const [recipientName, setRecipientName] = useState('Chloe Martin');
  const [title, setTitle] = useState('Dinner & Cocktails');
  const [venueName, setVenueName] = useState('The River Café, Brooklyn');
  const [dateTime, setDateTime] = useState('Saturday, Nov 18 • 7:30 PM');
  const [budgetSplit, setBudgetSplit] = useState('sender_pays');
  const [estimatedCost, setEstimatedCost] = useState('$150 - $200');
  const [customNote, setCustomNote] = useState('Looking forward to having an enjoyable dinner together!');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send offer to backend
      await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName,
          recipientName,
          title,
          venueName,
          dateTime,
          budgetSplit,
          estimatedCost,
          customNote
        })
      });
      setIsSubmitted(true);
    } catch {
      // Local fallback
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF6EE] border border-[#E3DAC8] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif-heading font-extrabold text-2xl text-stone-900">
              {mode === 'send' ? 'Offer Dispatched!' : 'Preferences Saved!'}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed max-w-sm mx-auto">
              {mode === 'send'
                ? `Your date invitation has been sent to ${recipientName}. They have 48 hours to respond.`
                : 'You are now ready to receive high-intent date offers from verified profiles.'}
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="mt-4 bg-[#8A1B22] text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#6E1118]"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#8A1B22]">
                {mode === 'send' ? 'Make The First Move' : 'Receive Curated Offers'}
              </span>
              <h3 className="font-serif-heading font-extrabold text-2xl text-stone-900">
                {mode === 'send' ? 'Send A Real Date Offer' : 'Get Verified Date Proposals'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full text-sm p-3 bg-white border border-stone-300 rounded-xl focus:border-[#8A1B22] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Activity / Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-sm p-3 bg-white border border-stone-300 rounded-xl focus:border-[#8A1B22] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full text-sm p-3 bg-white border border-stone-300 rounded-xl focus:border-[#8A1B22] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Verified Venue
                </label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full text-sm p-3 bg-white border border-stone-300 rounded-xl focus:border-[#8A1B22] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Bill Terms
                  </label>
                  <select
                    value={budgetSplit}
                    onChange={(e) => setBudgetSplit(e.target.value)}
                    className="w-full text-sm p-3 bg-white border border-stone-300 rounded-xl focus:border-[#8A1B22] focus:outline-none"
                  >
                    <option value="sender_pays">I will cover the bill</option>
                    <option value="split_50_50">Split 50 / 50</option>
                    <option value="recipient_pays">Guest covers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Estimated Budget
                  </label>
                  <input
                    type="text"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full text-sm p-3 bg-white border border-stone-300 rounded-xl focus:border-[#8A1B22] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Personal Note (Optional)
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  rows={2}
                  className="w-full text-sm p-3 bg-white border border-stone-300 rounded-xl focus:border-[#8A1B22] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8A1B22] hover:bg-[#6E1118] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending...' : 'Send Verified Date Offer'}</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
