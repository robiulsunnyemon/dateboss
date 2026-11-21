import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { dashboardApi } from '../services/api';
import { useAuth } from './AuthContext';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export interface VerificationItem {
  id: string;
  name: string;
  location: string;
  distance: string;
  avatar: string;
  selfieUrl: string;
  status: VerificationStatus;
  submittedAt: string;
  documentId: string;
}

export type AccountStatus = 'Active' | 'Suspended' | 'Banned';
export type MemberRole = 'Host' | 'Guest of Honor';
export interface AccountItem {
  id: string;
  memberIdCode: string;
  name: string;
  email: string;
  role: MemberRole;
  status: AccountStatus;
  avatar: string;
}

export type MembershipTier = 'Gold' | 'Complimentary';
export type VerificationBadge = 'Verified' | 'Pending review';
export interface DirectoryMember {
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

export interface PlanFeature {
  icon: 'mail' | 'crown' | 'chat' | 'send' | 'award';
  text: string;
}
export interface SubscriptionPlan {
  id: string;
  name: string;
  tierLabel: string;
  price: string;
  variant: 'guest' | 'host';
  features: PlanFeature[];
  footerNote: string;
}

export type ReportStatus = 'NEW' | 'IN_REVIEW' | 'RESOLVED';
export type ReportPriority = 'High priority' | 'Medium priority' | 'Low priority';
export interface ReportItem {
  id: string;
  code: string;
  title: string;
  priority: ReportPriority;
  description: string;
  reportedName: string;
  reportedAvatar: string;
  reporterName: string;
  timeAgo: string;
  status: ReportStatus;
  adminNote?: string;
}

export type AppealStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export interface AppealItem {
  id: string;
  code: string;
  reviewId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  reviewFeedback: string;
  reason: string;
  status: AppealStatus;
  adminNote?: string;
  timeAgo: string;
}

export type ThreadStatus = 'Flagged' | 'Warned' | 'Resolved';
export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  align: 'left' | 'right';
  text: string;
  time: string;
  isFlagged?: boolean;
}
export interface ModerationThread {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  queueName: string;
  queuePreview: string;
  queueTime: string;
  queueAvatar: string;
  verifiedBadge?: boolean;
  unreadCount?: number;
  status: ThreadStatus;
  flagReason: string;
  flagSubtext: string;
  dateLabel: string;
  messages: ChatMessage[];
}

export interface DashboardMetrics {
  totalMembers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  pendingVerification: number;
  openReports: number;
  flaggedThreads: number;
}

// Default initial data for instant first-paint
const DEFAULT_METRICS: DashboardMetrics = {
  totalMembers: 12846,
  activeSubscriptions: 1846,
  monthlyRevenue: 48620,
  pendingVerification: 4,
  openReports: 3,
  flaggedThreads: 2,
};

const DEFAULT_VERIFICATIONS: VerificationItem[] = [
  {
    id: 'ver-1',
    name: 'Sophia Williams, 27',
    location: 'New York, US',
    distance: '5.5 km away',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    status: 'PENDING',
    submittedAt: 'Submitted today, 10:28 am',
    documentId: 'ID<DEMO<WILLIAMS<<4821',
  },
  {
    id: 'ver-2',
    name: 'Olivia Bennett, 26',
    location: 'New York, US',
    distance: '3.2 km away',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    status: 'PENDING',
    submittedAt: 'Submitted today, 09:45 am',
    documentId: 'ID<DEMO<BENNETT<<9034',
  },
  {
    id: 'ver-3',
    name: 'Camila Laurent, 29',
    location: 'New York, US',
    distance: '4.1 km away',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    status: 'PENDING',
    submittedAt: 'Submitted today, 08:15 am',
    documentId: 'ID<DEMO<LAURENT<<3120',
  },
  {
    id: 'ver-4',
    name: 'Elena Rostova, 28',
    location: 'New York, US',
    distance: '6.0 km away',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    status: 'PENDING',
    submittedAt: 'Submitted yesterday, 07:10 pm',
    documentId: 'ID<DEMO<ROSTOVA<<7712',
  },
  {
    id: 'ver-5',
    name: 'James Alexander, 33',
    location: 'New York, US',
    distance: '2.4 km away',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    submittedAt: 'Submitted yesterday, 04:20 pm',
    documentId: 'ID<DEMO<ALEXANDER<<1145',
  },
  {
    id: 'ver-6',
    name: 'Daniel Mitchell, 35',
    location: 'New York, US',
    distance: '4.8 km away',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    submittedAt: 'Submitted yesterday, 02:10 pm',
    documentId: 'ID<DEMO<MITCHELL<<5529',
  },
  {
    id: 'ver-7',
    name: 'Marcus Vance, 31',
    location: 'New York, US',
    distance: '7.5 km away',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    status: 'REJECTED',
    submittedAt: 'Submitted 2 days ago',
    documentId: 'ID<DEMO<VANCE<<6618',
  },
];

