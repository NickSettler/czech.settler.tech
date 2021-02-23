import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import Api from '@/classes/api';

Vue.use(Vuex);

const authModule: StoreOptions<any> = {
    state: {
        logged: Api.getInstance().auth.token !== null,
        userData: {},
    },
    mutations: {
        setLogged: (state, logged) => (state.logged = logged),
        setUserData: (state, data) => (state.userData = data),
    },
    actions: {
        setLogged: ({ commit }) => commit('setLogged', Api.getInstance().auth.token !== null),
        setUserData: async ({ commit }) => commit('setUserData', (await Api.getInstance().users.me.read()).data),
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
