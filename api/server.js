import jsonServer from 'json-server';
import path from 'path';

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
// Usamos una ruta relativa simple que Vercel entiende al empaquetar la función
const router = jsonServer.router(path.join(process.cwd(), 'api', 'db.json'));

server.use(middlewares);
server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}));
server.use(router);

export default server;