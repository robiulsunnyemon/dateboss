export type OfferStatus = 'pending' | 'accepted' | 'countered' | 'passed' | 'completed' | 'expired';

export interface DateOffer {
  id: string;
  senderName: string;
  senderAvatar: string;
  recipientName: string;
  recipientAvatar: string;
  title: string;
  activityType: 'Dinner' | 'Drinks' | 'Coffee' | 'Exhibition' | 'Concert' | 'Activity';
  venueName: string;
  venueAddress: string;
  dateTime: string;
  budgetSplit: 'sender_pays' | 'recipient_pays' | 'split_50_50' | 'custom';
  estimatedCost: string;
  customNote?: string;
  status: OfferStatus;
  counterProposal?: {
    suggestedTime?: string;
    suggestedVenue?: string;
    note?: string;
  };
  expiresAt: string;
  isConfirmedDayBefore: boolean;
  createdAt: string;
}

export interface Venue {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  city: string;
  priceRange: '$$' | '$$$' | '$$$$';
  rating: number;
  imageUrl: string;
  isVerifiedPublic: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  avatar: string;
  rating: number;
  dateType: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface DashboardMetric {
  totalOffers: number;
  activeOffers: number;
  acceptedRate: number;
  antiGhostingCompletionRate: number;
  avgResponseHours: number;
  verifiedVenuesCount: number;
  weeklyRevenue: number;
}
