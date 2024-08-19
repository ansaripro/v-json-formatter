import { createApp } from 'vue'
import './plugin/style.css'
import App from './App.vue'
import VJsonFormatterPlugin from './plugin/index';

const app = createApp(App);

app.use(VJsonFormatterPlugin);

app.mount('#app');
