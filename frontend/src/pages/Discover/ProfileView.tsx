import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ShieldCheck,
  Pencil,
  GraduationCap,
  Briefcase,
  Check,
  X,
  Plus,
  Loader2,
} from 'lucide-react';
import { ProfileReviewsView } from './ProfileReviewsView';
import { api } from '../../services/api';

const BODY_TYPES = [
  'Slender',
  'Athletic',
  'Average',
  'Curvy',
  'Muscular',
  'Full-figured',
  'A few extra pounds',
];

const LOOKING_FOR_OPTIONS = [
  'Dating',
  'Long-term',
  'Casual',
  'Friendship',
  'Discreet affair',
  'Mentorship',
];

const EDUCATION_OPTIONS = [
  'High school',
  'Some college',
  "Associate's degree",
  "Bachelor's degree",
  'Graduate degree',
  'Post-doctoral degree',
];

function formatInches(inches: number): string {
  const feet = Math.floor(inches / 12);
  const rem = inches % 12;
  return `${feet}'${String(rem).padStart(2, '0')}"`;
}

interface ProfileData {
  id: string;
  email: string;
  role: 'HOST' | 'GUEST' | 'ADMIN';
  nickname?: string;
  age?: number;
  locationCity?: string;
  isVerified: boolean;
  isIdVerified?: boolean;
  isSelfieVerified?: boolean;
  createdAt?: string;
  completedDatesCount?: number;
  activeEscrowCount?: number;
  profile?: {
    interests?: string[];
    inviteMeToEvents?: string[];
    lookingFor?: string[];
    heightInches?: number;
    height?: string;
    bodyType?: string;
    occupation?: string;
    education?: string;
    annualIncome?: string;
    netWorth?: string;
    smoking?: string;
    drinking?: string;
    children?: string;
    bio?: string;
    idealDate?: string;
    photos?: string[];
    reliabilityScore?: number;
  };
  subscription?: {
    plan: string;
    priceCents: number;
    status: string;
  } | null;
}

