import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Crown,
  X,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  Award,
} from 'lucide-react';
import { dashboardApi } from '../services/api';

type DirectoryTab = 'directory' | 'plans';
type MemberRole = 'Host' | 'Guest of Honor';
type MembershipTier = 'Gold' | 'Complimentary';
type VerificationBadge = 'Verified' | 'Pending review';

interface DirectoryMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  membership: MembershipTier;
  verification: VerificationBadge;
  joined: string;
  city: string;
  avatar: string;
}

const DEFAULT_DIRECTORY_MEMBERS: DirectoryMember[] = [
  {
    id: 'mem-1',
    name: 'James Alexander',
    email: 'james.a@example.com',
    role: 'Host',
    membership: 'Gold',
    verification: 'Verified',
    joined: 'Today, 10:42 AM',
    city: 'New York, US',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'mem-2',
    name: 'Sophia Williams',
    email: 'sophia.w@example.com',
    role: 'Guest of Honor',
    membership: 'Complimentary',
    verification: 'Pending review',
    joined: 'Today, 10:28 AM',
    city: 'New York, US',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'mem-3',
    name: 'Daniel Mitchell',
    email: 'daniel.m@example.com',
    role: 'Host',
    membership: 'Gold',
    verification: 'Verified',
    joined: 'Today, 10:15 AM',
    city: 'New York, US',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'mem-4',
    name: 'Olivia Bennett',
    email: 'olivia.b@example.com',
    role: 'Guest of Honor',
    membership: 'Complimentary',
    verification: 'Pending review',
    joined: 'Today, 9:56 AM',
    city: 'New York, US',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'mem-5',
    name: 'William Carter',
    email: 'william.c@example.com',
    role: 'Host',
    membership: 'Gold',
    verification: 'Pending review',
    joined: 'Today, 9:32 AM',
    city: 'Tribeca, NY',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'mem-6',
    name: 'Emma Laurent',
    email: 'emma.l@example.com',
    role: 'Guest of Honor',
    membership: 'Complimentary',
    verification: 'Pending review',
    joined: 'Yesterday',
    city: 'Downtown, NY',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'mem-7',
    name: 'Oliver Thompson',
    email: 'oliver.t@example.com',
    role: 'Host',
    membership: 'Gold',
    verification: 'Pending review',
    joined: 'Yesterday',
    city: 'West End, London',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'mem-8',
    name: 'Isabella Rose',
    email: 'isabella.r@example.com',
    role: 'Guest of Honor',
    membership: 'Complimentary',
    verification: 'Pending review',
    joined: 'Yesterday',
    city: 'SoHo, NY',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
  },
];

interface PlanFeature {
  icon: 'mail' | 'crown' | 'chat' | 'send' | 'award';
  text: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  tierLabel: string;
  price: string;
  variant: 'guest' | 'host';
  features: PlanFeature[];
  footerNote: string;
}

const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-guest',
    name: 'Guest of Honor',
    tierLabel: 'Free',
    price: '$0.00/Mo',
    variant: 'guest',
    features: [
      { icon: 'mail', text: 'Receive offers from verified hosts' },
      { icon: 'crown', text: 'Silver crown on your profile' },
      { icon: 'chat', text: 'Chat opens only after you say yes' },
    ],
    footerNote: 'Cancel any time. Guests of honor never pay.',
  },
  {
    id: 'plan-host',
    name: 'Host',
    tierLabel: 'Pro',
    price: '$9.99/Mo',
    variant: 'host',
    features: [
      { icon: 'send', text: 'Send offers to verified Guests of Honor' },
      { icon: 'crown', text: 'Gold crown on your profile' },
      { icon: 'award', text: 'A reliability score that builds trust' },
    ],
    footerNote: 'Cancel any time. Guests of honor never pay.',
  },
];

