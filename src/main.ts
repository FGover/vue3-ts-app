import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/index'

// 在scss之前引入，后面覆盖
import 'vant/lib/index.css'
import './styles/main.scss'

// 全局注册svg组件
import 'virtual:svg-icons-register'

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
