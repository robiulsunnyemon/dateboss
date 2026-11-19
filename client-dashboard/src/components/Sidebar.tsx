import React from 'react';
import { X } from 'lucide-react';

export type DashboardSection =
  | 'overview'
  | 'verification'
  | 'members'
  | 'accounts'
  | 'reports'
  | 'safety';

interface SidebarProps {
  activeSection: DashboardSection;
  onSelectSection: (section: DashboardSection) => void;
  pendingCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS: { id: DashboardSection; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'verification', label: 'Verification' },
  { id: 'members', label: 'Members & Subscriptions' },
  { id: 'accounts', label: 'Account Management' },
  { id: 'reports', label: 'Reports' },
  { id: 'safety', label: 'Safety & Moderation' },
];

export function Sidebar({
  activeSection,
  onSelectSection,
  pendingCount,
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const handleSelect = (id: DashboardSection) => {
    onSelectSection(id);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <nav className="py-5 px-3 space-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelect(item.id)}
            className={`w-full flex items-center justify-between text-left px-4 py-2.5 rounded-lg text-[13px] transition-all relative ${
              isActive
                ? 'bg-[#EFE7DA] text-[#16120F] font-semibold'
                : 'text-[#6E6A63] hover:text-[#16120F] hover:bg-[#F5F1E6]/70 font-medium'
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#9F1E19]" />
            )}
            <span>{item.label}</span>
            {item.id === 'verification' && typeof pendingCount === 'number' && pendingCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9F1E19] text-white">
                {pendingCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[220px] shrink-0 bg-[#FAF7F2] border-r border-[#E5DDD0] min-h-[calc(100vh-64px)]">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-[250px] bg-[#FAF7F2] border-r border-[#E5DDD0] h-full flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#E5DDD0]">
              <img
                src="/assets/logo.png"
                alt="thedateboss"
                className="h-7 w-auto object-contain"
              />
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-[#6E6A63] hover:text-[#16120F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
