const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json') // Asegúrate que tu archivo se llame así
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.rewriter({
    '/api/*': '/$1'
}))
server.use(router)

module.exports = server