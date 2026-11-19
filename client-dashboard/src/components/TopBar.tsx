import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopBarProps {
  onOpenMobileMenu: () => void;
}

export function TopBar({ onOpenMobileMenu }: TopBarProps) {
  const { user, logout, isDemoMode } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-[#FAF7F2] border-b border-[#E5DDD0] px-4 sm:px-7 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu + Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 rounded-lg text-[#16120F] hover:bg-[#EFE7DA]"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center shrink-0">
          <img
            src="/assets/logo.png"
            alt="thedateboss"
            className="h-8 w-auto object-contain"
          />
        </div>

        {isDemoMode && (
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F5F1E6] border border-[#E5DDD0] text-[#6E6A63]">
            Demo Seed Mode
          </span>
        )}
      </div>

      {/* Right: Notification Bell + Profile Dropdown */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative p-2 rounded-full text-[#6E6A63] hover:text-[#16120F] hover:bg-[#EFE7DA] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#9F1E19]" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 py-1 px-2 rounded-full hover:bg-[#EFE7DA]/70 transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
              alt={user?.nickname || 'Jenny Wilson'}
              className="w-8 h-8 rounded-full object-cover border border-[#E5DDD0]"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#16120F] leading-tight">
                {user?.nickname || 'Jenny Wilson'}
              </p>
              <p className="text-[10px] text-[#6E6A63] leading-tight">
                Super Admin
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#6E6A63]" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl shadow-lg py-1.5 z-50">
              <div className="px-4 py-2 border-b border-[#E5DDD0]">
                <p className="text-xs font-semibold text-[#16120F] truncate">
                  {user?.nickname || 'Jenny Wilson'}
                </p>
                <p className="text-[11px] text-[#6E6A63] truncate">
                  {user?.email || 'admin@thedateboss.com'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#9F1E19] hover:bg-[#F5F1E6] transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
