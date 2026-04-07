import Redis from 'ioredis';

// Configuración de conexión compatible con Vercel y Redis Labs (TLS Gratuito)
const redis = new Redis(process.env.REDIS_URL, {
  tls: {
    // Esto permite la conexión segura que exige la nube sin pagar extras
    rejectUnauthorized: false 
  },
  connectTimeout: 10000, // 10 segundos de espera antes de dar error
});

export default async function handler(req, res) {
  // Manejo de errores global para que Vercel te diga qué pasa exactamente
  try {
    if (req.method === 'GET') {
      const keys = await redis.keys('cliente:*');
      if (keys.length === 0) return res.status(200).json([]);

      const clientes = await Promise.all(
        keys.map(async (key) => {
          const data = await redis.hgetall(key);
          return { id: key.split(':')[1], ...data };
        })
      );
      return res.status(200).json(clientes);
    }

    if (req.method === 'POST') {
      const id = Date.now().toString();
      await redis.hset(`cliente:${id}`, req.body);
      return res.status(201).json({ id, ...req.body });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await redis.del(`cliente:${id}`);
      return res.status(200).json({ message: 'Cliente eliminado' });
    }

    // Si el método no es ninguno de los anteriores
    return res.status(405).json({ message: 'Método no permitido' });

  } catch (error) {
    console.error("Error en la API de Redis:", error);
    return res.status(500).json({ 
      error: 'Error de conexión con la base de datos',
      details: error.message 
    });
  }
}