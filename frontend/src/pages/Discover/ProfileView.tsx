import React from 'react';
import {
  ShieldCheck,
  Pencil,
  GraduationCap,
  Briefcase,
  Check,
} from 'lucide-react';

export function ProfileView() {
  return (
    <div className="w-full max-w-[1020px] mx-auto animate-in fade-in duration-200">
      
      {/* Centered Cream White Profile Card matching Figma */}
      <div className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[28px] sm:rounded-[36px] p-5 sm:p-10 lg:p-12 shadow-[0_10px_35px_rgba(22,18,15,0.03)]">
        
        {/* ============================================================ */}
        {/* 1. AVATAR & NAME SECTION                                     */}
        {/* ============================================================ */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar from user screenshot */}
          <div className="relative">
            <img
              src="/assets/julian-avatar.png"
              alt="Julian Sterling"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-[#EADBCA] shadow-2xs"
            />
          </div>

          {/* Name & Edit Icon */}
          <div className="flex items-center gap-2 mt-3.5">
            <h1 className="font-serif font-bold text-2xl sm:text-[26px] text-[#16120F] tracking-tight">
              Julian Sterling
            </h1>
            <button
              type="button"
              className="w-6 h-6 rounded-full hover:bg-[#EFE7DA] flex items-center justify-center text-[#8A857D] hover:text-[#16120F] transition-colors cursor-pointer"
              title="Edit name"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reliability & Verification */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#8A857D] mt-1 font-medium">
            <span>4.97 Reliability</span>
            <span>·</span>
            <span className="inline-flex items-center gap-0.5 text-[#3B82F6]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ID Verified</span>
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. PROFILE GALLERY (4 of 6 Photos)                          */}
        {/* ============================================================ */}
        <div className="mt-7 sm:mt-9">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-[13px] font-bold text-[#16120F]">
              Profile Gallery (4 Of 6 Photos)
            </span>
            <button
              type="button"
              className="w-7 h-7 rounded-full hover:bg-[#EFE7DA] flex items-center justify-center text-[#8A857D] hover:text-[#16120F] transition-colors cursor-pointer"
              title="Edit gallery"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Thumbnails */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
            {[
              '/assets/discover-card-1.jpg',
              '/assets/discover-card-2.jpg',
              '/assets/discover-card-3.jpg',
              '/assets/discover-card-1.jpg',
              '/assets/discover-card-2.jpg',
            ].map((imgSrc, idx) => (
              <div
                key={idx}
                className={`relative aspect-square rounded-[16px] sm:rounded-[18px] overflow-hidden border border-[#E4DAC8] shadow-2xs group cursor-pointer ${
                  idx === 4 ? 'hidden sm:block' : ''
                }`}
              >
                <img
                  src={imgSrc}
                  alt={`Gallery photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. ATTRIBUTES ROW (Coffee, Smoking, Drinking, Education...)  */}
        {/* ============================================================ */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5 mt-5 sm:mt-6">
          {/* Coffee */}
          <div className="bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">
              Coffee
            </div>
            <div className="text-xs font-semibold text-[#16120F] flex items-center gap-1">
              <span className="text-[#8A857D] text-xs">✕</span>
              <span>No</span>
            </div>
          </div>

          {/* Smoking */}
          <div className="bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">
              Smoking
            </div>
            <div className="text-xs font-semibold text-[#16120F] flex items-center gap-1">
              <span className="text-[#8A857D] text-xs">✕</span>
              <span>No</span>
            </div>
          </div>

          {/* Drinking */}
          <div className="bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">
              Drinking
            </div>
            <div className="text-xs font-semibold text-[#16120F] flex items-center gap-1">
              <span className="text-[#8A857D] text-xs">✕</span>
              <span>Yes</span>
            </div>
          </div>

          {/* Education */}
          <div className="bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">
              Education
            </div>
            <div className="text-xs font-semibold text-[#16120F] flex items-center gap-1 truncate">
              <GraduationCap className="w-3.5 h-3.5 text-[#16120F] shrink-0" />
              <span className="truncate">Graduate Deg.</span>
            </div>
          </div>

          {/* Profession */}
          <div className="bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">
              Profession
            </div>
            <div className="text-xs font-semibold text-[#16120F] flex items-center gap-1 truncate">
              <Briefcase className="w-3.5 h-3.5 text-[#16120F] shrink-0" />
              <span className="truncate">Managing Directo...</span>
            </div>
          </div>

          {/* Net Worth */}
          <div className="bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">
              Net Worth
            </div>
            <div className="text-xs font-semibold text-[#16120F] flex items-center gap-0.5">
              <span>$</span>
              <span>$1,000,000+</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. ENVISIONED IDEAL FIRST DATE                               */}
        {/* ============================================================ */}
        <div className="bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4 sm:px-6 sm:py-4.5 mt-3 sm:mt-3.5">
          <h3 className="font-semibold text-xs sm:text-[13px] text-[#16120F] mb-1">
            Envisioned Ideal First Date
          </h3>
          <p className="text-[11px] sm:text-xs text-[#6E6A63] leading-relaxed">
            &ldquo;Curated multi-course tasting dinner with rare vintage wine pairing at Le Bernardin, followed by an evening cocktail in a private salon.&rdquo;
          </p>
        </div>

        {/* ============================================================ */}
        {/* 5. INTRODUCE YOURSELF TO THE COMMUNITY                       */}
        {/* ============================================================ */}
        <div className="bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4 sm:px-6 sm:py-4.5 mt-3 sm:mt-3.5">
          <h3 className="font-semibold text-xs sm:text-[13px] text-[#16120F] mb-1">
            Introduce Yourself To The Community
          </h3>
          <p className="text-[11px] sm:text-xs text-[#6E6A63] leading-relaxed">
            Private equity investor. Fond of vintage Bordeaux, competitive polo, and lively discussions on world history.
          </p>
        </div>

        {/* ============================================================ */}
        {/* 6. WHAT ARE YOU INTO? (5 Chosen)                             */}
        {/* ============================================================ */}
        <div className="bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4 sm:px-6 sm:py-4.5 mt-3 sm:mt-3.5">
          <h3 className="font-semibold text-xs sm:text-[13px] text-[#16120F] mb-2">
            What Are You Into? (5 Chosen)
          </h3>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-6 gap-y-2 text-[11px] sm:text-xs text-[#4A453E] font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#16120F] stroke-[2.5]" />
              <span>Fine Wine</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#16120F] stroke-[2.5]" />
              <span>Polo</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#16120F] stroke-[2.5]" />
              <span>Skiing</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#16120F] stroke-[2.5]" />
              <span>Modern Architecture</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#16120F] stroke-[2.5]" />
              <span>Private Aviation</span>
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 7. ESCROW BALANCE CARD                                       */}
        {/* ============================================================ */}
        <div className="bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4 sm:px-6 sm:py-4.5 mt-3 sm:mt-3.5">
          <div className="text-[10px] uppercase tracking-wider text-[#8A857D] font-medium mb-0.5">
            Escrow Balance
          </div>
          <div className="font-serif font-bold text-2xl sm:text-[28px] text-[#16120F] leading-tight my-0.5">
            $450
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-emerald-700">
            Protected in trust
          </div>
        </div>

        {/* ============================================================ */}
        {/* 8. ATTENDANCE RECORD CARD                                    */}
        {/* ============================================================ */}
        <div className="bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4 sm:px-6 sm:py-4.5 mt-3 sm:mt-3.5">
          <div className="text-[10px] uppercase tracking-wider text-[#8A857D] font-medium mb-0.5">
            Attendance Record
          </div>
          <div className="font-serif font-bold text-2xl sm:text-[28px] text-[#16120F] leading-tight my-0.5">
            100%
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-emerald-700">
            Zero Unexcused No-Shows
          </div>
        </div>

        {/* ============================================================ */}
        {/* 9. MEMBER SINCE CARD                                         */}
        {/* ============================================================ */}
        <div className="bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4 sm:px-6 sm:py-4.5 mt-3 sm:mt-3.5">
          <div className="text-[10px] uppercase tracking-wider text-[#8A857D] font-medium mb-0.5">
            Member Since
          </div>
          <div className="font-serif font-bold text-2xl sm:text-[28px] text-[#16120F] leading-tight mt-0.5">
            March 2025
          </div>
        </div>

      </div>

    </div>
  );
}

export default ProfileView;