export function ProfileView() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editForm, setEditForm] = useState({
    nickname: '',
    age: 28,
    locationCity: '',
    occupation: '',
    education: "Bachelor's degree",
    smoking: 'No',
    drinking: 'Occasionally',
    children: 'No',
    heightInches: 68,
    bodyType: 'Athletic',
    lookingFor: ['Dating', 'Long-term'] as string[],
    bio: '',
    idealDate: '',
  });

  const [showReviews, setShowReviews] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#reviews' || window.location.hash === '#appeals';
    }
    return false;
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.profile.getMe();
      if (res.success && res.data) {
        const d: ProfileData = res.data;
        setProfileData(d);
        setEditForm({
          nickname: d.nickname || '',
          age: d.age ?? (d.role === 'HOST' ? 32 : 27),
          locationCity: d.locationCity || '',
          occupation: d.profile?.occupation || '',
          education: d.profile?.education || "Bachelor's degree",
          smoking: d.profile?.smoking || 'No',
          drinking: d.profile?.drinking || 'Occasionally',
          children: d.profile?.children || 'No',
          heightInches: d.profile?.heightInches ?? (d.role === 'HOST' ? 71 : 66),
          bodyType: d.profile?.bodyType || (d.role === 'HOST' ? 'Athletic' : 'Slender'),
          lookingFor:
            Array.isArray(d.profile?.lookingFor) && d.profile!.lookingFor!.length > 0
              ? d.profile!.lookingFor!
              : ['Dating', 'Long-term'],
          bio: d.profile?.bio || '',
          idealDate: d.profile?.idealDate || '',
        });
      }
    } catch (err: any) {
      showToast(err?.message || 'Unable to load profile.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash;
      setShowReviews(h === '#reviews' || h === '#appeals');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const openReviews = () => {
    setShowReviews(true);
    if (typeof window !== 'undefined' && window.location.hash !== '#reviews') {
      window.history.pushState({ view: 'reviews' }, '', '#reviews');
    }
  };

  const closeReviews = () => {
    setShowReviews(false);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab: 'profile' }, '', '#profile');
    }
    loadProfile();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.profile.updateMe(editForm);
      setIsEditOpen(false);
      showToast('Profile updated successfully!');
      await loadProfile();
    } catch (err: any) {
      showToast(err?.message || 'Unable to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddGalleryPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profileData) return;

    setIsUploadingPhoto(true);
    try {
      const uploadRes = await api.upload.uploadImage(file, 'profiles');
      if (uploadRes.success && uploadRes.data?.url) {
        const currentPhotos = profileData.profile?.photos || [];
        const updatedPhotos = [...currentPhotos, uploadRes.data.url].slice(0, 6);
        await api.profile.updateMe({ photos: updatedPhotos });
        showToast('Photo uploaded to Cloudinary and saved!');
        await loadProfile();
      }
    } catch (err: any) {
      showToast(err?.message || 'Photo upload failed.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (showReviews) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FAF7F2] sm:bg-[#EFE7DA]">
        <ProfileReviewsView onBack={closeReviews} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#6E6A63]">
        <Loader2 className="w-7 h-7 animate-spin text-[#9F1E19]" />
        <span className="text-xs font-medium">Loading your profile...</span>
      </div>
    );
  }

  const photos = profileData?.profile?.photos || [];
  const mainAvatar = photos[0] || '/assets/discover-card-1.jpg';
  const displayName =
    profileData?.nickname || profileData?.email?.split('@')[0] || 'Member';
  const displayAge = profileData?.age ?? (profileData?.role === 'HOST' ? 32 : 27);
  const reliability = profileData?.profile?.reliabilityScore ?? 5.0;
  const tags =
    profileData?.role === 'HOST'
      ? profileData?.profile?.interests || []
      : profileData?.profile?.inviteMeToEvents || [];
  const lookingForTags =
    Array.isArray(profileData?.profile?.lookingFor) && profileData!.profile!.lookingFor!.length > 0
      ? profileData!.profile!.lookingFor!
      : ['Dating', 'Long-term'];
  const heightDisplay =
    profileData?.profile?.height ||
    formatInches(profileData?.profile?.heightInches ?? (profileData?.role === 'HOST' ? 71 : 66));
  const bodyTypeDisplay =
    profileData?.profile?.bodyType || (profileData?.role === 'HOST' ? 'Athletic' : 'Slender');
  const memberSince = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recently joined';

  return (
    <div className="w-full mx-auto animate-in fade-in duration-200">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAddGalleryPhoto}
        className="hidden"
      />

      <div className="bg-transparent sm:bg-[#FAF7F2] sm:border sm:border-[#EADBCA] sm:rounded-[32px] p-0 sm:p-8 md:p-10 lg:p-12 sm:shadow-[0_10px_35px_rgba(22,18,15,0.03)]">
        {/* 1. AVATAR & NAME SECTION */}
        <div className="flex flex-col items-center text-center pt-2 sm:pt-0">
          <div className="relative inline-block">
            <img
              src={mainAvatar}
              alt={displayName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#EADBCA] shadow-2xs"
            />
            <div className="absolute -bottom-0.5 right-1 w-6 h-6 rounded-full bg-[#FCB943] border-2 border-[#FAF7F2] flex items-center justify-center text-xs shadow-xs select-none">
              👑
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3.5">
            <h1 className="font-serif font-bold text-2xl sm:text-[26px] text-[#16120F] tracking-tight">
              {displayName}, {displayAge}
            </h1>
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="w-7 h-7 rounded-full hover:bg-[#EADBCA]/40 flex items-center justify-center text-[#8A857D] hover:text-[#16120F] transition-colors cursor-pointer"
              title="Edit profile"
            >
              <Pencil className="w-4 h-4 text-[#8A857D]" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#8A857D] mt-1 font-medium flex-wrap justify-center">
            <button
              type="button"
              onClick={openReviews}
              className="text-[#8A857D] hover:text-[#9F1E19] hover:underline cursor-pointer transition-colors font-medium"
              title="View reviews and reliability"
            >
              {reliability.toFixed(2)} Reliability
            </button>
            <span>·</span>
            <span className="inline-flex items-center gap-0.5 text-[#3B82F6]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {profileData?.isIdVerified
                  ? 'ID & Selfie Verified'
                  : profileData?.isSelfieVerified
                  ? 'Selfie Verified'
                  : profileData?.isVerified
                  ? 'ID Verified'
                  : 'Verification Pending'}
              </span>
            </span>
          </div>
        </div>

        {/* 2. PROFILE GALLERY */}
        <div className="mt-7 sm:mt-9">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <span className="text-xs sm:text-[13px] font-bold text-[#16120F]">
              Profile Gallery ({photos.length} Of 6 Photos)
            </span>
            <button
              type="button"
              disabled={isUploadingPhoto || photos.length >= 6}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5F1E6] border border-[#EADBCA] hover:border-[#9F1E19] text-[11px] font-semibold text-[#16120F] transition-colors cursor-pointer disabled:opacity-50"
              title="Add photo"
            >
              {isUploadingPhoto ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9F1E19]" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-[#9F1E19]" />
              )}
              <span>{isUploadingPhoto ? 'Uploading...' : 'Add Photo'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto pb-1 no-scrollbar">
            {photos.length === 0 ? (
              <p className="text-xs text-[#6E6A63]">No gallery photos uploaded yet.</p>
            ) : (
              photos.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-[14px] sm:rounded-[16px] overflow-hidden border border-[#EADBCA] shadow-2xs shrink-0"
                >
                  <img
                    src={imgSrc}
                    alt={`Gallery photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. ATTRIBUTES ROW (8 cards matching Search Preference criteria) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mt-5 sm:mt-6">
          <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3 shadow-2xs">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">Height</div>
            <div className="text-xs font-semibold text-[#16120F] truncate">{heightDisplay}</div>
          </div>

          <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3 shadow-2xs">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">Body Type</div>
            <div className="text-xs font-semibold text-[#16120F] truncate">{bodyTypeDisplay}</div>
          </div>

          <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3 shadow-2xs">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">Children</div>
            <div className="text-xs font-semibold text-[#16120F] truncate">
              {profileData?.profile?.children || 'No'}
            </div>
          </div>

          <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3 shadow-2xs">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">Smoking</div>
            <div className="text-xs font-semibold text-[#16120F] truncate">
              {profileData?.profile?.smoking || 'No'}
            </div>
          </div>

          <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3 shadow-2xs">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">Drinking</div>
            <div className="text-xs font-semibold text-[#16120F] truncate">
              {profileData?.profile?.drinking || 'Occasionally'}
            </div>
          </div>

          <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3 shadow-2xs">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">Education</div>
            <div className="text-xs font-semibold text-[#16120F] flex items-center gap-1 truncate">
              <GraduationCap className="w-3.5 h-3.5 text-[#16120F] shrink-0" />
              <span className="truncate">{profileData?.profile?.education || 'Not set'}</span>
            </div>
          </div>

          <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3 shadow-2xs">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">Profession</div>
            <div className="text-xs font-semibold text-[#16120F] flex items-center gap-1 truncate">
              <Briefcase className="w-3.5 h-3.5 text-[#16120F] shrink-0" />
              <span className="truncate">{profileData?.profile?.occupation || 'Not set'}</span>
            </div>
          </div>

          <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[14px] sm:rounded-[16px] p-2.5 sm:p-3 shadow-2xs">
            <div className="text-[10px] text-[#8A857D] font-medium mb-0.5">City</div>
            <div className="text-xs font-semibold text-[#16120F] truncate">
              {profileData?.locationCity || 'New York, NY'}
            </div>
          </div>
        </div>

        {/* 4. LOOKING FOR */}
        <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4 sm:px-6 mt-3.5">
          <h3 className="font-semibold text-xs sm:text-[13px] text-[#16120F] mb-2">
            Looking For ({lookingForTags.length})
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-[#16120F] font-medium">
            {lookingForTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-[#FAF0F1] border border-[#F3C5C7] text-[#9F1E19]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 5. ENVISIONED IDEAL FIRST DATE */}
        <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4 sm:px-6 mt-3.5">
          <h3 className="font-semibold text-xs sm:text-[13px] text-[#16120F] mb-1">
            Envisioned Ideal First Date
          </h3>
          <p className="text-[11px] sm:text-xs text-[#6E6A63] leading-relaxed">
            {profileData?.profile?.idealDate ||
              'Add your ideal first date idea by editing your profile.'}
          </p>
        </div>

        {/* 6. BIO */}
        <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4 sm:px-6 mt-3.5">
          <h3 className="font-semibold text-xs sm:text-[13px] text-[#16120F] mb-1">
            Introduce Yourself To The Community
          </h3>
          <p className="text-[11px] sm:text-xs text-[#6E6A63] leading-relaxed">
            {profileData?.profile?.bio || 'Tell the community about your interests and style.'}
          </p>
        </div>

        {/* 7. INTERESTS / OUTINGS */}
        <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4 sm:px-6 mt-3.5">
          <h3 className="font-semibold text-xs sm:text-[13px] text-[#16120F] mb-2">
            {profileData?.role === 'HOST' ? 'What Are You Into?' : 'Invite Me To'} ({tags.length} Chosen)
          </h3>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] sm:text-xs text-[#4A453E] font-medium">
            {tags.length === 0 ? (
              <span className="text-[#8A857D]">No preferences added yet.</span>
            ) : (
              tags.map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#16120F] stroke-[2.5]" />
                  <span>{tag}</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* 8. MEMBERSHIP & STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-3.5">
          <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4">
            <div className="text-[10px] uppercase tracking-wider text-[#8A857D] font-medium mb-0.5">
              Membership Plan
            </div>
            <div className="font-serif font-bold text-xl text-[#16120F] leading-tight my-0.5">
              {profileData?.role === 'GUEST'
                ? 'Complimentary'
                : profileData?.subscription?.status === 'ACTIVE'
                ? 'Host Pro ($9.99/Mo)'
                : 'Inactive'}
            </div>
            <div className="text-[11px] font-semibold text-emerald-700">
              {profileData?.subscription?.status || 'ACTIVE'}
            </div>
          </div>

          <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4">
            <div className="text-[10px] uppercase tracking-wider text-[#8A857D] font-medium mb-0.5">
              Completed Dates
            </div>
            <div className="font-serif font-bold text-2xl text-[#16120F] leading-tight my-0.5">
              {profileData?.completedDatesCount ?? 0}
            </div>
            <div className="text-[11px] font-semibold text-emerald-700">
              {profileData?.activeEscrowCount ?? 0} active itinerary/offer(s)
            </div>
          </div>

          <div className="bg-[#FAF7F2] sm:bg-[#EFE7DA] border border-[#E4DAC8] rounded-[18px] sm:rounded-[22px] px-5 py-4">
            <div className="text-[10px] uppercase tracking-wider text-[#8A857D] font-medium mb-0.5">
              Member Since
            </div>
            <div className="font-serif font-bold text-xl text-[#16120F] leading-tight mt-1">
              {memberSince}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsEditOpen(false)}
        >
          <form
            onSubmit={handleSaveProfile}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#FAF7F2] border border-[#EADBCA] rounded-[28px] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-[#16120F]">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#EFE7DA] text-[#6E6A63]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#16120F] mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.nickname}
                  onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                  className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#16120F] mb-1">Age</label>
                <input
                  type="number"
                  min={18}
                  max={80}
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: Number(e.target.value) || 28 })}
                  className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#16120F] mb-1">City</label>
                <input
                  type="text"
                  value={editForm.locationCity}
                  onChange={(e) => setEditForm({ ...editForm, locationCity: e.target.value })}
                  className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#16120F] mb-1">Profession</label>
                <input
                  type="text"
                  value={editForm.occupation}
                  onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                  className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#16120F] mb-1">Education</label>
                <select
                  value={editForm.education}
                  onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                  className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F]"
                >
                  {EDUCATION_OPTIONS.map((ed) => (
                    <option key={ed} value={ed}>
                      {ed}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#16120F] mb-1">
                  Height ({formatInches(editForm.heightInches)})
                </label>
                <input
                  type="range"
                  min={58}
                  max={80}
                  value={editForm.heightInches}
                  onChange={(e) =>
                    setEditForm({ ...editForm, heightInches: Number(e.target.value) })
                  }
                  className="w-full accent-[#9F1E19] mt-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#16120F] mb-1">Body Type</label>
                <select
                  value={editForm.bodyType}
                  onChange={(e) => setEditForm({ ...editForm, bodyType: e.target.value })}
                  className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F]"
                >
                  {BODY_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#16120F] mb-1">Smoking</label>
                <select
                  value={editForm.smoking}
                  onChange={(e) => setEditForm({ ...editForm, smoking: e.target.value })}
                  className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3 py-2 text-xs text-[#16120F]"
                >
                  <option value="No">No</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#16120F] mb-1">Drinking</label>
                <select
                  value={editForm.drinking}
                  onChange={(e) => setEditForm({ ...editForm, drinking: e.target.value })}
                  className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3 py-2 text-xs text-[#16120F]"
                >
                  <option value="No">No</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#16120F] mb-1">Children</label>
                <select
                  value={editForm.children}
                  onChange={(e) => setEditForm({ ...editForm, children: e.target.value })}
                  className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3 py-2 text-xs text-[#16120F]"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#16120F] mb-1.5">
                Looking For
              </label>
              <div className="flex flex-wrap gap-2">
                {LOOKING_FOR_OPTIONS.map((opt) => {
                  const checked = editForm.lookingFor.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        const next = checked
                          ? editForm.lookingFor.filter((x) => x !== opt)
                          : [...editForm.lookingFor, opt];
                        setEditForm({ ...editForm, lookingFor: next });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        checked
                          ? 'bg-[#9F1E19] border-[#9F1E19] text-white'
                          : 'bg-white border-[#E5DDD0] text-[#16120F]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#16120F] mb-1">
                Envisioned Ideal First Date
              </label>
              <textarea
                rows={2}
                value={editForm.idealDate}
                onChange={(e) => setEditForm({ ...editForm, idealDate: e.target.value })}
                className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#16120F] mb-1">About You</label>
              <textarea
                rows={3}
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="w-full bg-white border border-[#E5DDD0] rounded-xl px-3.5 py-2 text-xs text-[#16120F]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 rounded-full bg-white border border-[#E5DDD0] text-xs font-semibold text-[#16120F]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-semibold disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#16120F] text-white text-xs px-5 py-3 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

export default ProfileView;
