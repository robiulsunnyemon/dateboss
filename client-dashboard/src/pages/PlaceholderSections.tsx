import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface SectionPlaceholderProps {
  section: 'safety';
}

const SECTION_META = {
  safety: {
    eyebrow: 'Moderation',
    title: 'Safety & Moderation',
    subtitle: 'Review flagged conversations and enforce community standards.',
    icon: ShieldAlert,
    items: [
      { title: 'Flagged Conversation #1042', detail: 'Reported for off-platform solicitation · Under review', badge: 'Open' },
      { title: 'Flagged Conversation #1039', detail: 'No-show dispute · 24h hold applied', badge: 'Resolved' },
    ],
  },
};

export function PlaceholderSection({ section }: SectionPlaceholderProps) {
  const meta = SECTION_META[section];
  const Icon = meta.icon;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-[1.5px] bg-[#9F1E19]" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9F1E19]">
            {meta.eyebrow}
          </span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-[28px] text-[#16120F] leading-tight">
          {meta.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6A63] mt-1">{meta.subtitle}</p>
      </div>

      <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-6 space-y-3">
        {meta.items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#F5F1E6] border border-[#E5DDD0] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-full bg-white border border-[#E5DDD0] flex items-center justify-center text-[#9F1E19] shrink-0">
                <Icon className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#16120F] truncate">{item.title}</p>
                <p className="text-xs text-[#6E6A63] truncate">{item.detail}</p>
              </div>
            </div>
            <span className="shrink-0 px-3 py-1 rounded-full bg-white border border-[#E5DDD0] text-[11px] font-semibold text-[#16120F]">
              {item.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
