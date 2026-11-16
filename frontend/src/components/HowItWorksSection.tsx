import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign, Clock, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';

export const HowItWorksSection: React.FC<{ isMobileFrame?: boolean }> = ({ isMobileFrame = false }) => {
  const [offerState, setOfferState] = useState<'pending' | 'accepted' | 'countered' | 'passed'>('pending');
  const [counterNote, setCounterNote] = useState('');
  const [showCounterInput, setShowCounterInput] = useState(false);

  const handleAccept = () => {
    setOfferState('accepted');
    setShowCounterInput(false);
  };

  const handlePass = () => {
    setOfferState('passed');
    setShowCounterInput(false);
  };

  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferState('countered');
    setShowCounterInput(false);
  };

  const handleReset = () => {
    setOfferState('pending');
    setShowCounterInput(false);
  };

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#F7F2E9]/60 border-y border-[#ECE4D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-[#8A1B22]"></span>
            <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#8A1B22]">
              How It Works
            </span>
          </div>
          <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-tight">
            Less Chat. <br className="sm:hidden" /> More Chemistry.
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed">
            A direct approach that turns hours of texting into real-world meetings. 
            When an offer is sent, expectations are clear from minute one.
          </p>
        </div>

        {/* Two-column layout: Steps on left, Interactive Offer Card on right */}
        <div className={`grid gap-12 items-start ${isMobileFrame ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
          
          {/* Steps List */}
          <div className={`${isMobileFrame ? 'col-span-1' : 'lg:col-span-6'} space-y-8`}>
            
            {/* Step 01 */}
            <div className="flex items-start gap-4 group">
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#8A1B22]/10 text-[#8A1B22] flex items-center justify-center font-bold text-sm border border-[#8A1B22]/20 group-hover:bg-[#8A1B22] group-hover:text-white transition-colors">
                01
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-heading font-bold text-lg text-stone-900">
                  Set The Scene
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Choose the place, time, budget & who covers what. Propose a date you actually look forward to.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="flex items-start gap-4 group">
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#8A1B22]/10 text-[#8A1B22] flex items-center justify-center font-bold text-sm border border-[#8A1B22]/20 group-hover:bg-[#8A1B22] group-hover:text-white transition-colors">
                02
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-heading font-bold text-lg text-stone-900">
                  Get An Answer
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  They have 48 hours to accept, decline, or suggest another time. No endless waiting or guessing.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="flex items-start gap-4 group">
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#8A1B22]/10 text-[#8A1B22] flex items-center justify-center font-bold text-sm border border-[#8A1B22]/20 group-hover:bg-[#8A1B22] group-hover:text-white transition-colors">
                03
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-heading font-bold text-lg text-stone-900">
                  Connect Before You Meet
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  A dedicated chat unlocks so you can coordinate before your date. Both confirm 24 hours prior.
                </p>
              </div>
            </div>

          </div>

          {/* Interactive Date Offer Preview Card */}
          <div className={`${isMobileFrame ? 'col-span-1' : 'lg:col-span-6'}`}>
            <div className="bg-[#FAF6EE] rounded-3xl p-6 md:p-8 border-2 border-[#E3DAC8] shadow-xl relative overflow-hidden">
              
              {/* Card top banner */}
              <div className="flex items-center justify-between border-b border-[#E8DFC9] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-500">
                    Live Invitation Preview
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8A1B22] bg-[#F7E2E4] px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span>38h Left</span>
                </div>
              </div>

              {/* Sender & Recipient profile info */}
              <div className="flex items-center justify-between mb-6 bg-white/70 p-3.5 rounded-2xl border border-stone-200/80">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                    alt="Julian"
                    className="w-10 h-10 rounded-full object-cover border border-[#8A1B22]/30"
                  />
                  <div>
                    <h4 className="font-serif-heading font-bold text-stone-900 text-sm leading-tight">
                      Julian Vance <span className="text-xs font-sans text-emerald-600 font-normal">● Verified</span>
                    </h4>
                    <p className="text-stone-500 text-xs">Sent you a date invitation</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-1 rounded-md">
                  Offer #NY-824
                </span>
              </div>

              {/* Offer Details */}
              <div className="space-y-4 mb-6">
                <h4 className="font-serif-heading font-bold text-2xl text-stone-900">
                  Dinner For Two
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2.5 text-stone-700 bg-white/80 p-3 rounded-xl border border-stone-200/60">
                    <Calendar className="w-4 h-4 text-[#8A1B22] shrink-0" />
                    <span>Friday, Nov 10 • 7:30 PM</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-stone-700 bg-white/80 p-3 rounded-xl border border-stone-200/60">
                    <MapPin className="w-4 h-4 text-[#8A1B22] shrink-0" />
                    <span className="truncate">The River Café, Brooklyn</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-stone-100/90 p-3 rounded-xl text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#E8A738]" />
                    <span><strong>Bill Terms:</strong> Julian covers the bill</span>
                  </div>
                  <span className="font-semibold text-stone-900">$150 - $200</span>
                </div>
              </div>

              {/* Dynamic Interactive Response Actions */}
              {offerState === 'pending' && (
                <div>
                  {!showCounterInput ? (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleAccept}
                        className="flex-1 bg-[#8A1B22] hover:bg-[#6E1118] text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-sm"
                      >
                        Accept
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowCounterInput(true)}
                        className="flex-1 bg-white hover:bg-stone-50 text-stone-800 font-semibold py-3 px-4 rounded-xl text-sm border border-stone-300 transition-colors"
                      >
                        Counter
                      </button>

                      <button
                        type="button"
                        onClick={handlePass}
                        className="text-stone-500 hover:text-stone-800 font-medium py-3 px-3 text-sm transition-colors"
                      >
                        Pass
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCounterSubmit} className="space-y-3 bg-white p-4 rounded-xl border border-stone-200">
                      <label className="block text-xs font-bold text-stone-700">
                        Suggest New Time or Venue:
                      </label>
                      <input
                        type="text"
                        value={counterNote}
                        onChange={(e) => setCounterNote(e.target.value)}
                        placeholder="e.g. Can we meet at 8:30 PM or at Bemelmans Bar?"
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#8A1B22]"
                        required
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-[#8A1B22] text-white text-xs font-bold py-2 rounded-lg"
                        >
                          Send Counter Offer
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCounterInput(false)}
                          className="px-3 text-xs text-stone-600 bg-stone-100 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Status outcome display */}
              {offerState === 'accepted' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Offer Accepted! Exclusive Chat Unlocked.</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    You and Julian are now connected to coordinate logistics. Mutual 24h confirmation is active.
                  </p>
                  <button
                    onClick={handleReset}
                    className="text-[11px] underline text-emerald-900 font-semibold pt-1"
                  >
                    Reset preview
                  </button>
                </div>
              )}

              {offerState === 'countered' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <MessageCircle className="w-5 h-5 text-amber-600" />
                    <span>Counter Proposal Sent!</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Julian has been notified of your suggested change: "{counterNote || 'New time suggested'}".
                  </p>
                  <button
                    onClick={handleReset}
                    className="text-[11px] underline text-amber-900 font-semibold pt-1"
                  >
                    Reset preview
                  </button>
                </div>
              )}

              {offerState === 'passed' && (
                <div className="bg-stone-100 border border-stone-200 rounded-2xl p-4 text-stone-700 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-stone-500" />
                    <span>Offer Respectfully Declined.</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    No hard feelings. The invitation has been archived cleanly.
                  </p>
                  <button
                    onClick={handleReset}
                    className="text-[11px] underline text-stone-900 font-semibold pt-1"
                  >
                    Reset preview
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
