import { AccessToken } from 'livekit-server-sdk';

export const isLiveKitConfigured = (): boolean => {
  return Boolean(process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET && process.env.LIVEKIT_URL);
};

export const getLiveKitServerUrl = (): string => {
  return process.env.LIVEKIT_URL || 'wss://thedateboss-demo.livekit.cloud';
};

export const createLiveKitToken = async (
  roomName: string,
  participantIdentity: string,
  participantName: string
): Promise<string> => {
  const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
  const apiSecret =
    process.env.LIVEKIT_API_SECRET || 'secret_key_dateboss_livekit_development_32chars';

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
    name: participantName,
    ttl: '2h',
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  return await at.toJwt();
};
