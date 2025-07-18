import { createApp } from 'vue'
import './style.css'
import router from './router/router'
import App from './App.vue'
import bus from './utils/bus'
import './theme/index.scss'
import store from './store/index'

createApp(App).use(router).use(store).mount('#app')

/* InitMessage(bus) */
