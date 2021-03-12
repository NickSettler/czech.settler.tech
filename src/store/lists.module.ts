import { StoreOptions } from 'vuex';

export const listsModule: StoreOptions<any> = {
    state: {
        listSort: localStorage.getItem('listsSort') || 'Date Created',
    },
    mutations: {
        setListSort: (state, sort) => (state.listSort = sort),
    },
    actions: {
        setListSort: ({ commit }, data) => {
            localStorage.setItem('listsSort', data);
            commit('setListSort', data);
        },
    },
};
