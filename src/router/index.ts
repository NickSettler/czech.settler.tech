import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Api from '@/classes/api';
import store from '@/store';
import localforage from 'localforage';

Vue.use(VueRouter);

type RouteMeta = {
    isAuthorized?: boolean;
    isAdmin?: boolean;
};

type CustomRoute = RouteConfig & {
    meta?: RouteMeta;
};

const routes: Array<CustomRoute> = [
    {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    },
    {
        path: '/lists',
        name: 'Lists',
        component: () => import(/* webpackChunkName: "lists" */ '../views/Lists.vue'),
    },
    {
        path: '/list/:id',
        name: 'List :id',
        component: () => import(/* webpackChunkName: "list" */ '../views/List.vue'),
    },
    {
        path: '/notes',
        name: 'Notes',
        component: () => import(/* webpackChunkName: "list" */ '../views/Notes.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (Api.getInstance().auth.token === null && (await localforage.getItem('directus_access_token')) !== null) {
        store.dispatch('setLogged').then(next);
    } else {
        next();
    }
});

export default router;
