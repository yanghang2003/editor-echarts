import { createApp } from 'vue'
import './style.css'
import router from './router/router'
import App from './App.vue'
import './theme/index.scss'
import store from './store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css';

createApp(App).use(router).use(store).use(ElementPlus).mount('#app')


