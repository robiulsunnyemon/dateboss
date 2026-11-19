import React, { useState, useMemo } from 'react';
import {
  Users,
  Crown,
  Calendar,
  Clock,
  ChevronRight,
  MoreVertical,
  ShieldAlert,
  Flag,
  UserCheck,
} from 'lucide-react';
import { DashboardSection } from '../components/Sidebar';
import { useDashboard } from '../context/DashboardContext';

interface OverviewViewProps {
  onNavigate: (section: DashboardSection) => void;
}

interface MemberRow {
  id: string;
  name: string;
  city: string;
  role: 'Host' | 'Guest of Honor';
  membership: string;
  status: 'Verified' | 'Pending';
  avatar: string;
}

export function OverviewView({ onNavigate }: OverviewViewProps) {
  const [timeframe, setTimeframe] = useState<'month' | 'quarter'>('month');
  const { metrics, directoryMembers } = useDashboard();

  const members: MemberRow[] = useMemo(() => {
    return directoryMembers.slice(0, 4).map((m) => ({
      id: m.id,
      name: m.name,
      city: m.city,
      role: m.role,
      membership: m.membership === 'Gold' ? 'Paid' : 'Complimentary',
      status: m.verification === 'Verified' ? 'Verified' : 'Pending',
      avatar: m.avatar,
    }));
  }, [directoryMembers]);

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-[1.5px] bg-[#9F1E19]" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9F1E19]">
            Overview
          </span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-[28px] text-[#16120F] leading-tight">
          Platform Overview
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6A63] mt-1">
          Meaningful connections. Thoughtfully managed.
        </p>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6E6A63]">Total Members</span>
            <span className="w-7 h-7 rounded-lg bg-[#EFE7DA] flex items-center justify-center text-[#6E6A63]">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="font-serif font-bold text-3xl text-[#16120F] mt-3">
            {metrics.totalMembers.toLocaleString()}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
              +4.2%
            </span>
            <span className="text-[11px] text-[#6E6A63]">vs last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6E6A63]">Active Subscriptions</span>
            <span className="w-7 h-7 rounded-lg bg-[#FDF3DC] flex items-center justify-center text-[#D48806]">
              <Crown className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="font-serif font-bold text-3xl text-[#16120F] mt-3">
            {metrics.activeSubscriptions.toLocaleString()}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
              +6.2%
            </span>
            <span className="text-[11px] text-[#6E6A63]">vs last month</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6E6A63]">Monthly Revenue</span>
            <span className="w-7 h-7 rounded-lg bg-[#EFE7DA] flex items-center justify-center text-[#6E6A63]">
              <Calendar className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="font-serif font-bold text-3xl text-[#16120F] mt-3">
            ${metrics.monthlyRevenue.toLocaleString()}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
              +6.2%
            </span>
            <span className="text-[11px] text-[#6E6A63]">vs last month</span>
          </div>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => onNavigate('verification')}
          className="bg-[#FAF7F2] border border-[#E5DDD0] hover:border-[#9F1E19] rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6E6A63]">Pending Verification</span>
            <span className="w-7 h-7 rounded-lg bg-[#EFE7DA] flex items-center justify-center text-[#6E6A63]">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="font-serif font-bold text-3xl text-[#16120F] mt-3">
            {String(metrics.pendingVerification).padStart(2, '0')}
          </p>
          <p className="mt-3 text-[11px] text-[#6E6A63]">
            Ready for a quick look
          </p>
        </div>
      </div>

      {/* Middle Section: Growth Chart + A Little Attention */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Growth, with Intention */}
        <div className="xl:col-span-2 bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#16120F]">
                Growth, with Intention
              </h2>
              <p className="text-xs text-[#6E6A63] mt-0.5">
                How community and revenue quietly flourished
              </p>
            </div>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as 'month' | 'quarter')}
              className="bg-white border border-[#E5DDD0] rounded-full px-3.5 py-1.5 text-xs font-medium text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
            >
              <option value="month">This month</option>
              <option value="quarter">Last 6 months</option>
            </select>
          </div>

          <div className="mt-4 flex items-center gap-2.5">
            <span className="font-serif font-bold text-2xl text-[#16120F]">
              $48,620
            </span>
            <span className="text-[11px] text-[#6E6A63]">+6.2%</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
              +14.8%
            </span>
            <span className="text-[11px] text-[#6E6A63]">this month</span>
          </div>

          {/* Smooth SVG Chart */}
          <div className="mt-5 w-full overflow-hidden">
            <svg viewBox="0 0 600 180" className="w-full h-44">
              <defs>
                <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9F1E19" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#9F1E19" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Subtle Horizontal Grid */}
              {[30, 70, 110, 150].map((y) => (
                <line
                  key={y}
                  x1="36"
                  y1={y}
                  x2="590"
                  y2={y}
                  stroke="#E5DDD0"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              ))}

              {/* Area Fill */}
              <path
                d={
                  timeframe === 'month'
                    ? 'M40,140 C100,132 140,118 200,112 C260,106 310,88 370,84 C430,80 490,56 585,38 L585,160 L40,160 Z'
                    : 'M40,148 C110,136 160,126 220,108 C290,90 350,82 420,64 C480,50 530,36 585,24 L585,160 L40,160 Z'
                }
                fill="url(#revenueArea)"
              />

              {/* Revenue Line (Solid Dark Red) */}
              <path
                d={
                  timeframe === 'month'
                    ? 'M40,140 C100,132 140,118 200,112 C260,106 310,88 370,84 C430,80 490,56 585,38'
                    : 'M40,148 C110,136 160,126 220,108 C290,90 350,82 420,64 C480,50 530,36 585,24'
                }
                fill="none"
                stroke="#9F1E19"
                strokeWidth="2.2"
              />

              {/* Subscriptions Line (Dashed Charcoal) */}
              <path
                d={
                  timeframe === 'month'
                    ? 'M40,146 C100,140 150,134 210,126 C270,120 330,110 390,102 C450,94 520,82 585,72'
                    : 'M40,152 C110,145 170,135 230,124 C290,114 360,100 430,90 C500,78 540,68 585,58'
                }
                fill="none"
                stroke="#16120F"
                strokeWidth="1.6"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-[#6E6A63]">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#9F1E19] inline-block" /> Revenue
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 border-b border-dashed border-[#16120F] inline-block" /> Subscriptions
              </span>
            </div>
            <span>Updated a moment ago</span>
          </div>
        </div>

        {/* A Little Attention */}
        <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-5 sm:p-6 flex flex-col">
          <h2 className="font-serif font-bold text-lg text-[#16120F]">
            A Little Attention
          </h2>
          <p className="text-xs text-[#6E6A63] mt-0.5 mb-4">
            Small actions to support the community
          </p>

          <div className="space-y-3 flex-1">
            <button
              type="button"
              onClick={() => onNavigate('verification')}
              className="w-full p-3.5 rounded-xl bg-[#F5F1E6] hover:bg-[#EFE7DA] border border-[#E5DDD0] flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white border border-[#E5DDD0] flex items-center justify-center text-[#9F1E19]">
                  <UserCheck className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#16120F]">Pending Verifications</p>
                  <p className="text-[11px] text-[#6E6A63]">Review ID & selfie submissions</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-white border border-[#E5DDD0] text-[11px] font-bold text-[#16120F]">
                  {String(metrics.pendingVerification).padStart(2, '0')}
                </span>
                <ChevronRight className="w-4 h-4 text-[#6E6A63]" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('reports')}
              className="w-full p-3.5 rounded-xl bg-[#F5F1E6] hover:bg-[#EFE7DA] border border-[#E5DDD0] flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white border border-[#E5DDD0] flex items-center justify-center text-[#9F1E19]">
                  <Flag className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#16120F]">New Member Reports</p>
                  <p className="text-[11px] text-[#6E6A63]">Activity that may need a closer look</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-white border border-[#E5DDD0] text-[11px] font-bold text-[#16120F]">
                  {String(metrics.openReports).padStart(2, '0')}
                </span>
                <ChevronRight className="w-4 h-4 text-[#6E6A63]" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('safety')}
              className="w-full p-3.5 rounded-xl bg-[#F5F1E6] hover:bg-[#EFE7DA] border border-[#E5DDD0] flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white border border-[#E5DDD0] flex items-center justify-center text-[#9F1E19]">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#16120F]">Flagged Conversations</p>
                  <p className="text-[11px] text-[#6E6A63]">Reported by members yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-white border border-[#E5DDD0] text-[11px] font-bold text-[#16120F]">
                  {String(metrics.flaggedThreads).padStart(2, '0')}
                </span>
                <ChevronRight className="w-4 h-4 text-[#6E6A63]" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Table: A Few New Faces */}
      <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#16120F]">
              A Few New Faces
            </h2>
            <p className="text-xs text-[#6E6A63] mt-0.5">
              Those who've joined our circle recently
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('members')}
            className="text-xs font-semibold text-[#9F1E19] hover:underline flex items-center gap-1"
          >
            View all members <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5DDD0] text-[10px] font-semibold uppercase tracking-wider text-[#6E6A63]">
                <th className="py-3 pr-4">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Membership</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 pl-4 text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DDD0]/70 text-xs">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-[#F5F1E6]/60 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#E5DDD0]"
                      />
                      <div>
                        <p className="font-semibold text-[#16120F]">{m.name}</p>
                        <p className="text-[11px] text-[#6E6A63]">{m.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#16120F] font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-[#D48806] text-xs">
                        {m.role === 'Host' ? '👑' : '✨'}
                      </span>
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {m.membership === 'Paid' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FDF3DC] text-[#B7791F] text-[11px] font-semibold">
                        Paid
                      </span>
                    ) : (
                      <span className="text-[#6E6A63]">Complimentary</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {m.status === 'Verified' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigate('verification')}
                      className="p-1.5 rounded-lg text-[#6E6A63] hover:text-[#16120F] hover:bg-[#EFE7DA]"
                      aria-label="Member actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