const DEFAULT_ACCOUNTS: AccountItem[] = [
  {
    id: 'acc-1',
    memberIdCode: 'TDB-1048',
    name: 'James Alexander',
    email: 'james.a@example.com',
    role: 'Host',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'acc-2',
    memberIdCode: 'TDB-1047',
    name: 'Sophia Williams',
    email: 'sophia.w@example.com',
    role: 'Guest of Honor',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'acc-3',
    memberIdCode: 'TDB-1046',
    name: 'Daniel Mitchell',
    email: 'daniel.m@example.com',
    role: 'Host',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'acc-4',
    memberIdCode: 'TDB-1045',
    name: 'Olivia Bennett',
    email: 'olivia.b@example.com',
    role: 'Guest of Honor',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'acc-5',
    memberIdCode: 'TDB-1044',
    name: 'William Carter',
    email: 'william.c@example.com',
    role: 'Host',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'acc-6',
    memberIdCode: 'TDB-1043',
    name: 'Emma Laurent',
    email: 'emma.l@example.com',
    role: 'Guest of Honor',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'acc-7',
    memberIdCode: 'TDB-1042',
    name: 'Oliver Thompson',
    email: 'oliver.t@example.com',
    role: 'Host',
    status: 'Suspended',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'acc-8',
    memberIdCode: 'TDB-1041',
    name: 'Isabella Rose',
    email: 'isabella.r@example.com',
    role: 'Guest of Honor',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
  },
];

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
];

