import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  SwitchCamera,
  AlertCircle,
} from 'lucide-react';
import { getSocket } from '../../services/socket';

interface WebRTCVideoCallModalProps {
  offerId: string;
  partnerName: string;
  partnerAvatar?: string;
  targetUserId?: string;
  isVideo: boolean;
  isInitiator: boolean;
  initialSdp?: any;
  onEndCall: () => void;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export function WebRTCVideoCallModal({
  offerId,
  partnerName,
  partnerAvatar,
  targetUserId,
  isVideo,
  isInitiator,
  initialSdp,
  onEndCall,
}: WebRTCVideoCallModalProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCamEnabled, setIsCamEnabled] = useState(isVideo);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callStatus, setCallStatus] = useState<string>(
    isInitiator ? `Calling ${partnerName}...` : `Connecting with ${partnerName}...`
  );
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Cleanly terminate and stop hardware camera/mic tracks
  const handleEnd = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    const socket = getSocket();
    socket?.emit('call_ended', { offerId, targetUserId });
    onEndCall();
  }, [offerId, targetUserId, onEndCall]);

  useEffect(() => {
    let isMounted = true;
    const socket = getSocket();

    async function initWebRTC() {
      try {
        setCallStatus('Accessing camera and microphone...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideo ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false,
          audio: true,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;

        // Add local tracks to WebRTC
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Remote track received
        pc.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            setRemoteStream(event.streams[0]);
            setIsConnected(true);
            setCallStatus('Call connected · HD Live Audio & Video');
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
            }
          }
        };

        // ICE candidate generation
        pc.onicecandidate = (event) => {
          if (event.candidate && socket) {
            socket.emit('webrtc_signal', {
              offerId,
              targetUserId,
              signal: { type: 'candidate', candidate: event.candidate },
            });
          }
        };

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'connected') {
            setIsConnected(true);
            setCallStatus('Call connected · HD Live Audio & Video');
          } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            setIsConnected(false);
            setCallStatus('Connection lost. Reconnecting...');
          }
        };

        // If CALLER: create and send initial WebRTC Offer
        if (isInitiator) {
          setCallStatus(`Calling ${partnerName}...`);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          socket?.emit('call_user', {
            offerId,
            isVideo,
            sdp: offer,
          });
        }
        // If RECEIVER: answer with initialSdp
        else if (initialSdp) {
          await pc.setRemoteDescription(new RTCSessionDescription(initialSdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          socket?.emit('call_accepted', {
            offerId,
            callerId: targetUserId,
            sdp: answer,
          });
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Media devices error:', err);
          setErrorMessage(
            err.name === 'NotAllowedError'
              ? 'Camera/microphone access was denied. Please allow device permissions in your browser.'
              : err.message || 'Could not access camera or microphone.'
          );
        }
      }
    }

    initWebRTC();

    // Socket signaling listeners
    if (socket) {
      // Caller receives Answer from receiver
      const handleCallConnected = async (payload: { sdp?: any }) => {
        if (payload?.sdp && peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.sdp));
            setIsConnected(true);
            setCallStatus('Call connected · HD Live Audio & Video');
          } catch (e) {
            console.error('Error setting remote description:', e);
          }
        }
      };

      // Handle ICE Candidates exchange
      const handleWebRTCSignal = async (payload: { signal: any }) => {
        if (!peerConnectionRef.current || !payload?.signal) return;
        try {
          if (payload.signal.type === 'candidate' && payload.signal.candidate) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.signal.candidate));
          } else if (payload.signal.type === 'offer') {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.signal));
            const ans = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(ans);
            socket.emit('webrtc_signal', {
              offerId,
              targetUserId,
              signal: ans,
            });
          } else if (payload.signal.type === 'answer') {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.signal));
          }
        } catch (e) {
          console.error('Error handling WebRTC signal:', e);
        }
      };

      const handleCallTerminated = () => {
        handleEnd();
      };

      socket.on('call_connected', handleCallConnected);
      socket.on('webrtc_signal', handleWebRTCSignal);
      socket.on('call_terminated', handleCallTerminated);

      return () => {
        isMounted = false;
        socket.off('call_connected', handleCallConnected);
        socket.off('webrtc_signal', handleWebRTCSignal);
        socket.off('call_terminated', handleCallTerminated);
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((t) => t.stop());
        }
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
        }
      };
    }

    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [offerId, targetUserId, isVideo, isInitiator, initialSdp, partnerName, handleEnd]);

  // Toggle Microphone
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicEnabled(audioTrack.enabled);
      }
    }
  };

  // Toggle Camera
  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamEnabled(videoTrack.enabled);
      }
    }
  };

  // Flip Camera (Mobile rear/front)
  const flipCamera = async () => {
    if (!localStreamRef.current) return;
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextMode },
        audio: isMicEnabled,
      });

      const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
      const newVideoTrack = newStream.getVideoTracks()[0];

      if (peerConnectionRef.current && oldVideoTrack && newVideoTrack) {
        const sender = peerConnectionRef.current.getSenders().find((s) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(newVideoTrack);
        }
      }

      oldVideoTrack?.stop();
      localStreamRef.current.removeTrack(oldVideoTrack);
      localStreamRef.current.addTrack(newVideoTrack);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setFacingMode(nextMode);
    } catch (e) {
      console.warn('Could not flip camera:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`relative w-full ${
          isFullscreen
            ? 'fixed inset-0 z-50 rounded-none'
            : 'max-w-[760px] h-[90vh] max-h-[640px] rounded-[32px]'
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
              <span className="text-[11px] text-white/70 flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'
                  }`}
                />
                <span>{callStatus}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={flipCamera}
              className="sm:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Flip camera"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Main Video Stage */}
        <div className="relative flex-1 w-full h-full bg-[#120F0D] flex items-center justify-center overflow-hidden">
          {errorMessage ? (
            <div className="p-6 text-center max-w-sm space-y-3">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <p className="text-xs text-white/90 leading-relaxed">{errorMessage}</p>
              <button
                type="button"
                onClick={handleEnd}
                className="bg-[#9F1E19] text-white text-xs px-5 py-2 rounded-full font-semibold cursor-pointer"
              >
                Close Call
              </button>
            </div>
          ) : isConnected && remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-center p-6">
              <div className="relative">
                <img
                  src={partnerAvatar || '/assets/discover-card-1.jpg'}
                  alt={partnerName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#9F1E19] shadow-xl animate-pulse"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#16120F]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-lg text-white">{partnerName}</h4>
                <p className="text-xs text-white/60">
                  {isInitiator ? 'Ringing... Waiting for partner to connect' : 'Connecting stream...'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>P2P Direct Encrypted HD Channel</span>
              </div>
            </div>
          )}

          {/* Local Camera Picture-in-Picture (PiP) */}
          {isCamEnabled && (
            <div className="absolute bottom-24 sm:bottom-20 right-4 z-30 w-28 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="absolute bottom-0 inset-x-0 z-30 p-4 sm:p-6 flex items-center justify-center gap-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          {/* Mute Mic */}
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

          {/* End Call */}
          <button
            type="button"
            onClick={handleEnd}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-95 ring-4 ring-red-600/30"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Mute Video */}
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
      </div>
    </div>
  );
}

export default WebRTCVideoCallModal;
