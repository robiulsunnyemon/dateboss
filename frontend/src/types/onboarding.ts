export type UserRole = 'host' | 'guest';

export type GenderIdentity = 'Men' | 'Women' | 'Everyone';

export type GenderPreference = 'Men' | 'Women' | 'Everyone';

export interface InterestCategory {
  title: string;
  items: string[];
}

export interface OnboardingState {
  role: UserRole;
  whoYouAre: GenderIdentity;
  whoToMeet: GenderPreference;
  selectedInterests: string[];
}
