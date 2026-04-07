import axios from 'axios'

// Al usar solo '/api', evitamos problemas de CORS en local
// y aseguramos que funcione al desplegar en Vercel.
const api = axios.create({
    baseURL: '/api'
})

export default api