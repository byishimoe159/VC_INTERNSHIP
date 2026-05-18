import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Import Vuex store

createApp(App).use(store).mount('#app');
