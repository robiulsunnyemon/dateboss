import React from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { HowItWorksSection } from './HowItWorksSection';
import { WhyDifferentSection } from './WhyDifferentSection';
import { ReviewsSection } from './ReviewsSection';
import { AntiGhostingSection } from './AntiGhostingSection';
import { FaqSection } from './FaqSection';
import { CtaBanner } from './CtaBanner';
import { Footer } from './Footer';

interface LandingPageContentProps {
  onOpenOfferModal: (mode: 'send' | 'receive') => void;
  onOpenDashboard: () => void;
  isMobileFrame?: boolean;
}

export const LandingPageContent: React.FC<LandingPageContentProps> = ({
  onOpenOfferModal,
  onOpenDashboard,
  isMobileFrame = false,
}) => {
  return (
    <div className={`w-full bg-[#FBF8F3] text-[#1D1B18] ${isMobileFrame ? 'font-sans text-sm' : ''}`}>
      {/* Navigation */}
      <Navbar
        onOpenOfferModal={onOpenOfferModal}
        onNavigateToDashboard={onOpenDashboard}
        isMobileFrame={isMobileFrame}
      />

      {/* Hero Section */}
      <HeroSection
        onSendOfferClick={() => onOpenOfferModal('send')}
        onReceiveOfferClick={() => onOpenOfferModal('receive')}
        isMobileFrame={isMobileFrame}
      />

      {/* How It Works (Less Chat, More Chemistry) */}
      <HowItWorksSection isMobileFrame={isMobileFrame} />

      {/* Why Different */}
      <WhyDifferentSection isMobileFrame={isMobileFrame} />

      {/* Reviews */}
      <ReviewsSection isMobileFrame={isMobileFrame} />

      {/* Anti-Ghosting Pillars (Dark Theme) */}
      <AntiGhostingSection isMobileFrame={isMobileFrame} />

      {/* FAQs */}
      <FaqSection />

      {/* Bottom CTA Banner */}
      <CtaBanner
        onSendOfferClick={() => onOpenOfferModal('send')}
        onReceiveOfferClick={() => onOpenOfferModal('receive')}
        isMobileFrame={isMobileFrame}
      />

      {/* Footer */}
      <Footer isMobileFrame={isMobileFrame} />
    </div>
  );
};
