import axios from 'axios'

// Si estamos en desarrollo (npm run dev), usamos la URL de localhost que levanta Vercel
// Si estamos en producción, simplemente usamos la ruta relativa
const urlBase = import.meta.env.DEV 
    ? 'http://localhost:3000/api' 
    : '/api'

const api = axios.create({
    baseURL: urlBase
})

export default api