import React from 'react';
import { Check } from 'lucide-react';

export function App() {
  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1E1C1A] font-sans antialiased selection:bg-[#961C23] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* =========================================================================
          RIGHT HERO IMAGE WITH PRECISE CONVEX CURVED MASK
          (Extends from top: 0 to bottom, navbar floats on top)
         ========================================================================= */}
      <div className="absolute right-0 top-0 bottom-0 w-[48%] xl:w-[46%] h-full z-10 pointer-events-none hidden lg:block overflow-hidden">
        
        {/* SVG ClipPath Definition for the exact curved arc */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="heroRightArc" clipPathUnits="objectBoundingBox">
              {/* Convex circular arc: starts at top (~0.24), bows out to the left (~0.04), and curves to bottom (~0.22) */}
              <path d="M 0.24, 0 
                       C 0.10, 0.25, 0.02, 0.45, 0.02, 0.58 
                       C 0.02, 0.72, 0.09, 0.88, 0.22, 1 
                       L 1, 1 
                       L 1, 0 
                       Z" />
            </clipPath>
          </defs>
        </svg>

        {/* The Couple Dining Image */}
        <div
          className="w-full h-full relative"
          style={{ clipPath: 'url(#heroRightArc)' }}
        >
          <img
            src="/assets/hero-couple.jpg"
            alt="Romantic couple dining with wine glasses at restaurant table"
            className="w-full h-full object-cover object-[center_right] pointer-events-auto"
          />
          {/* Subtle warm depth vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
        </div>
      </div>

      {/* =========================================================================
          1. HEADER / NAVIGATION BAR (FLOATS ON TOP OF BOTH SIDES)
         ========================================================================= */}
      <header className="w-full relative z-30 pt-6 px-6 sm:px-10 lg:px-14">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          
          {/* Left: Wax Seal Logo + "thedateboss" */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 relative shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_5px_rgba(150,28,35,0.35)]">
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

            {/* Brand Title */}
            <span className="font-serif font-bold text-2xl tracking-tight text-[#1E1C1A]">
              thedateboss
            </span>
          </div>

          {/* Right: Nav Capsule + "Join now" Button */}
          <div className="flex items-center gap-4">
            
            {/* Rounded Pill Navigation Container (frosted glass) */}
            <nav className="bg-[#EFE9DF]/85 backdrop-blur-md border border-[#E5DECF]/80 rounded-full px-6 py-2 hidden sm:flex items-center gap-7 text-xs font-medium text-[#5F5B54] shadow-sm">
              <a href="#how-it-works" className="hover:text-[#961C23] transition-colors">How it works</a>
              <a href="#roles" className="hover:text-[#961C23] transition-colors">Roles</a>
              <a href="#safety" className="hover:text-[#961C23] transition-colors">Safety</a>
              <a href="#faq" className="hover:text-[#961C23] transition-colors">FAQ</a>
            </nav>

            {/* "Join now" Red Button */}
            <button className="bg-[#961C23] hover:bg-[#7D141A] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-sm hover:shadow">
              Join now
            </button>

          </div>

        </div>
      </header>


      {/* =========================================================================
          2. HERO MAIN CONTENT
         ========================================================================= */}
      <main className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-14 py-8 lg:py-12 flex-1 flex flex-col justify-center">
        
        <div className="w-full lg:w-[54%] xl:w-[52%] space-y-7 pr-2 sm:pr-4">
          
          {/* Label: Gifted dating */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
            <span className="text-xs font-semibold text-[#961C23] tracking-wide">
              Gifted dating
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif font-extrabold text-4xl sm:text-5xl md:text-6xl xl:text-[68px] leading-[1.08] tracking-tight text-[#1A1816]">
            THE DATE STARTS <br />
            WITH AN <span className="text-[#961C23] font-serif">OFFER.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#656059] text-sm sm:text-base leading-relaxed max-w-lg font-normal">
            Skip the 'hey'. Propose a real lunch, dinner or event, and let them say yes. Fewer ghosts, more tables for two.
          </p>

          {/* Two Action Cards Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 max-w-xl">
            
            {/* Card 1: Host */}
            <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-[22px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[195px] hover:border-[#F3A83B] transition-colors">
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
            <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-[22px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[195px] hover:border-[#961C23] transition-colors">
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

          {/* Trust Checkmarks */}
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

        {/* Mobile/Tablet fallback view of the image (placed cleanly below cards on < lg screens) */}
        <div className="block lg:hidden mt-10 w-full rounded-2xl overflow-hidden shadow-lg border border-[#E8E1D3] max-h-[380px]">
          <img
            src="/assets/hero-couple.jpg"
            alt="Romantic couple dining"
            className="w-full h-full object-cover object-center"
          />
        </div>

      </main>

      {/* Subtle bottom spacing */}
      <div className="h-6 w-full" />

    </div>
  );
}

export default App;
