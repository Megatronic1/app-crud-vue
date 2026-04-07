import { Redis } from '@upstash/redis'

// Inicialización con las variables específicas de REST
const redis = new Redis({
  url: 'https://desired-glider-82192.upstash.io',
  token: 'gQAAAAAAAUEQAAIncDJiNmE1N2RiMjVkMmQ0YThmOTFmOWMyZDBjOWUwNDQ5YXAyODIxOTI',
})

export default async function handler(req, res) {
  const id = req.query.id || req.body.id;

  try {
    if (req.method === 'GET') {
      const keys = await redis.keys('cliente:*');
      if (!keys || keys.length === 0) return res.status(200).json([]);

      // En Vercel, para evitar el error de retries, traemos los datos de forma secuencial
      const clientes = [];
      for (const key of keys) {
        const data = await redis.hgetall(key);
        if (data) {
          clientes.push({ id: key.split(':')[1], ...data });
        }
      }
      return res.status(200).json(clientes);
    }

    if (req.method === 'POST') {
      const nuevoId = Math.random().toString(36).substring(2, 11);
      await redis.hset(`cliente:${nuevoId}`, req.body);
      return res.status(201).json({ id: nuevoId, ...req.body });
    }

    if (req.method === 'DELETE') {
      await redis.del(`cliente:${id}`);
      return res.status(200).json({ message: 'Eliminado' });
    }

    return res.status(405).end();
  } catch (error) {
    console.error("Error en Upstash:", error.message);
    return res.status(500).json({ error: error.message });
  }
}