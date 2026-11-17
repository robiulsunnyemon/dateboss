/**
 * thedateboss Typography System
 * Display & Titles: Lora
 * Body & Captions: Raleway
 */
export const typography = {
  fonts: {
    display: 'Lora, Georgia, serif',
    heading: 'Lora, Georgia, serif',
    body: 'Raleway, system-ui, sans-serif',
  },
  styles: {
    // Display & Headings (Lora)
    display: 'font-serif font-semibold italic text-4xl sm:text-5xl md:text-[64px] md:leading-[84px] tracking-tight',
    h1: 'font-serif font-semibold text-3xl sm:text-4xl md:text-[56px] leading-[1.2] tracking-tight',
    h2: 'font-serif font-semibold text-2xl sm:text-3xl md:text-[48px] leading-[1.2] tracking-tight',
    h3: 'font-serif font-semibold text-xl sm:text-2xl md:text-[40px] leading-[1.2] tracking-tight',
    h4: 'font-serif font-semibold text-lg sm:text-xl md:text-[32px] leading-[1.2] tracking-tight',
    h5: 'font-serif font-semibold text-base sm:text-lg md:text-[24px] leading-[1.2] tracking-tight',
    h6: 'font-serif font-semibold text-sm sm:text-base md:text-[16px] leading-[1.2] tracking-tight',

    // Body & Captions (Raleway)
    body1: 'font-sans font-normal text-base sm:text-[20px] leading-[1.4]',
    body2: 'font-sans font-normal text-sm sm:text-[16px] leading-[1.4]',
    body3: 'font-sans font-normal text-xs sm:text-[14px] leading-[1.4]',
    body4: 'font-sans font-normal text-[11px] sm:text-[12px] leading-[1.4]',

    // Subtitles & Section Notes
    subtitle: 'font-sans font-normal text-xs sm:text-sm text-[#6E6A63] leading-relaxed',
    caption: 'font-sans font-normal text-[11px] text-[#6E6A63]',
  },
} as const;
