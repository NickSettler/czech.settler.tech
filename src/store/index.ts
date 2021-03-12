import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import localforage from 'localforage';
import { listsModule } from '@/store/lists.module';

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
        lists: listsModule,
    },
});
