import axios from 'axios'

// Preguntamos: ¿Estamos en Vercel? 
// (Vite pone 'production' automáticamente cuando subes el sitio)
const urlBase = process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:4000'

const api = axios.create({
    baseURL: urlBase
})

export default api