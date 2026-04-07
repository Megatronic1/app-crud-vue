import Redis from 'ioredis';

export default async function handler(req, res) {
  try {
    const redis = new Redis(process.env.REDIS_URL, {
      tls: { rejectUnauthorized: false },
      connectTimeout: 5000,
    });

    const pong = await redis.ping();
    return res.status(200).json({ pong });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}