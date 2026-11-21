import { AccessToken } from 'livekit-server-sdk';

export const isLiveKitConfigured = (): boolean => {
  return Boolean(process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET && process.env.LIVEKIT_URL);
};

export const getLiveKitServerUrl = (): string => {
  return process.env.LIVEKIT_URL || 'wss://tapeit-vhdb9won.livekit.cloud';
};

export const createLiveKitToken = async (
  roomName: string,
  participantIdentity: string,
  participantName: string
): Promise<string> => {
  const apiKey = process.env.LIVEKIT_API_KEY || 'APIxGwctBUzQN9S';
  const apiSecret =
    process.env.LIVEKIT_API_SECRET || 'kv8RceaNav5xa1xeWqTNGYMLK7vdYirZytKi0VVKKs5';

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