export function MembersSubscriptionsView() {
  const [activeTab, setActiveTab] = useState<DirectoryTab>('directory');
  const [members, setMembers] = useState<DirectoryMember[]>(DEFAULT_DIRECTORY_MEMBERS);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_PLANS);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | MemberRole>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<'ALL' | VerificationBadge>('ALL');
  const [membershipFilter, setMembershipFilter] = useState<'ALL' | MembershipTier>('ALL');

  // Pagination & Detail Drawer
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<DirectoryMember | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const pageSize = 8;

  useEffect(() => {
    async function fetchMembersAndPlans() {
      try {
        const [membersRes, plansRes] = await Promise.all([
          dashboardApi.admin.getMembers().catch(() => null),
          dashboardApi.admin.getPlans().catch(() => null),
        ]);
        if (membersRes?.success && Array.isArray(membersRes.data) && membersRes.data.length > 0) {
          const liveMembers: DirectoryMember[] = membersRes.data.map((u: any, index: number) => ({
            id: u.id,
            name: (u.nickname || u.email.split('@')[0]).replace(/,\s*\d+$/, ''),
            email: u.email,
            role: u.role === 'HOST' ? 'Host' : 'Guest of Honor',
            membership: u.role === 'HOST' ? 'Gold' : 'Complimentary',
            verification: u.isVerified ? 'Verified' : 'Pending review',
            joined: index < 4 ? 'Today, 10:28 AM' : 'Yesterday',
            city: u.locationCity || 'New York, US',
            avatar:
              u.hostProfile?.photos?.[0] ||
              u.guestProfile?.photos?.[0] ||
              DEFAULT_DIRECTORY_MEMBERS[index % DEFAULT_DIRECTORY_MEMBERS.length].avatar,
          }));
          setMembers(liveMembers);
        }
        if (plansRes?.success && Array.isArray(plansRes.data) && plansRes.data.length > 0) {
          const livePlans: SubscriptionPlan[] = plansRes.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            tierLabel: p.tierLabel,
            price: p.priceDisplay,
            variant: p.variant === 'host' ? 'host' : 'guest',
            features: Array.isArray(p.features) ? p.features : [],
            footerNote: p.footerNote || 'Cancel any time. Guests of honor never pay.',
          }));
          setPlans(livePlans);
        }
      } catch {
        // Use fallback data seamlessly in demo mode
      }
    }
    fetchMembersAndPlans();
  }, []);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return members.filter((m) => {
      const matchesSearch =
        !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
      const matchesVerif =
        verificationFilter === 'ALL' || m.verification === verificationFilter;
      const matchesMembership =
        membershipFilter === 'ALL' || m.membership === membershipFilter;
      return matchesSearch && matchesRole && matchesVerif && matchesMembership;
    });
  }, [members, searchQuery, roleFilter, verificationFilter, membershipFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedMembers = filteredMembers.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, verificationFilter, membershipFilter]);

  const toggleMemberVerification = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, verification: m.verification === 'Verified' ? 'Pending review' : 'Verified' }
          : m
      )
    );
    setSelectedMember((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            verification: prev.verification === 'Verified' ? 'Pending review' : 'Verified',
          }
        : prev
    );
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    const planToSave = editingPlan;
    setPlans((prev) =>
      prev.map((p) => (p.id === planToSave.id ? planToSave : p))
    );
    setEditingPlan(null);

    try {
      const numericPrice = parseFloat(planToSave.price.replace(/[^0-9.]/g, '') || '0');
      await dashboardApi.admin.updatePlan(planToSave.id, {
        name: planToSave.name,
        tierLabel: planToSave.tierLabel,
        priceDisplay: planToSave.price,
        priceCents: Number.isNaN(numericPrice) ? 0 : Math.round(numericPrice * 100),
        features: planToSave.features,
        footerNote: planToSave.footerNote,
      });
    } catch {
      // Keep local update in demo mode
    }
  };

  const renderPlanFeatureIcon = (icon: PlanFeature['icon'], variant: 'guest' | 'host') => {
    const colorClass = variant === 'host' ? 'text-[#E5A32E]' : 'text-[#6E6A63]';
    switch (icon) {
      case 'mail':
        return <Mail className={`w-3.5 h-3.5 shrink-0 ${colorClass}`} />;
      case 'crown':
        return <Crown className={`w-3.5 h-3.5 shrink-0 ${colorClass}`} />;
      case 'chat':
        return <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${colorClass}`} />;
      case 'send':
        return <Send className={`w-3.5 h-3.5 shrink-0 ${colorClass}`} />;
      case 'award':
        return <Award className={`w-3.5 h-3.5 shrink-0 ${colorClass}`} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-[1.5px] bg-[#9F1E19]" />
          <span className="text-[11px] font-semibold text-[#9F1E19] tracking-wide">
            The People Behind the Connections
          </span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-[28px] text-[#16120F] leading-tight">
          Members &amp; Subscriptions
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6A63] mt-1">
          Nurture your community. Curate an exceptional experience.
        </p>
      </div>

      {/* Top Segmented Tabs */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'directory'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
          }`}
        >
          <span>Member directory</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'directory'
                ? 'bg-white/20 text-white'
                : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {members.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'plans'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
          }`}
        >
          <span>Subscription plans</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'plans'
                ? 'bg-white/20 text-white'
                : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {plans.length}
          </span>
        </button>
      </div>

      {/* TAB 1: MEMBER DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl overflow-hidden">
          {/* Toolbar: Search + 3 Filter Dropdowns */}
          <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#E5DDD0]/80">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-[240px]">
              <Search className="w-3.5 h-3.5 text-[#8A857D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a member..."
                className="w-full bg-[#F5F1E6]/70 border border-[#E5DDD0] rounded-full pl-9 pr-4 py-2 text-xs text-[#16120F] placeholder:text-[#8A857D] focus:outline-none focus:border-[#9F1E19] transition-colors"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Role Filter */}
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as 'ALL' | MemberRole)}
                  className="appearance-none bg-[#F5F1E6]/70 border border-[#E5DDD0] hover:border-[#9F1E19]/50 rounded-full pl-3.5 pr-8 py-2 text-xs font-medium text-[#16120F] focus:outline-none focus:border-[#9F1E19] cursor-pointer"
                >
                  <option value="ALL">All roles</option>
                  <option value="Host">Host</option>
                  <option value="Guest of Honor">Guest of Honor</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#6E6A63] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Verification Filter */}
              <div className="relative">
                <select
                  value={verificationFilter}
                  onChange={(e) =>
                    setVerificationFilter(e.target.value as 'ALL' | VerificationBadge)
                  }
                  className="appearance-none bg-[#F5F1E6]/70 border border-[#E5DDD0] hover:border-[#9F1E19]/50 rounded-full pl-3.5 pr-8 py-2 text-xs font-medium text-[#16120F] focus:outline-none focus:border-[#9F1E19] cursor-pointer"
                >
                  <option value="ALL">All verifications</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending review">Pending review</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#6E6A63] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Membership Filter */}
              <div className="relative">
                <select
                  value={membershipFilter}
                  onChange={(e) =>
                    setMembershipFilter(e.target.value as 'ALL' | MembershipTier)
                  }
                  className="appearance-none bg-[#F5F1E6]/70 border border-[#E5DDD0] hover:border-[#9F1E19]/50 rounded-full pl-3.5 pr-8 py-2 text-xs font-medium text-[#16120F] focus:outline-none focus:border-[#9F1E19] cursor-pointer"
                >
                  <option value="ALL">All memberships</option>
                  <option value="Gold">Gold</option>
                  <option value="Complimentary">Complimentary</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#6E6A63] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F1E6]/80 border-b border-[#E5DDD0] text-[10px] font-semibold uppercase tracking-wider text-[#6E6A63]">
                  <th className="py-3 px-5">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Membership</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-5 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DDD0]/70 text-xs">
                {paginatedMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#6E6A63]">
                      No members match your current filters.
                    </td>
                  </tr>
                ) : (
                  paginatedMembers.map((member) => (
                    <tr
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className="hover:bg-[#F5F1E6]/60 transition-colors cursor-pointer group"
                    >
                      {/* Member Name & Email */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#E5DDD0] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#16120F] truncate">
                              {member.name}
                            </p>
                            <p className="text-[11px] text-[#8A857D] truncate">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#16120F]">
                          <Crown
                            className={`w-3.5 h-3.5 ${
                              member.role === 'Host' ? 'text-[#D48806]' : 'text-[#8A857D]'
                            }`}
                          />
                          <span>{member.role}</span>
                        </span>
                      </td>

                      {/* Membership */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {member.membership === 'Gold' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FDF3DC] border border-[#F3DC9F] text-[#B7791F] text-[11px] font-semibold">
                            <Crown className="w-3 h-3" />
                            Gold
                          </span>
                        ) : (
                          <span className="text-[#6E6A63] text-xs">Complimentary</span>
                        )}
                      </td>

                      {/* Verification */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {member.verification === 'Verified' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#FDF6E4] border border-[#F2DFB0] text-[#B7791F] text-[11px] font-medium">
                            Pending review
                          </span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[#6E6A63] text-[11px]">
                        {member.joined}
                      </td>

                      {/* Arrow Action */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(member);
                          }}
                          className="p-1.5 rounded-full text-[#6E6A63] group-hover:text-[#9F1E19] group-hover:bg-[#EFE7DA] transition-colors"
                          aria-label={`Inspect ${member.name}`}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-5 py-3.5 border-t border-[#E5DDD0]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6E6A63]">
            <span>
              Showing {paginatedMembers.length} of {filteredMembers.length} members
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 rounded-md flex items-center justify-center text-[#6E6A63] hover:bg-[#EFE7DA] disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: Math.max(2, totalPages) }).map((_, idx) => {
                const pageNum = idx + 1;
                const isDisabled = pageNum > totalPages;
                const isActive = safePage === pageNum;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => !isDisabled && setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#9F1E19] text-white shadow-sm'
                        : isDisabled
                        ? 'text-[#A39E96] cursor-default'
                        : 'text-[#16120F] hover:bg-[#EFE7DA]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-7 h-7 rounded-md flex items-center justify-center text-[#6E6A63] hover:bg-[#EFE7DA] disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIPTION PLANS */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[760px]">
          {plans.map((plan) => {
            const isHost = plan.variant === 'host';
            return (
              <div
                key={plan.id}
                className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Row: Role & Tier */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6A63]">
                      <Crown
                        className={`w-3.5 h-3.5 ${
                          isHost ? 'text-[#F3A83B]' : 'text-[#8A857D]'
                        }`}
                      />
                      <span>{plan.name}</span>
                    </span>
                    <span className="text-[11px] font-medium text-[#8A857D]">
                      {plan.tierLabel}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-2.5">
                    <span className="font-serif font-bold text-2xl sm:text-[26px] text-[#16120F] tracking-tight">
                      {plan.price}
                    </span>
                  </div>

                  {/* Edit Plan CTA Button */}
                  <button
                    type="button"
                    onClick={() => setEditingPlan({ ...plan, features: plan.features.map((f) => ({ ...f })) })}
                    className={`w-full mt-5 py-2.5 px-5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      isHost
                        ? 'bg-[#FCB943] hover:bg-[#EDA830] text-[#16120F]'
                        : 'bg-[#9F1E19] hover:bg-[#851713] text-white'
                    }`}
                  >
                    Edit plan
                  </button>

                  {/* Features List */}
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2.5 text-xs text-[#16120F]"
                      >
                        {renderPlanFeatureIcon(feat.icon, plan.variant)}
                        <span>{feat.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Divider & Footer Note */}
                <div className="mt-6 pt-3.5 border-t border-[#E5DDD0]">
                  <p className="text-[11px] text-[#8A857D]">{plan.footerNote}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Subscription Plan Modal */}
      {editingPlan && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4"
          onClick={() => setEditingPlan(null)}
        >
          <form
            onSubmit={handleSavePlan}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#16120F]">
                Edit {editingPlan.name} Plan
              </h3>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="p-1.5 rounded-full text-[#6E6A63] hover:text-[#16120F] hover:bg-[#EFE7DA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  required
                  value={editingPlan.name}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, name: e.target.value })
                  }
                  className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                  Tier Label
                </label>
                <input
                  type="text"
                  required
                  value={editingPlan.tierLabel}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, tierLabel: e.target.value })
                  }
                  className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                Monthly Price
              </label>
              <input
                type="text"
                required
                value={editingPlan.price}
                onChange={(e) =>
                  setEditingPlan({ ...editingPlan, price: e.target.value })
                }
                className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-[#6E6A63]">
                Included Features
              </label>
              {editingPlan.features.map((feat, idx) => (
                <input
                  key={idx}
                  type="text"
                  required
                  value={feat.text}
                  onChange={(e) => {
                    const updated = [...editingPlan.features];
                    updated[idx] = { ...updated[idx], text: e.target.value };
                    setEditingPlan({ ...editingPlan, features: updated });
                  }}
                  className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
                />
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6E6A63] mb-1">
                Footer Note
              </label>
              <input
                type="text"
                value={editingPlan.footerNote}
                onChange={(e) =>
                  setEditingPlan({ ...editingPlan, footerNote: e.target.value })
                }
                className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 rounded-full bg-white border border-[#E5DDD0] text-xs font-semibold text-[#16120F]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-semibold"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Member Quick Detail Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="w-full max-w-md bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-6 shadow-xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#E5DDD0]"
                />
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#16120F]">
                    {selectedMember.name}
                  </h3>
                  <p className="text-xs text-[#6E6A63] flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {selectedMember.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="p-1.5 rounded-full text-[#6E6A63] hover:text-[#16120F] hover:bg-[#EFE7DA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F1E6] border border-[#E5DDD0]">
                <p className="text-[10px] uppercase text-[#6E6A63]">Role</p>
                <p className="font-semibold text-[#16120F] mt-0.5 flex items-center gap-1.5">
                  <Crown
                    className={`w-3.5 h-3.5 ${
                      selectedMember.role === 'Host' ? 'text-[#D48806]' : 'text-[#8A857D]'
                    }`}
                  />
                  {selectedMember.role}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F1E6] border border-[#E5DDD0]">
                <p className="text-[10px] uppercase text-[#6E6A63]">Membership</p>
                <p className="font-semibold text-[#16120F] mt-0.5">
                  {selectedMember.membership}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F1E6] border border-[#E5DDD0]">
                <p className="text-[10px] uppercase text-[#6E6A63]">Location</p>
                <p className="font-semibold text-[#16120F] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#9F1E19]" />
                  {selectedMember.city}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F1E6] border border-[#E5DDD0]">
                <p className="text-[10px] uppercase text-[#6E6A63]">Joined</p>
                <p className="font-semibold text-[#16120F] mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#6E6A63]" />
                  {selectedMember.joined}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E5DDD0]">
              <span className="text-xs text-[#6E6A63]">
                Status:{' '}
                <strong className="text-[#16120F]">{selectedMember.verification}</strong>
              </span>
              <button
                type="button"
                onClick={() => toggleMemberVerification(selectedMember.id)}
                className="px-4 py-2 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-semibold transition-colors"
              >
                {selectedMember.verification === 'Verified'
                  ? 'Mark Pending'
                  : 'Approve Verification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
