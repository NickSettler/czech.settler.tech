import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueAnalytics from 'vue-analytics';

Vue.config.productionTip = false;

Vue.use(VueAnalytics, {
    id: 'G-3B36KPSQ5F',
});

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount('#app');
