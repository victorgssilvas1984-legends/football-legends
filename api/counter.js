import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.log('Redis Client Error', err));

export default async function handler(req, res) {
  try {
    if (!client.isOpen) {
      await client.connect();
    }

    const { key, op } = req.query;

    if (!key) {
      return res.status(400).json({ error: 'missing key' });
    }

    const storeKey = `counter:${key}`;

    if (op === 'up') {
      const n = await client.incr(storeKey);
      return res.status(200).json({ count: n });
    }

    const n = (await client.get(storeKey)) || 0;
    return res.status(200).json({ count: Number(n) });

  } catch (e) {
    return res.status(500).json({
      error: 'redis error',
      detail: String(e)
    });
  }
}
