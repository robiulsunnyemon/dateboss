import React from 'react';
import { MessageSquare, Hourglass, CalendarCheck, ShieldCheck } from 'lucide-react';

export const AntiGhostingSection: React.FC<{ isMobileFrame?: boolean }> = ({ isMobileFrame = false }) => {
  const pillars = [
    {
      icon: <MessageSquare className="w-6 h-6 text-[#E63946]" />,
      title: "Chat Opens After Yes",
      description: "No endless texting without commitment. Chat only unlocks after an offer is mutually agreed upon."
    },
    {
      icon: <Hourglass className="w-6 h-6 text-[#E63946]" />,
      title: "Offers Expire In 48 Hours",
      description: "Real-time decisions. No hanging conversations, ghosting, or matches idling in your inbox."
    },
    {
      icon: <CalendarCheck className="w-6 h-6 text-[#E63946]" />,
      title: "Confirm The Day Before",
      description: "Both parties complete a 24-hour mutual check-in. Unexcused no-shows trigger automatic platform penalties."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#E63946]" />,
      title: "Verified Public Venues",
      description: "Dates only take place at curated, verified public dining and lounge destinations for complete safety."
    }
  ];

  return (
    <section id="anti-ghosting" className="py-16 md:py-24 bg-[#141414] text-white relative overflow-hidden">
      {/* Background subtle radial ambient glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#8A1B22]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#8A1B22]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#E63946]"></span>
            <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#E63946]">
              Platform Integrity
            </span>
          </div>

          <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white">
            Built Against Ghosting.
          </h2>

          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Dating app ghosting happens because there is zero accountability. 
            We replaced vague texting with structured date proposals, mutual confirmations, and real-time safety.
          </p>
        </div>

        {/* 4 Pillars List */}
        <div className={`grid gap-6 ${isMobileFrame ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="bg-[#1C1B1A] border border-stone-800/80 rounded-2xl p-6 hover:border-[#8A1B22]/60 transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#8A1B22]/20 border border-[#8A1B22]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {pillar.icon}
              </div>

              <h3 className="font-serif-heading font-bold text-lg text-white mb-2">
                {pillar.title}
              </h3>

              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
