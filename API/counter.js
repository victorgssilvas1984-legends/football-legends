import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    const { key, op } = req.query;

    if (!key) {
      return res.status(400).json({ error: "missing key" });
    }

    const storeKey = `counter:${key}`;

    if (op === "up") {
      const count = await redis.incr(storeKey);
      return res.status(200).json({ count });
    }

    const count = (await redis.get(storeKey)) || 0;
    return res.status(200).json({ count });

  } catch (e) {
    return res.status(500).json({
      error: "redis error",
      detail: String(e)
    });
  }
}
