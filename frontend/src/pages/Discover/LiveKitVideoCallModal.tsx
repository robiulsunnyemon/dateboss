import React, { useState } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoTrack,
  useTracks,
  useLocalParticipant,
  useConnectionState,
} from '@livekit/components-react';
import { Track, ConnectionState } from 'livekit-client';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

interface LiveKitVideoCallModalProps {
  serverUrl: string;
  token: string;
  partnerName: string;
  partnerAvatar?: string;
  isVideo: boolean;
  onEndCall: () => void;
}

function CallInterface({
  partnerName,
  partnerAvatar,
  isVideo,
  onEndCall,
}: {
  partnerName: string;
  partnerAvatar?: string;
  isVideo: boolean;
  onEndCall: () => void;
}) {
  const connectionState = useConnectionState();
  const { localParticipant } = useLocalParticipant();
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCamEnabled, setIsCamEnabled] = useState(isVideo);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get all camera video tracks
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const remoteVideoTrack = tracks.find(
    (t) => t.participant.identity !== localParticipant.identity && t.source === Track.Source.Camera
  );

  const localVideoTrack = tracks.find(
    (t) => t.participant.identity === localParticipant.identity && t.source === Track.Source.Camera
  );

  const toggleMic = async () => {
    const next = !isMicEnabled;
    setIsMicEnabled(next);
    await localParticipant.setMicrophoneEnabled(next);
  };

  const toggleCam = async () => {
    const next = !isCamEnabled;
    setIsCamEnabled(next);
    await localParticipant.setCameraEnabled(next);
  };

  const isConnected = connectionState === ConnectionState.Connected;

  return (
    <div
      className={`relative w-full ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none'
          : 'max-w-[760px] h-[85vh] max-h-[640px] rounded-[32px]'
      } bg-[#16120F] text-white overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10`}
    >
      {/* Header bar */}
      <div className="absolute top-0 inset-x-0 z-20 p-4 sm:p-5 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/30 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#9F1E19] flex items-center justify-center text-white font-bold text-sm shadow-md">
            {partnerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
              <span>{partnerName}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </h3>
            <span className="text-[11px] text-white/70 flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              {isConnected ? 'Private HD Live Stream' : 'Connecting stream...'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Video Stage */}
      <div className="relative flex-1 w-full h-full bg-[#120F0D] flex items-center justify-center overflow-hidden">
        {!isConnected ? (
          <div className="flex flex-col items-center gap-3 text-white/80">
            <Loader2 className="w-8 h-8 animate-spin text-[#9F1E19]" />
            <p className="text-xs font-medium">Securing private LiveKit channel...</p>
          </div>
        ) : remoteVideoTrack?.publication?.track ? (
          <div className="w-full h-full">
            <VideoTrack
              trackRef={remoteVideoTrack}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <img
              src={partnerAvatar || '/assets/discover-card-1.jpg'}
              alt={partnerName}
              className="w-24 h-24 rounded-full object-cover border-2 border-[#9F1E19] shadow-lg animate-pulse"
            />
            <div className="text-center">
              <p className="text-sm font-semibold">{partnerName}</p>
              <p className="text-xs text-white/60">Voice call active</p>
            </div>
          </div>
        )}

        {/* Local Picture-in-Picture Self Video */}
        {isCamEnabled && localVideoTrack?.publication?.track && (
          <div className="absolute bottom-20 right-4 z-20 w-28 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black">
            <VideoTrack
              trackRef={localVideoTrack}
              className="w-full h-full object-cover mirror"
            />
          </div>
        )}
      </div>

      {/* Control Action Bar */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-6 flex items-center justify-center gap-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        {/* Toggle Mic */}
        <button
          type="button"
          onClick={toggleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
            isMicEnabled
              ? 'bg-white/15 hover:bg-white/25 text-white'
              : 'bg-[#9F1E19] text-white ring-2 ring-red-400'
          }`}
          title={isMicEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* End Call Button */}
        <button
          type="button"
          onClick={onEndCall}
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-95 ring-4 ring-red-600/30"
          title="End Call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>

        {/* Toggle Camera */}
        <button
          type="button"
          onClick={toggleCam}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
            isCamEnabled
              ? 'bg-white/15 hover:bg-white/25 text-white'
              : 'bg-[#9F1E19] text-white ring-2 ring-red-400'
          }`}
          title={isCamEnabled ? 'Turn Off Video' : 'Turn On Video'}
        >
          {isCamEnabled ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>
      </div>

      {/* Plays remote audio */}
      <RoomAudioRenderer />
    </div>
  );
}

export function LiveKitVideoCallModal({
  serverUrl,
  token,
  partnerName,
  partnerAvatar,
  isVideo,
  onEndCall,
}: LiveKitVideoCallModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <LiveKitRoom
        serverUrl={serverUrl}
        token={token}
        connect={true}
        video={isVideo}
        audio={true}
        onDisconnected={onEndCall}
        className="w-full h-full sm:h-auto flex items-center justify-center"
      >
        <CallInterface
          partnerName={partnerName}
          partnerAvatar={partnerAvatar}
          isVideo={isVideo}
          onEndCall={onEndCall}
        />
      </LiveKitRoom>
    </div>
  );
}

export default LiveKitVideoCallModal;
