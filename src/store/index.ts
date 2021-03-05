import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import Api from '@/classes/api';
import localforage from 'localforage';

Vue.use(Vuex);

const authModule: StoreOptions<any> = {
    state: {
        logged: false,
        userData: {},
    },
    mutations: {
        setLogged: (state, logged) => (state.logged = logged),
        setUserData: (state, data) => (state.userData = data),
    },
    actions: {
        setLogged: async ({ commit }) =>
            commit('setLogged', (await localforage.getItem('directus_access_token')) !== null),
        setUserData: ({ commit }, data) => commit('setUserData', data),
    },
};

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        auth: authModule,
    },
});
