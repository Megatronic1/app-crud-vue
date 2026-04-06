import './assets/main.css'
import config from '../formkit.config'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {plugin,defaultConfig} from '@formkit/vue'
const app = createApp(App)

app.use(router)
app.use(plugin,defaultConfig(config))
app.mount('#app')
