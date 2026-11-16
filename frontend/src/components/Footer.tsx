import React from 'react';
import { WaxSealLogo } from './WaxSealLogo';

export const Footer: React.FC<{ isMobileFrame?: boolean }> = ({ isMobileFrame = false }) => {
  return (
    <footer className="w-full border-t border-[#ECE3D5] py-10 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-6 ${isMobileFrame ? 'flex-col text-center' : 'flex-col sm:flex-row'}`}>
          
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <WaxSealLogo size="sm" showText={true} />
            <span className="text-xs text-stone-500">
              © {new Date().getFullYear()} The Date Inc. All rights reserved.
            </span>
          </div>

          {/* Policy Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-stone-600">
            <a href="#terms" className="hover:text-[#8A1B22] transition-colors">
              Terms of Service
            </a>
            <a href="#privacy" className="hover:text-[#8A1B22] transition-colors">
              Privacy Policy
            </a>
            <a href="#safety" className="hover:text-[#8A1B22] transition-colors">
              Safety Guidelines
            </a>
            <a href="#contact" className="hover:text-[#8A1B22] transition-colors">
              Contact Support
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};
