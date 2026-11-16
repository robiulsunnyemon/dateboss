import React from 'react';
import { Check } from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1C1A] font-sans antialiased selection:bg-[#961C23] selection:text-white flex flex-col">
      
      {/* =========================================================================
          1. REAL WEBSITE HEADER / NAVIGATION (NO GREY TAB BAR)
         ========================================================================= */}
      <header className="w-full bg-[#FAF7F2] border-b border-[#EFE8DC]/70 sticky top-0 z-30 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo with Wax Seal */}
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

          {/* Center Navigation Links in Rounded Capsule */}
          <nav className="hidden md:flex items-center bg-[#EFE9DF]/80 border border-[#E5DECF] rounded-full px-6 py-2 gap-8 text-xs font-medium text-[#5F5B54]">
            <a href="#how-it-works" className="hover:text-[#961C23] transition-colors">How it works</a>
            <a href="#roles" className="hover:text-[#961C23] transition-colors">Roles</a>
            <a href="#safety" className="hover:text-[#961C23] transition-colors">Safety</a>
            <a href="#faq" className="hover:text-[#961C23] transition-colors">FAQ</a>
          </nav>

          {/* Right Action Button */}
          <div>
            <button className="bg-[#961C23] hover:bg-[#7D141A] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-sm hover:shadow">
              Join now
            </button>
          </div>

        </div>
      </header>


      {/* =========================================================================
          2. HERO CONTENT (HEADLINE, SUBTITLE, CARDS & TRUST POINTS)
         ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 w-full flex-1 space-y-12">
        
        {/* Top Hero Section */}
        <div className="max-w-3xl space-y-6">
          
          {/* Label: Gifted dating */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#961C23]"></span>
            <span className="text-xs font-semibold text-[#961C23] tracking-wider uppercase">
              Gifted dating
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-[#1A1816]">
            THE DATE STARTS <br />
            WITH AN <span className="text-[#961C23]">OFFER.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#656059] text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-normal">
            Skip the 'hey'. Propose a real lunch, dinner or event, and let them say yes. Fewer ghosts, more tables for two.
          </p>

          {/* Two Action Cards (Host & Guest of Honor) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 max-w-2xl">
            
            {/* Card 1: Host */}
            <div className="bg-[#FAF7F2] border border-[#E6DEC $\rightarrow$ #E8E1D3 border-[#E8E1D3]] rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[210px] hover:border-[#F3A83B] transition-colors">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#6E6861]">
                  <span className="text-[#F3A83B] text-base leading-none">👑</span>
                  <span className="font-medium">Host</span>
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg sm:text-xl leading-snug">
                  You Send The Offers. Pick The Place And The Time.
                </h3>
              </div>

              <button className="w-full bg-[#F3A83B] hover:bg-[#DE952B] text-[#1E1C1A] font-bold text-xs py-3.5 px-4 rounded-full transition-colors mt-5 text-center shadow-sm">
                Join as a Host
              </button>
            </div>

            {/* Card 2: Guest of Honor */}
            <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[210px] hover:border-[#961C23] transition-colors">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#6E6861]">
                  <span className="text-[#8E8A83] text-base leading-none">👑</span>
                  <span className="font-medium">Guest of Honor</span>
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg sm:text-xl leading-snug">
                  You Receive The Offers. Say Yes, Counter Or Pass.
                </h3>
              </div>

              <button className="w-full bg-[#961C23] hover:bg-[#7D141A] text-white font-bold text-xs py-3.5 px-4 rounded-full transition-colors mt-5 text-center shadow-sm">
                Join as a Guest of Honor
              </button>
            </div>

          </div>

          {/* Trust Points Under Cards */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6D6760] font-medium pt-2">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#8E8880]" /> ID-verified members
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#8E8880]" /> Public venues only
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#8E8880]" /> Offers expire in 48h
            </span>
          </div>

        </div>


        {/* =========================================================================
            3. FEATURED ROMANTIC DINNER IMAGE (BELOW ON THE LANDING PAGE)
           ========================================================================= */}
        <div className="w-full pt-4">
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-[#EFE7D8] bg-[#EBE2D0] max-h-[640px]">
            <img
              src="/assets/hero-couple.jpg"
              alt="Couple enjoying a romantic candlelight dinner at an outdoor restaurant table"
              className="w-full h-full object-cover object-center max-h-[640px]"
            />

            {/* Subtle romantic atmospheric overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

            {/* Floating Venue & Date Card inside image */}
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 text-[#1E1C1A]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 leading-tight">
                    Dinner For Two • Verified Venue
                  </h4>
                  <p className="text-stone-500 text-xs mt-0.5">
                    Candlelight patio dining with wine & chef specials
                  </p>
                </div>
                <span className="shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  100% Real Dates
                </span>
              </div>
            </div>

          </div>
        </div>

      </main>


      {/* =========================================================================
          4. WEBSITE FOOTER
         ========================================================================= */}
      <footer className="w-full border-t border-[#ECE3D4] py-8 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-serif font-bold text-sm text-[#1E1C1A]">thedateboss</span>
            <span>• © {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#5F5B54]">
            <a href="#how-it-works" className="hover:text-[#961C23]">How it works</a>
            <a href="#roles" className="hover:text-[#961C23]">Roles</a>
            <a href="#safety" className="hover:text-[#961C23]">Safety</a>
            <a href="#faq" className="hover:text-[#961C23]">FAQ</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
