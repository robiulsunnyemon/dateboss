const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000/api';

export const TOKEN_KEY = 'thedateboss_token';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  roleView?: string;
  role?: string;
  count?: number;
  total?: number;
  page?: number;
  requiresPayment?: boolean;
  publishableKey?: string | null;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
    const err: any = new Error(data.message || 'Request failed');
    err.status = response.status;
    err.requiresPayment = data.requiresPayment;
    throw err;
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

    saveDetails: (payload: {
      nickname: string;
      age?: number;
      locationCity: string;
      latitude?: number;
      longitude?: number;
    }) => apiRequest('/onboarding/step4/details', { method: 'POST', body: JSON.stringify(payload) }),

    saveLifestyle: (payload: {
      children?: string;
      smoking?: string;
      drinking?: string;
      heightInches?: number;
      bodyType?: string;
      lookingFor?: string[];
    }) =>
      apiRequest('/onboarding/step5/lifestyle', { method: 'POST', body: JSON.stringify(payload) }),

    saveCareer: (payload: {
      education?: string;
      occupation?: string;
      annualIncome?: string;
      netWorth?: string;
    }) => apiRequest('/onboarding/step6/career', { method: 'POST', body: JSON.stringify(payload) }),

    savePrompts: (payload: { bio?: string; idealDate?: string }) =>
      apiRequest('/onboarding/step7/prompts', { method: 'POST', body: JSON.stringify(payload) }),

    savePhotos: (payload: { photos: string[] }) =>
      apiRequest('/onboarding/step8/photos', { method: 'POST', body: JSON.stringify(payload) }),

    submitVerification: (payload: { selfieUrl?: string; faceSnapshotUrl?: string }) =>
      apiRequest('/onboarding/step10/verification', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    finalize: () => apiRequest('/onboarding/step12/finalize', { method: 'POST' }),
  },

  profile: {
    getMe: () => apiRequest('/profile/me'),
    getPublicProfile: (id: string) => apiRequest(`/profile/${id}`),
    updateMe: (payload: Record<string, any>) =>
      apiRequest('/profile/me', { method: 'PATCH', body: JSON.stringify(payload) }),
    submitAppeal: (payload: { reviewId: string; reason: string }) =>
      apiRequest('/profile/appeals', { method: 'POST', body: JSON.stringify(payload) }),
  },

  discover: {
    getFeed: (params?: {
      category?: string;
      search?: string;
      location?: string;
      isIdVerified?: boolean;
      isSelfieVerified?: boolean;
      smoking?: string;
      drinking?: string;
      children?: string;
      education?: string[];
      lookingFor?: string[];
      bodyTypes?: string[];
      heightMin?: string | number;
      heightMax?: string | number;
      minAge?: number;
      maxAge?: number;
      maxDistance?: number;
      minReliability?: number;
      page?: number;
      limit?: number;
    }) => {
      const qs = new URLSearchParams();
      if (params?.category) qs.set('category', params.category);
      if (params?.search) qs.set('search', params.search);
      if (params?.location) qs.set('location', params.location);
      if (params?.isIdVerified) qs.set('isIdVerified', 'true');
      if (params?.isSelfieVerified) qs.set('isSelfieVerified', 'true');
      if (params?.smoking) qs.set('smoking', params.smoking);
      if (params?.drinking) qs.set('drinking', params.drinking);
      if (params?.children) qs.set('children', params.children);
      if (params?.education && params.education.length > 0) {
        qs.set('education', params.education.join(','));
      }
      if (params?.lookingFor && params.lookingFor.length > 0) {
        qs.set('lookingFor', params.lookingFor.join(','));
      }
      if (params?.bodyTypes && params.bodyTypes.length > 0) {
        qs.set('bodyTypes', params.bodyTypes.join(','));
      }
      if (params?.heightMin != null && params.heightMin !== '') {
        qs.set('heightMin', String(params.heightMin));
      }
      if (params?.heightMax != null && params.heightMax !== '') {
        qs.set('heightMax', String(params.heightMax));
      }
      if (params?.minAge != null) qs.set('minAge', String(params.minAge));
      if (params?.maxAge != null) qs.set('maxAge', String(params.maxAge));
      if (params?.maxDistance != null) qs.set('maxDistance', String(params.maxDistance));
      if (params?.minReliability != null) qs.set('minReliability', String(params.minReliability));
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      const query = qs.toString();
      return apiRequest(`/discover${query ? `?${query}` : ''}`);
    },
  },

  offers: {
    create: (payload: {
      guestId: string;
      activityType: string;
      venueName: string;
      venueAddress?: string;
      proposedDateTime?: string;
      personalMessage?: string;
      hospitalityGuarantee?: string;
    }) => apiRequest('/offers', { method: 'POST', body: JSON.stringify(payload) }),

    getAll: () => apiRequest('/offers'),

    ask: (payload: {
      plan: string;
      time?: string;
      location?: string;
      note?: string;
      giftAmount?: number;
      targetHostId?: string;
    }) => apiRequest('/offers/ask', { method: 'POST', body: JSON.stringify(payload) }),

    respond: (
      id: string,
      payload: {
        action: 'ACCEPT' | 'COUNTER' | 'PASS';
        counterNote?: string;
        counterVenue?: string;
        counterTime?: string;
      }
    ) => apiRequest(`/offers/${id}/respond`, { method: 'POST', body: JSON.stringify(payload) }),

    hostRespond: (id: string, action: 'ACCEPT' | 'DECLINE') =>
      apiRequest(`/offers/${id}/host-respond`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      }),

    withdraw: (id: string) => apiRequest(`/offers/${id}/withdraw`, { method: 'POST' }),

    checkin: (id: string) => apiRequest(`/offers/${id}/checkin`, { method: 'POST' }),

    review: (id: string, payload: { rating: number; feedback?: string }) =>
      apiRequest(`/offers/${id}/review`, { method: 'POST', body: JSON.stringify(payload) }),
  },

  messages: {
    getConversations: () => apiRequest('/messages/conversations'),
    getMessages: (offerId: string) => apiRequest(`/messages/${offerId}`),
    sendMessage: (offerId: string, content: string) =>
      apiRequest(`/messages/${offerId}`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
    flagMessage: (messageId: string, reason: string) =>
      apiRequest(`/messages/${messageId}/flag`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
    getCallToken: (offerId: string) =>
      apiRequest<{ token: string; roomName: string; serverUrl: string; participantName: string }>(
        '/messages/call-token',
        {
          method: 'POST',
          body: JSON.stringify({ offerId }),
        }
      ),
  },

  upload: {
    uploadImage: (file: File, folder = 'profiles') => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      return apiRequest<{ url: string; publicId: string }>('/upload/image', {
        method: 'POST',
        body: formData,
      });
    },
  },

  billing: {
    getPlans: () => apiRequest('/billing/plans'),
    getStatus: () => apiRequest('/billing/status'),
    createCheckout: () => apiRequest('/billing/checkout', { method: 'POST' }),
    confirmSession: (sessionId: string) =>
      apiRequest('/billing/confirm-session', {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      }),
  },

  reports: {
    create: (payload: {
      reportedId: string;
      title: string;
      priority?: 'HIGH' | 'MEDIUM' | 'LOW';
      description: string;
    }) => apiRequest('/reports', { method: 'POST', body: JSON.stringify(payload) }),
  },

  venues: {
    getAll: () => apiRequest('/venues'),
  },

  content: {
    getTestimonials: () => apiRequest('/content/testimonials'),
    getFaqs: () => apiRequest('/content/faqs'),
  },
};
