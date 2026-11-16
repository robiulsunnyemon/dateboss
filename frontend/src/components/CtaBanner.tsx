import React from 'react';
import { WaxSealLogo } from './WaxSealLogo';
import { ArrowRight } from 'lucide-react';

interface CtaBannerProps {
  onSendOfferClick: () => void;
  onReceiveOfferClick: () => void;
  isMobileFrame?: boolean;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({
  onSendOfferClick,
  onReceiveOfferClick,
  isMobileFrame = false,
}) => {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-[#F7F2E8] border border-[#E8DFC9] rounded-3xl p-8 sm:p-12 md:p-16 text-center shadow-lg relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8A1B22]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-6">
          
          {/* Centered Wax Seal Stamp */}
          <div className="mb-2">
            <WaxSealLogo size="lg" showText={false} />
          </div>

          {/* Headline */}
          <h2 className="font-serif-heading font-extrabold text-2xl sm:text-3xl md:text-5xl text-stone-900 leading-tight">
            MAKE THE FIRST MOVE <br />
            <span className="text-[#8A1B22] italic font-serif">WORTH ANSWERING.</span>
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg">
            Say goodbye to ghosting, awkward small talk, and wasted evenings.
            Join thousands of singles having intentional, memorable dates.
          </p>

          {/* Action Buttons */}
          <div className={`flex items-center gap-4 w-full pt-4 justify-center ${isMobileFrame ? 'flex-col' : 'flex-col sm:flex-row'}`}>
            <button
              type="button"
              onClick={onSendOfferClick}
              className={`bg-[#E8A738] hover:bg-[#D49324] text-stone-950 font-bold py-3.5 px-8 rounded-full text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group ${
                isMobileFrame ? 'w-full' : 'w-full sm:w-auto'
              }`}
            >
              <span>Send An Offer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onReceiveOfferClick}
              className={`bg-[#8A1B22] hover:bg-[#6E1118] text-white font-bold py-3.5 px-8 rounded-full text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group ${
                isMobileFrame ? 'w-full' : 'w-full sm:w-auto'
              }`}
            >
              <span>Receive Offers Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
