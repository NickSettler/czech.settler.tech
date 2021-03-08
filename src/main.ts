import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueGtag from 'vue-gtag';
import Meta from 'vue-meta';

Vue.config.productionTip = false;

Vue.use(
    VueGtag,
    {
        config: { id: 'G-FT153D4QDG' },
        appName: 'czech.settler.tech',
        pageTrackerScreenviewEnabled: true,
        pageTrackerEnabled: true,
    },
    router,
);

Vue.use(Meta);

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount('#app');
