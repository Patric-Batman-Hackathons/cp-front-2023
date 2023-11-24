//// VUE ////
import { createApp } from 'vue'
import App from './App.vue'

//// VUE ROUTER ////
import router from './router'

//// AXIOS ////
import axios from 'axios'
import VueAxios from 'vue-axios'

//// ELEMENT PLUS ////
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

//// TAILWIND CSS ////
import './index.css'

// COMPONENTS //
import GalleryModal from "./components/GalleryModal.vue";

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)

app.component('GalleryModal', GalleryModal);

app.mount('#app')
