import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Smile,
  X,
  Loader2,
  ShieldAlert,
  Ban,
  Sparkles,
  Camera,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api';

interface Step8PhotosProps {
  onBack: () => void;
  onContinue?: (photos: string[]) => void;
}

export function Step8Photos({ onBack, onContinue }: Step8PhotosProps) {
  const [photos, setPhotos] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSlotClick = (index: number) => {
    if (!photos[index] && uploadingSlot === null) {
      setActiveSlot(index);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeSlot === null) return;

    const slot = activeSlot;
    setActiveSlot(null);
    setUploadingSlot(slot);
    setUploadError(null);

    try {
      const res = await api.upload.uploadImage(file, 'profiles');
      if (res.success && res.data?.url) {
        setPhotos((prev) => {
          const updated = [...prev];
          updated[slot] = res.data!.url;
          return updated;
        });
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload image to Cloudinary');
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleRemovePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = [...photos];
    updated[index] = null;
    setPhotos(updated);
  };

  const uploadedCount = photos.filter(Boolean).length;

  const handleContinue = () => {
    const validPhotos = photos.filter((p): p is string => Boolean(p));
    if (validPhotos.length < 3) {
      setUploadError(`Please upload at least 3 photos to proceed (${validPhotos.length}/3 uploaded).`);
      return;
    }
    if (onContinue) {
      onContinue(validPhotos);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F1E6] sm:bg-[#EFE7DA] py-4 sm:py-6 lg:py-8 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F]">
      {/* Hidden file input for uploading */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Container: Edge-to-edge on mobile, centered card on desktop matching Figma */}
      <div className="w-full max-w-[720px] bg-[#F5F1E6] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-7 lg:p-9 shadow-none sm:shadow-[0_10px_40px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
        
        {/* Top Header: Dark Red Rounded Back Button + Official thedateboss Logo */}
        <div className="flex items-center gap-3 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl sm:rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            className="flex items-center shrink-0"
          >
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </a>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] tracking-tight leading-tight mt-5 sm:mt-6">
          Make Your Profile Shine!
        </h1>

        {/* Subtitles */}
        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-1 leading-relaxed">
          Add at least <span className="font-semibold text-[#16120F]">3 photos</span> to get started.
        </p>
        <p className="text-[#6E6A63] text-[11px] sm:text-xs font-normal mt-1.5 mb-4 leading-relaxed max-w-[580px]">
          Profiles with multiple photos attract more attention and messages! Upload up to 6 photos at a time. You can add up to 20 photos and videos to your profile in total.
        </p>

        {uploadError && (
          <div className="mb-4 p-3 rounded-xl bg-[#FBEFF0] border border-[#F3C5C7] text-xs text-[#9F1E19] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Photo Guidelines & Rules Card */}
        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-[#EDE7D9]/80 border border-[#DFCBB5] text-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-[#9F1E19] font-semibold text-xs sm:text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Photo Guidelines & Rules</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#6E6A63]">
              {uploadedCount >= 3 ? (
                <span className="flex items-center gap-1 text-[#2E7D32]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {uploadedCount}/3 uploaded
                </span>
              ) : (
                <span className="text-[#9F1E19]">
                  {uploadedCount}/3 uploaded (min. 3 required)
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] sm:text-xs text-[#4A443D]">
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1.5 rounded-lg border border-[#E4D7C5]">
              <Ban className="w-3.5 h-3.5 text-[#9F1E19] shrink-0" />
              <span>No Drugs</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1.5 rounded-lg border border-[#E4D7C5]">
              <Ban className="w-3.5 h-3.5 text-[#9F1E19] shrink-0" />
              <span>No Weapons</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1.5 rounded-lg border border-[#E4D7C5]">
              <Ban className="w-3.5 h-3.5 text-[#9F1E19] shrink-0" />
              <span>No Nudity</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1.5 rounded-lg border border-[#E4D7C5]">
              <Sparkles className="w-3.5 h-3.5 text-[#9F1E19] shrink-0" />
              <span>Minimal Filters</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1.5 rounded-lg border border-[#E4D7C5] col-span-2 sm:col-span-2">
              <Camera className="w-3.5 h-3.5 text-[#9F1E19] shrink-0" />
              <span>Only Recent Pictures</span>
            </div>
          </div>
        </div>

        {/* Photo Grid: 3-column layout where Slot 1 spans 2 cols & 2 rows */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[520px]">
          
          {/* Slot 0: Main Profile Photo (col-span-2 row-span-2) */}
          <div
            onClick={() => handleSlotClick(0)}
            className="col-span-2 row-span-2 relative aspect-[4/4.3] sm:aspect-square bg-[#F5F1E6] border border-[#9F1E19]/70 rounded-[20px] sm:rounded-[24px] overflow-hidden cursor-pointer group shadow-xs transition-all hover:border-[#9F1E19]"
          >
            {uploadingSlot === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#9F1E19]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-[11px] mt-2 text-[#6E6A63]">Uploading...</span>
              </div>
            ) : photos[0] ? (
              <>
                <img
                  src={photos[0]}
                  alt="Main profile"
                  className="w-full h-full object-cover"
                />
                
                {/* Main profile label pill */}
                <div className="absolute bottom-2.5 left-2.5 bg-[#9F1E19] text-white text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Smile className="w-3 h-3 text-white" />
                  <span>Main profile</span>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => handleRemovePhoto(0, e)}
                  className="absolute bottom-2.5 right-2.5 w-6 h-6 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-md"
                  aria-label="Remove photo"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#9F1E19] group-hover:scale-105 transition-transform p-4">
                <CameraPlusIcon className="w-8 h-8 sm:w-9 sm:h-9" />
                <span className="text-[10px] sm:text-[11px] font-normal mt-2 text-[#6E6A63]">Add main photo</span>
              </div>
            )}
          </div>

          {/* Slot 1: Top-Right */}
          <PhotoSlot
            index={1}
            photo={photos[1]}
            onClick={() => handleSlotClick(1)}
            onRemove={(e) => handleRemovePhoto(1, e)}
          />

          {/* Slot 2: Middle-Right */}
          <PhotoSlot
            index={2}
            photo={photos[2]}
            onClick={() => handleSlotClick(2)}
            onRemove={(e) => handleRemovePhoto(2, e)}
          />

          {/* Slot 3: Bottom-Left */}
          <PhotoSlot
            index={3}
            photo={photos[3]}
            onClick={() => handleSlotClick(3)}
            onRemove={(e) => handleRemovePhoto(3, e)}
          />

          {/* Slot 4: Bottom-Middle */}
          <PhotoSlot
            index={4}
            photo={photos[4]}
            onClick={() => handleSlotClick(4)}
            onRemove={(e) => handleRemovePhoto(4, e)}
          />

          {/* Slot 5: Bottom-Right */}
          <PhotoSlot
            index={5}
            photo={photos[5]}
            onClick={() => handleSlotClick(5)}
            onRemove={(e) => handleRemovePhoto(5, e)}
          />

        </div>

        {/* Footer Actions:
            Mobile: Full width Upload button on top, Back text below.
            Desktop: Back text on left, compact red Upload button on right. */}
        <div className="pt-6 sm:pt-7">
          {/* Desktop Layout: Back + Continue button side-by-side */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="text-[#6E6A63] hover:text-[#16120F] text-sm font-normal px-2 py-2 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              disabled={uploadedCount < 3 || uploadingSlot !== null}
              onClick={handleContinue}
              className={`font-medium text-xs sm:text-sm py-2.5 px-6 rounded-full shadow-sm transition-all active:scale-[0.99] flex items-center gap-2 ${
                uploadedCount < 3 || uploadingSlot !== null
                  ? 'bg-[#9F1E19]/50 text-white/80 cursor-not-allowed shadow-none'
                  : 'bg-[#9F1E19] hover:bg-[#851713] text-white cursor-pointer'
              }`}
            >
              {uploadingSlot !== null ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : uploadedCount < 3 ? (
                <span>Upload at least 3 photos ({uploadedCount}/3)</span>
              ) : (
                <span>Continue with {uploadedCount} photos</span>
              )}
            </button>
          </div>

          {/* Mobile Layout: Full width Upload button + Back link */}
          <div className="flex flex-col sm:hidden">
            <button
              type="button"
              disabled={uploadedCount < 3 || uploadingSlot !== null}
              onClick={handleContinue}
              className={`w-full font-medium text-xs sm:text-sm py-3.5 rounded-full shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
                uploadedCount < 3 || uploadingSlot !== null
                  ? 'bg-[#9F1E19]/50 text-white/80 cursor-not-allowed shadow-none'
                  : 'bg-[#9F1E19] hover:bg-[#851713] text-white cursor-pointer'
              }`}
            >
              {uploadingSlot !== null ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : uploadedCount < 3 ? (
                <span>Upload at least 3 photos ({uploadedCount}/3)</span>
              ) : (
                <span>Continue with {uploadedCount} photos</span>
              )}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-[#6E6A63] hover:text-[#16120F] text-sm font-normal py-3 text-center transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-component for individual smaller photo slots
function PhotoSlot({
  photo,
  onClick,
  onRemove,
}: {
  index: number;
  photo: string | null;
  onClick: () => void;
  onRemove: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      className="relative aspect-square bg-[#F5F1E6] border border-[#9F1E19]/50 rounded-[18px] sm:rounded-[22px] flex items-center justify-center cursor-pointer hover:border-[#9F1E19] transition-all overflow-hidden group shadow-xs"
    >
      {photo ? (
        <>
          <img src={photo} alt="Profile slot" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-md"
            aria-label="Remove photo"
          >
            <X className="w-3 h-3 stroke-[2.5]" />
          </button>
        </>
      ) : (
        <CameraPlusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#9F1E19] group-hover:scale-105 transition-transform" />
      )}
    </div>
  );
}

// Custom Camera Plus Icon matching the Figma screenshot
function CameraPlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Camera Body */}
      <path d="M14 4h-4L8 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-2-3z" />
      {/* Lens Circle */}
      <circle cx="12" cy="13" r="3.2" />
      {/* Plus at upper right */}
      <path d="M18 3.5v3M16.5 5h3" strokeWidth="2" />
    </svg>
  );
}
