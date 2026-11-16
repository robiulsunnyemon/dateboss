import React from 'react';
import { Crown, Check } from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen bg-[#333333] flex flex-col justify-start">
      
      {/* Top Browser / Canvas Chrome Tab Bar (matching "Home page desktop view") */}
      <div className="bg-[#484848] text-stone-300 text-xs px-4 pt-2 border-b border-[#3A3A3A] flex items-center">
        <div className="bg-[#5A5A5A] text-white px-4 py-1.5 rounded-t-md border-t-2 border-[#F3A83B] flex items-center gap-2 font-medium tracking-wide">
          <span>Home page desktop view</span>
        </div>
      </div>

      {/* Main Desktop Screen Canvas */}
      <div className="w-full bg-[#FAF7F2] text-[#1E1C1A] font-sans relative overflow-hidden min-h-[920px] flex flex-col justify-between">
        
        {/* =========================================================================
            HEADER / NAVIGATION BAR
           ========================================================================= */}
        <header className="w-full relative z-30 pt-6 px-8 lg:px-14">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            
            {/* Left: Red Wax Seal Logo + "thedateboss" */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 relative shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_5px_rgba(142,27,36,0.35)]">
                  {/* Outer irregular scalloped red wax */}
                  <path
                    d="M50 4 
                       C57 5 62 10 68 8 
                       C75 7 80 13 85 18 
                       C90 23 94 28 95 35 
                       C96 42 93 47 96 54 
                       C98 61 95 67 92 73 
                       C89 79 83 83 78 87 
                       C72 91 66 92 60 95 
                       C53 97 47 95 41 96 
                       C34 97 28 93 23 89 
                       C17 85 13 80 9 74 
                       C5 68 6 62 4 55 
                       C3 48 6 42 6 36 
                       C7 29 11 24 16 19 
                       C21 14 27 10 33 8 
                       C40 6 44 4 50 4 Z"
                    fill="#961C23"
                  />
                  <circle cx="50" cy="50" r="32" stroke="#681016" strokeWidth="2" strokeDasharray="3 3" fill="#84171E" />
                  <text
                    x="50"
                    y="61"
                    textAnchor="middle"
                    fill="#F7EADB"
                    fontFamily="'Playfair Display', Georgia, serif"
                    fontWeight="bold"
                    fontSize="36"
                    fontStyle="italic"
                  >
                    d
                  </text>
                </svg>
              </div>

              {/* Brand name */}
              <span className="font-serif font-bold text-2xl tracking-tight text-[#1E1C1A]">
                thedateboss
              </span>
            </div>

            {/* Right: Nav Pill Container + "Join now" Button */}
            <div className="flex items-center gap-4">
              
              {/* Rounded Navigation Capsule */}
              <nav className="bg-[#EFE9DF]/80 backdrop-blur-sm border border-[#E5DECF] rounded-full px-6 py-2 flex items-center gap-7 text-xs font-medium text-[#5F5B54]">
                <a href="#how-it-works" className="hover:text-[#961C23] transition-colors">How it works</a>
                <a href="#roles" className="hover:text-[#961C23] transition-colors">Roles</a>
                <a href="#safety" className="hover:text-[#961C23] transition-colors">Safety</a>
                <a href="#faq" className="hover:text-[#961C23] transition-colors">FAQ</a>
              </nav>

              {/* Join now Button */}
              <button className="bg-[#961C23] hover:bg-[#7D141A] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-sm">
                Join now
              </button>

            </div>

          </div>
        </header>

        {/* =========================================================================
            HERO MAIN SECTION
           ========================================================================= */}
        <main className="relative flex-1 flex items-center px-8 lg:px-14 py-8 max-w-[1440px] mx-auto w-full">
          
          {/* Left Column (Text, Cards, Trust Indicators) */}
          <div className="w-full lg:w-[54%] xl:w-[52%] z-20 space-y-7 pr-4 lg:pr-8">
            
            {/* Tag: Gifted dating */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
              <span className="text-xs font-semibold text-[#961C23] tracking-wide">
                Gifted dating
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif font-extrabold text-5xl sm:text-6xl xl:text-[68px] leading-[1.08] tracking-tight text-[#1A1816]">
              THE DATE STARTS <br />
              WITH AN <span className="text-[#961C23] font-serif">OFFER.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#656059] text-sm sm:text-base leading-relaxed max-w-lg font-normal">
              Skip the 'hey'. Propose a real lunch, dinner or event, and let them say yes. Fewer ghosts, more tables for two.
            </p>

            {/* Two Action Cards Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              
              {/* Card 1: Host */}
              <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-[22px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[195px]">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#6E6861]">
                    <span className="text-[#F3A83B] text-sm leading-none">👑</span>
                    <span className="font-medium">Host</span>
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-lg leading-snug">
                    You Send The Offers. Pick The Place And The Time.
                  </h3>
                </div>

                <button className="w-full bg-[#F3A83B] hover:bg-[#DE952B] text-[#1E1C1A] font-bold text-xs py-3 px-4 rounded-full transition-colors mt-4 text-center shadow-sm">
                  Join as a Host
                </button>
              </div>

              {/* Card 2: Guest of Honor */}
              <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-[22px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[195px]">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#6E6861]">
                    <span className="text-[#8E8A83] text-sm leading-none">👑</span>
                    <span className="font-medium">Guest of Honor</span>
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-lg leading-snug">
                    You Receive The Offers. Say Yes, Counter Or Pass.
                  </h3>
                </div>

                <button className="w-full bg-[#961C23] hover:bg-[#7D141A] text-white font-bold text-xs py-3 px-4 rounded-full transition-colors mt-4 text-center shadow-sm">
                  Join as a Guest of Honor
                </button>
              </div>

            </div>

            {/* Bottom Trust Indicators */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6D6760] font-normal pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8E8880]" /> ID-verified members
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8E8880]" /> Public venues only
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8E8880]" /> Offers expire in 48h
              </span>
            </div>

          </div>

          {/* =======================================================================
              RIGHT HERO IMAGE WITH SWEEPING CONVEX CURVE MASK
             ======================================================================= */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[50%] xl:w-[48%] h-full z-10 pointer-events-none select-none">
            
            {/* SVG ClipPath Definition for the curved arc */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <clipPath id="heroArcClip" clipPathUnits="objectBoundingBox">
                  {/* Smooth convex curved arc from top to bottom */}
                  <path d="M 0.28, 0 
                           C 0.12, 0.25 
                             0.04, 0.45 
                             0.04, 0.60 
                           C 0.04, 0.75 
                             0.10, 0.90 
                             0.18, 1.0 
                           L 1, 1 
                           L 1, 0 
                           Z" />
                </clipPath>
              </defs>
            </svg>

            {/* Image container masked by the smooth arc */}
            <div
              className="w-full h-full relative"
              style={{ clipPath: 'url(#heroArcClip)' }}
            >
              <img
                src="/assets/hero-couple.jpg"
                alt="Romantic couple dining with wine glasses at restaurant"
                className="w-full h-full object-cover object-[center_right] pointer-events-auto"
              />
              
              {/* Soft warm vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

          </div>

        </main>

        {/* Subtle bottom edge padding */}
        <div className="h-6 w-full" />

      </div>

    </div>
  );
}

export default App;
