import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://desired-glider-82192.upstash.io',
  token: 'gQAAAAAAAUEQAAIncDJiNmE1N2RiMjVkMmQ0YThmOTFmOWMyZDBjOWUwNDQ5YXAyODIxOTI',
})

export default async function (req, res) {
  // Configuración de Headers para evitar bloqueos de CORS en el navegador
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejo de la petición preflight de CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Captura de ID flexible: Query string (?id=...), Body, o URL cruda
  const id = req.query.id || req.body?.id;

  try {
    // GET: Obtener todos los clientes o uno específico
    if (req.method === 'GET') {
      if (id) {
        const cliente = await redis.hgetall(`cliente:${id}`);
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        return res.status(200).json({ id, ...cliente });
      }

      const keys = await redis.keys('cliente:*');
      if (!keys || keys.length === 0) {
        return res.status(200).json([]);
      }

      const clientes = [];
      // Bucle for...of para evitar errores de "Too Many Requests" (429) en Upstash
      for (const key of keys) {
        const data = await redis.hgetall(key);
        if (data) {
          clientes.push({ 
            id: key.split(':')[1], 
            ...data,
            // Normalización del estado para asegurar que Vue lo reciba como booleano
            estado: data.estado === 'true' || data.estado === true || data.estado === 1 || data.estado === "1"
          });
        }
      }
      return res.status(200).json(clientes);
    }

    // POST: Crear un nuevo cliente
    if (req.method === 'POST') {
      const nuevoId = Math.random().toString(36).substring(2, 11);
      await redis.hset(`cliente:${nuevoId}`, req.body);
      return res.status(201).json({ id: nuevoId, ...req.body });
    }

    // PUT o PATCH: Actualizar datos o cambiar estado
    if (req.method === 'PUT' || req.method === 'PATCH') {
      if (!id) {
        return res.status(400).json({ error: 'ID requerido para actualizar' });
      }
      // Extraemos el ID del body para evitar guardarlo dentro del hash de Redis
      const { id: bodyId, ...datosAActualizar } = req.body;
      await redis.hset(`cliente:${id}`, datosAActualizar);
      return res.status(200).json({ id, ...datosAActualizar });
    }

    // DELETE: Eliminar un cliente
    if (req.method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ error: 'ID requerido para eliminar' });
      }
      await redis.del(`cliente:${id}`);
      return res.status(200).json({ message: 'Cliente eliminado correctamente', id });
    }

    // Si no coincide con ningún método
    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error("Error en el servidor:", error.message);
    return res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
}