import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const { key, op } = req.query;

    if (!key) {
      res.status(400).json({ error: 'missing key' });
      return;
    }

    const storeKey = `counter:${key}`;

    if (op === 'up') {
      const n = await kv.incr(storeKey);
      res.status(200).json({ count: n });
      return;
    }

    const n = (await kv.get(storeKey)) || 0;
    res.status(200).json({ count: n });

  } catch (e) {
    res.status(500).json({
      error: 'kv error',
      detail: String(e)
    });
  }
}
