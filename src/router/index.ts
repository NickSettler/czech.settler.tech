import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
    },
    {
        path: '/lists',
        name: 'Lists',
        component: () => import(/* webpackChunkName: "lists" */ '../views/Lists.vue')
    },
    {
        path: '/list/:id',
        name: 'List :id',
        component: () => import(/* webpackChunkName: "list" */ '../views/List.vue')
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
