// Contador público de entradas/partidas — opção robusta e 100% sua.
// Requer o addon "Vercel KV" (grátis no plano Hobby): no dashboard do Vercel,
// vá em Storage -> Create Database -> KV, e conecte ao projeto.
// Isso injeta automaticamente as env vars que o pacote @vercel/kv usa.
//
// Instalação: rode "npm install @vercel/kv" na raiz do projeto antes do deploy
// (crie um package.json simples se ainda não tiver um).

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
    res.status(500).json({ error: 'kv error', detail: String(e) });
  }
}

