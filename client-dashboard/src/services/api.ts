const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000/api';

export const TOKEN_KEY = 'thedateboss_dashboard_token';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  counts?: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !token.startsWith('demo_admin_token_')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const dashboardApi = {
  auth: {
    login: (payload: { email: string; password: string }) =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    me: () => apiRequest('/auth/me'),
  },
  admin: {
    getMetrics: () => apiRequest('/admin/metrics'),
    getMembers: () => apiRequest('/admin/members'),
    updateAccountStatus: (id: string, action: 'SUSPEND' | 'BAN' | 'RESTORE') =>
      apiRequest(`/admin/accounts/${id}/status`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      }),
    getPlans: () => apiRequest('/admin/plans'),
    updatePlan: (id: string, payload: any) =>
      apiRequest(`/admin/plans/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    getReports: (status?: 'NEW' | 'IN_REVIEW' | 'RESOLVED') =>
      apiRequest(`/admin/reports${status ? `?status=${status}` : ''}`),
    updateReport: (id: string, payload: { status: 'NEW' | 'IN_REVIEW' | 'RESOLVED'; adminNote?: string }) =>
      apiRequest(`/admin/reports/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    getModerationThreads: (status?: 'FLAGGED' | 'WARNED' | 'RESOLVED') =>
      apiRequest(`/admin/moderation/threads${status ? `?status=${status}` : ''}`),
    moderateThread: (offerId: string, action: 'WARN' | 'SUSPEND' | 'RESOLVE') =>
      apiRequest(`/admin/moderation/threads/${offerId}/action`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      }),
    getVerifications: (status?: 'PENDING' | 'APPROVED' | 'REJECTED') =>
      apiRequest(`/admin/verifications${status ? `?status=${status}` : ''}`),
    reviewVerification: (
      id: string,
      payload: { action: 'APPROVE' | 'REJECT'; rejectionReason?: string }
    ) =>
      apiRequest(`/admin/verifications/${id}/review`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getAppeals: () => apiRequest('/admin/appeals'),
    resolveAppeal: (
      id: string,
      payload: { status: 'ACCEPTED' | 'REJECTED'; adminNote?: string }
    ) =>
      apiRequest(`/admin/appeals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
  },
};
