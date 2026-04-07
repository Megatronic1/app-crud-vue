import api from '../lib/axios'

export default {
    // Obtener todos (la respuesta ahora trae { clientes: [...] })
    obtenerClientes() {
        return api.get('/clientes')
    },
    // Agregar nuevo
    agregarCliente(data) {
        return api.post('/clientes', data)
    },
    // Obtener uno solo por ID
    obtenerCliente(id) {
        return api.get(`/clientes?id=${id}`)
    },
    // Actualizar (usamos PUT porque así lo configuramos en el switch)
    actualizarCliente(id, data) {
        return api.put(`/clientes?id=${id}`, data)
    },
    // Cambiar estado (reutiliza la lógica de actualizar)
    cambiarEstado(id, data) {
        return api.put(`/clientes?id=${id}`, data)
    },
    // Eliminar
    eliminarCliente(id) {
        return api.delete(`/clientes?id=${id}`)
    }
}