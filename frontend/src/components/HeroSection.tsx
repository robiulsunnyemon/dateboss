import React from 'react';
import { Wine, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onSendOfferClick: () => void;
  onReceiveOfferClick: () => void;
  isMobileFrame?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSendOfferClick,
  onReceiveOfferClick,
  isMobileFrame = false,
}) => {
  return (
    <section className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid items-center gap-10 lg:gap-12 ${isMobileFrame ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
          
          {/* Left Column: Headline and Call-to-actions */}
          <div className={`${isMobileFrame ? 'col-span-1' : 'lg:col-span-7'} space-y-6 md:space-y-8`}>
            
            {/* Category tag */}
            <div className="flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#8A1B22]"></span>
              <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#8A1B22]">
                The Revolution In Dating
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-[#171614]">
              THE DATE STARTS <br className="hidden sm:inline" />
              WITH AN <span className="text-[#8A1B22] italic font-serif">OFFER.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
              Start the real conversations with a clear offer. Stop endless swiping. 
              Start meeting real people with real intentions on your terms.
            </p>

            {/* Two Action Cards */}
            <div className={`grid gap-4 pt-2 ${isMobileFrame ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
              
              {/* Card 1: Sender (Amber / Gold Accent) */}
              <div className="bg-[#FAF6EE] border border-[#E8DFC9] rounded-2xl p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#E8A738] transition-all">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FCECD0] flex items-center justify-center text-amber-700 text-xs">
                      🍸
                    </span>
                    <span className="text-xs uppercase font-bold tracking-wider text-amber-800">
                      Step 01
                    </span>
                  </div>
                  <h3 className="font-serif-heading font-bold text-stone-900 text-base sm:text-lg leading-snug">
                    You Send The Offer: Pick You, Them, And The Time
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={onSendOfferClick}
                  className="w-full bg-[#E8A738] hover:bg-[#D49324] text-stone-950 font-bold text-sm py-3 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 group"
                >
                  <span>Send An Offer</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 2: Receiver (Burgundy Accent) */}
              <div className="bg-[#FAF6EE] border border-[#E8DFC9] rounded-2xl p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#8A1B22] transition-all">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#F5DFE1] flex items-center justify-center text-[#8A1B22] text-xs">
                      ✨
                    </span>
                    <span className="text-xs uppercase font-bold tracking-wider text-[#8A1B22]">
                      Step 02
                    </span>
                  </div>
                  <h3 className="font-serif-heading font-bold text-stone-900 text-base sm:text-lg leading-snug">
                    You Receive The Offer: Say Yes, Counter, Or Pass
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={onReceiveOfferClick}
                  className="w-full bg-[#8A1B22] hover:bg-[#6E1118] text-white font-bold text-sm py-3 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 group"
                >
                  <span>Receive Offers Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

            {/* Trust Badges / Checkmarks */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-medium text-stone-600">
              <span className="inline-flex items-center gap-1.5 text-stone-700">
                <Check className="w-4 h-4 text-[#8A1B22]" /> 100% Verified Profiles
              </span>
              <span className="inline-flex items-center gap-1.5 text-stone-700">
                <Check className="w-4 h-4 text-[#8A1B22]" /> No Endless Small Talk
              </span>
              <span className="inline-flex items-center gap-1.5 text-stone-700">
                <Check className="w-4 h-4 text-[#8A1B22]" /> Real Chemistry First
              </span>
            </div>

          </div>

          {/* Right Column: Romantic Arch Photo */}
          <div className={`${isMobileFrame ? 'col-span-1 mt-6' : 'lg:col-span-5'} flex justify-center`}>
            <div className="relative w-full max-w-md">
              {/* Arched image container */}
              <div className="relative overflow-hidden rounded-t-[180px] rounded-b-3xl border-4 border-[#F0E8DA] shadow-2xl bg-[#EBE3D3] aspect-[4/5] max-h-[560px]">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt="Couple dining at candlelight with wine glasses"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                {/* Romantic gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                {/* Floating caption badge */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-white/40">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-serif-heading font-bold text-stone-900 text-sm">
                        The River Café • Brooklyn
                      </p>
                      <p className="text-stone-500 text-[11px]">
                        Friday 7:30 PM • Dinner For Two
                      </p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                      Offer Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative vintage background glow */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#E8A738]/20 rounded-full blur-2xl -z-10" />
              <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-[#8A1B22]/15 rounded-full blur-2xl -z-10" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
