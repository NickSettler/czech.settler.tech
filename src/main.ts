import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueGtag from 'vue-gtag';

Vue.config.productionTip = false;

Vue.use(
    VueGtag,
    {
        config: { id: 'G-FT153D4QDG' },
        pageTrackerScreenviewEnabled: true,
        pageTrackerEnabled: true,
    },
    router,
);

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount('#app');