const DEFAULT_PLANS: SubscriptionPlan[] = [
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

const DEFAULT_REPORTS: ReportItem[] = [
  {
    id: 'rpt-1',
    code: 'RPT-2084',
    title: 'Inappropriate behavior',
    priority: 'High priority',
    description:
      'The member continued sending unwanted messages after I asked them to stop. I would like the conversation reviewed.',
    reportedName: 'William Carter',
    reportedAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    reporterName: 'Sophia Williams',
    timeAgo: '12 minutes ago',
    status: 'NEW',
  },
  {
    id: 'rpt-2',
    code: 'RPT-2083',
    title: 'Misleading profile',
    priority: 'Medium priority',
    description:
      'The information on this profile does not appear to match the person I spoke with. Their age and location may be inaccurate.',
    reportedName: 'Oliver Thompson',
    reportedAvatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    reporterName: 'Olivia Bennett',
    timeAgo: '34 minutes ago',
    status: 'NEW',
  },
  {
    id: 'rpt-3',
    code: 'RPT-2082',
    title: 'Suspicious activity',
    priority: 'High priority',
    description:
      'This member shared an external link and asked me to continue our conversation on another website.',
    reportedName: 'Daniel Mitchell',
    reportedAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    reporterName: 'Emma Laurent',
    timeAgo: '1 hour ago',
    status: 'NEW',
  },
];

const DEFAULT_APPEALS: AppealItem[] = [
  {
    id: 'app-1',
    code: 'APL-101',
    reviewId: 'rev-1',
    userId: 'usr-1',
    userName: 'Julian Sterling',
    userAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    reviewerName: 'Camila',
    reviewerAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: 2,
    reviewFeedback: 'Bad experience, host arrived late and cancelled the dessert.',
    reason: 'False Review - Host was on time at venue reservation desk and covered dinner.',
    status: 'PENDING',
    timeAgo: '20 minutes ago',
  },
  {
    id: 'app-2',
    code: 'APL-102',
    reviewId: 'rev-2',
    userId: 'usr-2',
    userName: 'Marcus Vance',
    userAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    reviewerName: 'Elena Rostova',
    reviewerAvatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    rating: 1,
    reviewFeedback: 'Total scam profile, never showed up.',
    reason: 'Off Topic & Mistake - Date was mutually rescheduled due to flight delay.',
    status: 'ACCEPTED',
    adminNote: 'Flight delay proof verified. Review removed from profile.',
    timeAgo: '2 hours ago',
  },
];

const DEFAULT_THREADS: ModerationThread[] = [
  {
    id: 'thr-1',
    code: 'CON-481',
    title: 'William Carter  &  Sophia Williams',
    subtitle: 'Private conversation',
    queueName: 'William Carter',
    queuePreview: "You still haven't replied. I'm going...",
    queueTime: '10:34 AM',
    queueAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    verifiedBadge: true,
    unreadCount: 1,
    status: 'Flagged',
    flagReason: 'Repeated unwanted contact',
    flagSubtext: 'Flagged for a thoughtful human review.',
    dateLabel: 'OCTOBER 24, 2024',
    messages: [
      {
        id: 'm1',
        senderName: 'William',
        senderAvatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
        align: 'left',
        text: 'I really enjoyed our conversation yesterday. Are you free to meet this weekend?',
        time: '10:15 AM',
      },
      {
        id: 'm2',
        senderName: 'Sophia',
        senderAvatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        align: 'right',
        text: "Thank you, but I don't think we're the right match. Wishing you the best.",
        time: '10:18 AM',
      },
    ],
  },
];

const CACHE_STORAGE_KEY = 'thedateboss_dashboard_cache_v2';

interface StoredCache {
  metrics?: DashboardMetrics;
  verifications?: VerificationItem[];
  accounts?: AccountItem[];
  members?: DirectoryMember[];
  plans?: SubscriptionPlan[];
  reports?: ReportItem[];
  threads?: ModerationThread[];
  timestamp: number;
}

function loadInitialCache(): StoredCache | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return null;
  }
}

interface DashboardContextType {
  metrics: DashboardMetrics;
  verifications: VerificationItem[];
  pendingCount: number;
  accounts: AccountItem[];
  directoryMembers: DirectoryMember[];
  plans: SubscriptionPlan[];
  reports: ReportItem[];
  threads: ModerationThread[];
  appeals: AppealItem[];
  isInitialLoading: boolean;
  refreshAll: () => Promise<void>;
  
  // Instant Optimistic Actions
  reviewVerification: (
    id: string,
    action: 'APPROVE' | 'REJECT',
    rejectionReason?: string
  ) => Promise<void>;
  updateAccountStatus: (
    id: string,
    action: 'SUSPEND' | 'BAN' | 'RESTORE'
  ) => Promise<void>;
  toggleMemberVerification: (id: string) => Promise<void>;
  updatePlan: (id: string, planData: Partial<SubscriptionPlan>) => Promise<void>;
  updateReportStatus: (
    id: string,
    status: ReportStatus,
    adminNote?: string
  ) => Promise<void>;
  moderateThread: (
    id: string,
    nextStatus: ThreadStatus,
    apiAction: 'WARN' | 'SUSPEND' | 'RESOLVE'
  ) => Promise<void>;
  resolveAppeal: (
    id: string,
    status: 'ACCEPTED' | 'REJECTED',
    adminNote?: string
  ) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const initialCache = useRef<StoredCache | null>(loadInitialCache());

