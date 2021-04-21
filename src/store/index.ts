import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { listsModule } from '@/store/lists.module';
import { AUTH_TOKEN_KEYS } from '@/classes/auth';

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
        setLogged: async ({ commit }) => commit('setLogged', localStorage.getItem(AUTH_TOKEN_KEYS.TOKEN) !== null),
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
