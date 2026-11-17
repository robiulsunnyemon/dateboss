const API_BASE_URL = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  roleView?: string;
  count?: number;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('thedateboss_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
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

export const api = {
  auth: {
    register: (payload: {
      email: string;
      password?: string;
      role?: 'HOST' | 'GUEST';
      gender?: 'MAN' | 'WOMAN' | 'OTHER';
      targetGender?: 'MEN' | 'WOMEN' | 'EVERYONE';
      nickname?: string;
    }) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

    login: (payload: { email: string; password?: string }) =>
      apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

    social: (payload: {
      provider: 'google' | 'apple';
      email: string;
      name?: string;
      avatar?: string;
      role?: 'HOST' | 'GUEST';
      gender?: 'MAN' | 'WOMAN' | 'OTHER';
      targetGender?: 'MEN' | 'WOMEN' | 'EVERYONE';
    }) => apiRequest('/auth/social', { method: 'POST', body: JSON.stringify(payload) }),

    me: () => apiRequest('/auth/me'),
  },

  onboarding: {
    saveGuestEvents: (payload: { selectedEvents: string[]; customIdeas: any[] }) =>
      apiRequest('/onboarding/step2/guest', { method: 'POST', body: JSON.stringify(payload) }),

    saveHostInterests: (payload: { interests: string[] }) =>
      apiRequest('/onboarding/step2/host', { method: 'POST', body: JSON.stringify(payload) }),

    saveDetails: (payload: { nickname: string; locationCity: string; latitude?: number; longitude?: number }) =>
      apiRequest('/onboarding/step4/details', { method: 'POST', body: JSON.stringify(payload) }),

    saveLifestyle: (payload: { children?: string; smoking?: string; drinking?: string }) =>
      apiRequest('/onboarding/step5/lifestyle', { method: 'POST', body: JSON.stringify(payload) }),

    saveCareer: (payload: { education?: string; occupation?: string; annualIncome?: string; netWorth?: string }) =>
      apiRequest('/onboarding/step6/career', { method: 'POST', body: JSON.stringify(payload) }),

    savePrompts: (payload: { bio?: string; idealDate?: string }) =>
      apiRequest('/onboarding/step7/prompts', { method: 'POST', body: JSON.stringify(payload) }),

    savePhotos: (payload: { photos: string[] }) =>
      apiRequest('/onboarding/step8/photos', { method: 'POST', body: JSON.stringify(payload) }),

    submitVerification: (payload: { selfieUrl?: string; faceSnapshotUrl?: string }) =>
      apiRequest('/onboarding/step10/verification', { method: 'POST', body: JSON.stringify(payload) }),

    finalize: () => apiRequest('/onboarding/step12/finalize', { method: 'POST' }),
  },

  discover: {
    getFeed: () => apiRequest('/discover'),
  },

  offers: {
    create: (payload: {
      guestId: string;
      activityType: string;
      venueName: string;
      proposedDateTime?: string;
      personalMessage?: string;
    }) => apiRequest('/offers', { method: 'POST', body: JSON.stringify(payload) }),

    getAll: () => apiRequest('/offers'),

    respond: (id: string, payload: { action: 'ACCEPT' | 'COUNTER' | 'PASS'; counterNote?: string; counterVenue?: string }) =>
      apiRequest(`/offers/${id}/respond`, { method: 'POST', body: JSON.stringify(payload) }),
  },
};
