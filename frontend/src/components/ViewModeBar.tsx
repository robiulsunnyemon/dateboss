import React from 'react';
import { Monitor, Smartphone, Maximize2, LayoutDashboard } from 'lucide-react';

export type ViewMode = 'desktop' | 'mobile' | 'responsive' | 'dashboard';

interface ViewModeBarProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export const ViewModeBar: React.FC<ViewModeBarProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-[#141414] text-white border-b border-stone-800 shadow-md px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-serif font-bold text-sm tracking-wide text-[#F6E7D0]">
          thedate<span className="text-[#E63946]">inc</span>
        </span>
        <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded text-[10px] hidden md:inline font-mono">
          TypeScript Monorepo
        </span>
      </div>

      {/* Switcher Buttons: Desktop, Mobile, Responsive, Dashboard */}
      <div className="flex items-center bg-stone-900/90 rounded-lg p-1 border border-stone-800 gap-1">
        <button
          onClick={() => onModeChange('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            currentMode === 'desktop'
              ? 'bg-[#8A1B22] text-white shadow-sm'
              : 'text-stone-400 hover:text-white'
          }`}
          title="Desktop View (1440px)"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop View</span>
        </button>

        <button
          onClick={() => onModeChange('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            currentMode === 'mobile'
              ? 'bg-[#8A1B22] text-white shadow-sm'
              : 'text-stone-400 hover:text-white'
          }`}
          title="Mobile View (390px)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile View</span>
        </button>

        <button
          onClick={() => onModeChange('responsive')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            currentMode === 'responsive'
              ? 'bg-[#8A1B22] text-white shadow-sm'
              : 'text-stone-400 hover:text-white'
          }`}
          title="Full Responsive"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Responsive</span>
        </button>

        <button
          onClick={() => onModeChange('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            currentMode === 'dashboard'
              ? 'bg-[#E8A738] text-stone-950 font-bold shadow-sm'
              : 'text-stone-300 hover:text-white'
          }`}
          title="Admin & Operations Dashboard"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
      </div>

    </div>
  );
};
