import React, { useState } from 'react';
import { WaxSealLogo } from './WaxSealLogo';
import { Menu, X, ArrowUpRight, Sparkles, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onOpenOfferModal?: (mode: 'send' | 'receive') => void;
  onNavigateToDashboard?: () => void;
  isMobileFrame?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOfferModal,
  onNavigateToDashboard,
  isMobileFrame = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why Us', href: '#why-different' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Anti-Ghosting', href: '#anti-ghosting' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="w-full relative z-30 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile hamburger or Desktop logo */}
          {isMobileFrame ? (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-800 hover:text-[#8A1B22] focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <a href="#" className="flex items-center">
                <WaxSealLogo size="sm" showText={true} />
              </a>

              <button
                onClick={() => onOpenOfferModal?.('receive')}
                className="bg-[#8A1B22] hover:bg-[#6E1118] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors shadow-sm"
              >
                Try Now
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Logo */}
              <div className="flex items-center">
                <a href="#" className="flex items-center gap-2">
                  <WaxSealLogo size="md" showText={true} />
                </a>
              </div>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="hover:text-[#8A1B22] transition-colors tracking-wide"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* Desktop CTA actions */}
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={onNavigateToDashboard}
                  className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-700 hover:text-[#8A1B22] px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#8A1B22]" />
                  Dashboard
                </button>

                <button
                  onClick={() => onOpenOfferModal?.('send')}
                  className="bg-[#8A1B22] hover:bg-[#6E1118] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2"
                >
                  <span>Sign In</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile menu trigger when rendered outside phone frame */}
              <div className="flex md:hidden items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-stone-800"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FBF8F3] border-b border-stone-200 px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-stone-800 hover:text-[#8A1B22] py-1 border-b border-stone-100"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToDashboard?.();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-stone-800 border border-stone-300 rounded-full bg-white hover:bg-stone-50"
            >
              <LayoutDashboard className="w-4 h-4 text-[#8A1B22]" />
              Open Admin Dashboard
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOfferModal?.('send')}
              }
              className="w-full py-2.5 text-sm font-semibold text-white bg-[#8A1B22] hover:bg-[#6E1118] rounded-full shadow"
            >
              Send An Offer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