  const [metrics, setMetrics] = useState<DashboardMetrics>(() => {
    return initialCache.current?.metrics || DEFAULT_METRICS;
  });

  const [verifications, setVerifications] = useState<VerificationItem[]>(() => {
    return initialCache.current?.verifications || DEFAULT_VERIFICATIONS;
  });

  const [accounts, setAccounts] = useState<AccountItem[]>(() => {
    return initialCache.current?.accounts || DEFAULT_ACCOUNTS;
  });

  const [directoryMembers, setDirectoryMembers] = useState<DirectoryMember[]>(() => {
    return initialCache.current?.members || DEFAULT_DIRECTORY_MEMBERS;
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    return initialCache.current?.plans || DEFAULT_PLANS;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    return initialCache.current?.reports || DEFAULT_REPORTS;
  });

  const [threads, setThreads] = useState<ModerationThread[]>(() => {
    return initialCache.current?.threads || DEFAULT_THREADS;
  });

  const [appeals, setAppeals] = useState<AppealItem[]>(DEFAULT_APPEALS);

  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(!initialCache.current);

  // Compute pending verifications directly from verifications list
  const pendingCount = verifications.filter((v) => v.status === 'PENDING').length;

  // Persist to sessionStorage cache on any state change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const cacheObj: StoredCache = {
        metrics,
        verifications,
        accounts,
        members: directoryMembers,
        plans,
        reports,
        threads,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cacheObj));
    } catch {
      // Ignore sessionStorage errors
    }
  }, [metrics, verifications, accounts, directoryMembers, plans, reports, threads]);

  // Fast Parallel Background Synchronizer
  const refreshAll = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const [
        metricsRes,
        verificationsRes,
        membersRes,
        plansRes,
        reportsRes,
        threadsRes,
        appealsRes,
      ] = await Promise.all([
        dashboardApi.admin.getMetrics().catch(() => null),
        dashboardApi.admin.getVerifications().catch(() => null),
        dashboardApi.admin.getMembers().catch(() => null),
        dashboardApi.admin.getPlans().catch(() => null),
        dashboardApi.admin.getReports().catch(() => null),
        dashboardApi.admin.getModerationThreads().catch(() => null),
        dashboardApi.admin.getAppeals().catch(() => null),
      ]);

      // Metrics
      if (metricsRes?.success && metricsRes.data) {
        const d = metricsRes.data;
        setMetrics((prev) => ({
          totalMembers: typeof d.totalUsers === 'number' ? d.totalUsers : prev.totalMembers,
          activeSubscriptions:
            typeof d.totalHosts === 'number' ? d.totalHosts : prev.activeSubscriptions,
          monthlyRevenue:
            typeof d.monthlyRevenueUsd === 'number'
              ? Math.round(d.monthlyRevenueUsd)
              : prev.monthlyRevenue,
          pendingVerification:
            typeof d.pendingVerifications === 'number'
              ? d.pendingVerifications
              : prev.pendingVerification,
          openReports:
            typeof d.openReports === 'number' ? d.openReports : prev.openReports,
          flaggedThreads:
            typeof d.flaggedThreads === 'number' ? d.flaggedThreads : prev.flaggedThreads,
        }));
      }

      // Verifications
      if (
        verificationsRes?.success &&
        Array.isArray(verificationsRes.data) &&
        verificationsRes.data.length > 0
      ) {
        const mapped: VerificationItem[] = verificationsRes.data.map((v: any) => ({
          id: v.id,
          name: v.user?.nickname || v.user?.email || 'Member',
          location: v.user?.locationCity || 'New York, US',
          distance: '5.5 km away',
          avatar: v.selfieUrl || DEFAULT_VERIFICATIONS[0].avatar,
          selfieUrl: v.selfieUrl || DEFAULT_VERIFICATIONS[0].selfieUrl,
          status: v.status as VerificationStatus,
          submittedAt: 'Submitted today, 10:28 am',
          documentId: 'ID<DEMO<VERIFIED<<4821',
        }));
        setVerifications(mapped);
      }

      // Accounts & Directory Members
      if (
        membersRes?.success &&
        Array.isArray(membersRes.data) &&
        membersRes.data.length > 0
      ) {
        const mappedAccounts: AccountItem[] = membersRes.data.map((u: any, idx: number) => ({
          id: u.id,
          memberIdCode: `TDB-${1048 - idx}`,
          name: (u.nickname || u.email.split('@')[0]).replace(/,\s*\d+$/, ''),
          email: u.email,
          role: u.role === 'HOST' ? 'Host' : 'Guest of Honor',
          status: u.isActive === false ? 'Suspended' : 'Active',
          avatar:
            u.hostProfile?.photos?.[0] ||
            u.guestProfile?.photos?.[0] ||
            DEFAULT_ACCOUNTS[idx % DEFAULT_ACCOUNTS.length].avatar,
        }));
        setAccounts(mappedAccounts);

        const mappedDirectory: DirectoryMember[] = membersRes.data.map((u: any, idx: number) => ({
          id: u.id,
          name: (u.nickname || u.email.split('@')[0]).replace(/,\s*\d+$/, ''),
          email: u.email,
          role: u.role === 'HOST' ? 'Host' : 'Guest of Honor',
          membership: u.role === 'HOST' ? 'Gold' : 'Complimentary',
          verification: u.isVerified ? 'Verified' : 'Pending review',
          joined: idx < 4 ? 'Today, 10:28 AM' : 'Yesterday',
          city: u.locationCity || 'New York, US',
          avatar:
            u.hostProfile?.photos?.[0] ||
            u.guestProfile?.photos?.[0] ||
            DEFAULT_DIRECTORY_MEMBERS[idx % DEFAULT_DIRECTORY_MEMBERS.length].avatar,
        }));
        setDirectoryMembers(mappedDirectory);
      }

      // Plans
      if (plansRes?.success && Array.isArray(plansRes.data) && plansRes.data.length > 0) {
        const mappedPlans: SubscriptionPlan[] = plansRes.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          tierLabel: p.tierLabel,
          price: p.priceDisplay,
          variant: p.variant === 'host' ? 'host' : 'guest',
          features: Array.isArray(p.features) ? p.features : [],
          footerNote: p.footerNote || 'Cancel any time. Guests of honor never pay.',
        }));
        setPlans(mappedPlans);
      }

      // Reports
      if (
        reportsRes?.success &&
        Array.isArray(reportsRes.data) &&
        reportsRes.data.length > 0
      ) {
        const mappedReports: ReportItem[] = reportsRes.data.map((r: any) => ({
          id: r.id,
          code: r.code || 'RPT-2000',
          title: r.title,
          priority:
            r.priority === 'HIGH'
              ? 'High priority'
              : r.priority === 'LOW'
              ? 'Low priority'
              : 'Medium priority',
          description: r.description,
          reportedName: r.reported?.nickname || r.reported?.email || 'Member',
          reportedAvatar:
            r.reported?.hostProfile?.photos?.[0] ||
            r.reported?.guestProfile?.photos?.[0] ||
            DEFAULT_REPORTS[0].reportedAvatar,
          reporterName: r.reporter?.nickname || r.reporter?.email || 'Member',
          timeAgo: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : 'Recently',
          status: (r.status as ReportStatus) || 'NEW',
          adminNote: r.adminNote || undefined,
        }));
        setReports(mappedReports);
      }

      // Threads
      if (
        threadsRes?.success &&
        Array.isArray(threadsRes.data) &&
        threadsRes.data.length > 0
      ) {
        const mappedThreads: ModerationThread[] = threadsRes.data.map((offer: any) => {
          const hostName = offer.host?.nickname || 'Host';
          const guestName = offer.guest?.nickname || 'Guest';
          const hostAvatar =
            offer.host?.hostProfile?.photos?.[0] ||
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80';
          const guestAvatar =
            offer.guest?.guestProfile?.photos?.[0] ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
          const statusMap: Record<string, ThreadStatus> = {
            FLAGGED: 'Flagged',
            WARNED: 'Warned',
            RESOLVED: 'Resolved',
          };
          const msgs: ChatMessage[] = Array.isArray(offer.messages)
            ? offer.messages.map((m: any) => {
                const isHostSender = m.senderId === offer.hostId;
                return {
                  id: m.id,
                  senderName: m.sender?.nickname || (isHostSender ? hostName : guestName),
                  senderAvatar: isHostSender ? hostAvatar : guestAvatar,
                  align: isHostSender ? 'left' : 'right',
                  text: m.text,
                  time: new Date(m.createdAt || Date.now()).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  }),
                };
              })
            : [];
          const lastMsg = msgs[msgs.length - 1];
          return {
            id: offer.id,
            code: offer.threadCode || 'CON-481',
            title: `${hostName}  &  ${guestName}`,
            subtitle: 'Private conversation',
            queueName: hostName,
            queuePreview: lastMsg?.text || offer.flagReason || 'Flagged conversation',
            queueTime: lastMsg?.time || 'Today',
            queueAvatar: hostAvatar,
            verifiedBadge: Boolean(offer.host?.isVerified),
            unreadCount: offer.moderationStatus === 'FLAGGED' ? 1 : 0,
            status: statusMap[offer.moderationStatus] || 'Flagged',
            flagReason: offer.flagReason || 'Flagged conversation',
            flagSubtext: offer.flagSubtext || 'Flagged for a thoughtful human review.',
            dateLabel: new Date(offer.updatedAt || Date.now())
              .toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
              .toUpperCase(),
            messages: msgs,
          };
        });
        setThreads(mappedThreads);
      }

      // Appeals
      if (
        appealsRes?.success &&
        Array.isArray(appealsRes.data) &&
        appealsRes.data.length > 0
      ) {
        const mappedAppeals: AppealItem[] = appealsRes.data.map((a: any, idx: number) => ({
          id: a.id,
          code: `APL-${101 + idx}`,
          reviewId: a.reviewId,
          userId: a.userId,
          userName: a.user?.nickname || a.user?.email || 'Member',
          userAvatar:
            a.user?.hostProfile?.photos?.[0] ||
            a.user?.guestProfile?.photos?.[0] ||
            DEFAULT_APPEALS[0].userAvatar,
          reviewerName:
            a.review?.reviewer?.nickname || a.review?.reviewer?.email || 'Reviewer',
          reviewerAvatar:
            a.review?.reviewer?.hostProfile?.photos?.[0] ||
            a.review?.reviewer?.guestProfile?.photos?.[0] ||
            DEFAULT_APPEALS[0].reviewerAvatar,
          rating: a.review?.rating || 1,
          reviewFeedback: a.review?.feedback || 'No written feedback provided.',
          reason: a.reason || 'Reported review',
          status: (a.status as AppealStatus) || 'PENDING',
          adminNote: a.adminNote || undefined,
          timeAgo: a.createdAt
            ? new Date(a.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : 'Recently',
        }));
        setAppeals(mappedAppeals);
      }
    } finally {
      setIsInitialLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // 1. Instant Optimistic Review Verification
  const reviewVerification = useCallback(
    async (id: string, action: 'APPROVE' | 'REJECT', rejectionReason?: string) => {
      const nextStatus: VerificationStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

      // 0ms INSTANT State Update
      setVerifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
      );
      setMetrics((prev) => ({
        ...prev,
        pendingVerification: Math.max(0, prev.pendingVerification - 1),
      }));

      // Background API sync
      try {
        await dashboardApi.admin.reviewVerification(id, {
          action,
          rejectionReason,
        });
      } catch (err) {
        console.warn('API review failed, keeping local state:', err);
      }
    },
    []
  );

  // 2. Instant Optimistic Account Status Update
  const updateAccountStatus = useCallback(
    async (id: string, action: 'SUSPEND' | 'BAN' | 'RESTORE') => {
      const nextStatus: AccountStatus =
        action === 'SUSPEND' ? 'Suspended' : action === 'BAN' ? 'Banned' : 'Active';

      // 0ms INSTANT State Update
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === id ? { ...acc, status: nextStatus } : acc))
      );

      // Background API sync
      try {
        await dashboardApi.admin.updateAccountStatus(id, action);
      } catch (err) {
        console.warn('API account update failed, keeping local state:', err);
      }
    },
    []
  );

  // 3. Instant Optimistic Toggle Member Verification
  const toggleMemberVerification = useCallback(async (id: string) => {
    // 0ms INSTANT State Update
    setDirectoryMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, verification: m.verification === 'Verified' ? 'Pending review' : 'Verified' }
          : m
      )
    );
  }, []);

  // 4. Instant Optimistic Update Plan
  const updatePlan = useCallback(
    async (id: string, planData: Partial<SubscriptionPlan>) => {
      // 0ms INSTANT State Update
      setPlans((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...planData } : p))
      );

      // Background API sync
      try {
        const numericPrice = parseFloat(
          (planData.price || '').replace(/[^0-9.]/g, '') || '0'
        );
        await dashboardApi.admin.updatePlan(id, {
          ...planData,
          priceDisplay: planData.price,
          priceCents: Number.isNaN(numericPrice) ? 0 : Math.round(numericPrice * 100),
        });
      } catch (err) {
        console.warn('API plan update failed, keeping local state:', err);
      }
    },
    []
  );

  // 5. Instant Optimistic Report Status Update
  const updateReportStatus = useCallback(
    async (id: string, status: ReportStatus, adminNote?: string) => {
      // 0ms INSTANT State Update
      setReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status,
                adminNote: adminNote !== undefined ? adminNote : r.adminNote,
              }
            : r
        )
      );
      if (status === 'RESOLVED') {
        setMetrics((prev) => ({
          ...prev,
          openReports: Math.max(0, prev.openReports - 1),
        }));
      }

      // Background API sync
      try {
        await dashboardApi.admin.updateReport(id, {
          status,
          adminNote,
        });
      } catch (err) {
        console.warn('API report update failed, keeping local state:', err);
      }
    },
    []
  );

  // 6. Instant Optimistic Moderate Thread
  const moderateThread = useCallback(
    async (
      id: string,
      nextStatus: ThreadStatus,
      apiAction: 'WARN' | 'SUSPEND' | 'RESOLVE'
    ) => {
      // 0ms INSTANT State Update
      setThreads((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: nextStatus, unreadCount: 0 } : t
        )
      );
      if (nextStatus === 'Resolved') {
        setMetrics((prev) => ({
          ...prev,
          flaggedThreads: Math.max(0, prev.flaggedThreads - 1),
        }));
      }

      // Background API sync
      try {
        await dashboardApi.admin.moderateThread(id, apiAction);
      } catch (err) {
        console.warn('API moderate thread failed, keeping local state:', err);
      }
    },
    []
  );

  // 7. Instant Optimistic Resolve Appeal
  const resolveAppeal = useCallback(
    async (id: string, status: 'ACCEPTED' | 'REJECTED', adminNote?: string) => {
      // 0ms INSTANT State Update
      setAppeals((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status,
                adminNote: adminNote !== undefined ? adminNote : a.adminNote,
              }
            : a
        )
      );

      // Background API sync
      try {
        await dashboardApi.admin.resolveAppeal(id, {
          status,
          adminNote,
        });
      } catch (err) {
        console.warn('API resolve appeal failed, keeping local state:', err);
      }
    },
    []
  );

  const value: DashboardContextType = {
    metrics,
    verifications,
    pendingCount,
    accounts,
    directoryMembers,
    plans,
    reports,
    threads,
    appeals,
    isInitialLoading,
    refreshAll,
    reviewVerification,
    updateAccountStatus,
    toggleMemberVerification,
    updatePlan,
    updateReportStatus,
    moderateThread,
    resolveAppeal,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
