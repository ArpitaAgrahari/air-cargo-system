import { Redis } from 'ioredis';
import Redlock from 'redlock';
import { config } from 'dotenv';

config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = new Redis(REDIS_URL);

const redlock = new Redlock(
  [redisClient],
  {
    driftFactor: 0.01, // The drift factor is 0.01 (meaning 1%)
    retryCount: 10,    // 10 retries to acquire the lock
    retryDelay: 200,   // Wait 200ms between retries
    retryJitter: 50,   // Add up to 50ms jitter to retry delay
  }
);

redlock.on('clientError', (err) => {
  console.error('Redlock client error:', err);
});

export { redisClient, redlock };