import cron from 'node-cron';
import { expireStaleOffers } from './offers.controller';

export function startOfferExpiryJob(): void {
  // Run every 15 minutes to expire pending offers older than 48 hours
  cron.schedule('*/15 * * * *', async () => {
    try {
      const count = await expireStaleOffers();
      if (count > 0) {
        console.log(`[Cron] Expired ${count} pending date offer(s) past 48h window.`);
      }
    } catch (err) {
      console.error('[Cron] Failed to expire stale offers:', err);
    }
  });
}
