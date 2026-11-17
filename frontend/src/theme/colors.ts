/**
 * thedateboss Brand Color Tokens
 * Derived from the official Figma Brand Guide
 */
export const brandColors = {
  primary: '#9F1E19',       // Brand Red / Crimson
  primaryHover: '#851713',  // Darker shade for active/hover states
  secondary: '#FCB943',     // Golden Amber / Yellow
  secondaryHover: '#E09C2C',// Darker gold for active/hover states
  bg: '#EFE7DA',            // Primary Page Background (Warm Beige)
  surface: '#F5F1E6',       // Card, Modal & Input Background (Light Cream)
  surfaceAlt: '#FAF6EE',    // Subtle alternative surface
  black: '#16120F',         // Pure Warm Black for Headings & Active Pills
  muted: '#6E6A63',         // Muted Grey/Brown for Subtitles & Body
  mutedLight: '#8E8A83',    // Secondary Muted / Placeholders
  border: '#E8DFD0',        // Subtle Warm Border for Cards
  borderInput: '#E5DECF',   // Border for Input Fields & Inactive Pills
  success: '#199F22',       // Vibrant Green for Badges & Success
} as const;

export type BrandColorKey = keyof typeof brandColors;
