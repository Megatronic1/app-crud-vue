import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL || 'https://desired-glider-82192.upstash.io',
  token: process.env.KV_REST_API_TOKEN || 'gQAAAAAAAUEQAAIncDJiNmE1N2RiMjVkMmQ0YThmOTFmOWMyZDBjOWUwNDQ5YXAyODIxOTI',
})

export default async function handler(req, res) {
  const id = req.query.id || req.body.id;

  try {
    // GET: Obtener todos o uno
    if (req.method === 'GET') {
      if (id) {
        const cliente = await redis.hgetall(`cliente:${id}`);
        return cliente ? res.status(200).json({ id, ...cliente }) : res.status(404).json({ error: 'No encontrado' });
      }
      const keys = await redis.keys('cliente:*');
      const clientes = [];
      for (const key of keys) {
        const data = await redis.hgetall(key);
        if (data) clientes.push({ id: key.split(':')[1], ...data });
      }
      return res.status(200).json(clientes);
    }

    // POST: Crear
    if (req.method === 'POST') {
      const nuevoId = Math.random().toString(36).substring(2, 11);
      await redis.hset(`cliente:${nuevoId}`, req.body);
      return res.status(201).json({ id: nuevoId, ...req.body });
    }

    // PUT o PATCH: Actualizar (Esto es lo que faltaba)
    if (req.method === 'PUT' || req.method === 'PATCH') {
      if (!id) return res.status(400).json({ error: 'ID requerido' });
      await redis.hset(`cliente:${id}`, req.body);
      return res.status(200).json({ id, ...req.body });
    }

    // DELETE: Eliminar
    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'ID requerido' });
      await redis.del(`cliente:${id}`);
      return res.status(200).json({ message: 'Eliminado' });
    }

    return res.status(405).end();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}