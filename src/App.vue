<template>
    <v-app id="inspire">
        <v-app-bar app color="white" flat extended>
            <v-container class="py-0 fill-height">
                <v-avatar class="mr-10" color="grey darken-1" size="32"></v-avatar>

                <v-spacer></v-spacer>

                <v-responsive max-width="260" class="mr-6" v-if="!$vuetify.breakpoint.xs">
                    <v-text-field dense flat hide-details rounded solo-inverted></v-text-field>
                </v-responsive>
                <v-btn icon class="mr-2" @click="openLoginDialog">
                    <v-icon>mdi-account-circle</v-icon>
                </v-btn>

                <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </v-container>
        </v-app-bar>

        <v-main class="grey lighten-3">
            <v-container>
                <v-row>
                    <v-col :cols="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? 12 : 2">
                        <v-subheader>Language</v-subheader>
                        <v-sheet rounded="lg" class="mb-2">
                            <v-list color="transparent" dense>
                                <v-list-item link to="/">
                                    <v-list-item-content>
                                        <v-list-item-title>Main</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item link to="/lists">
                                    <v-list-item-content>
                                        <v-list-item-title>Lists</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-divider class="my-2"></v-divider>

                                <v-list-item to="/help" link>
                                    <v-list-item-content>
                                        <v-list-item-title>Help</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-sheet>
                        <v-sheet v-if="$store.state.auth.logged" rounded="lg">
                            <v-list color="transparent" dense>
                                <v-list-item link to="/notes">
                                    <v-list-item-content>
                                        <v-list-item-title>Notes</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-sheet>
                    </v-col>

                    <v-col>
                        <v-sheet class="pa-4" min-height="70vh" rounded="lg">
                            <router-view />
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>

        <LoginDialog
            :visible="loginDialogVisible"
            :cancel-method="cancelLoginDialog"
            :open-method="openLoginDialog"
            :open-sign-up="openSignUpDialog"
        />
        <SignUpDialog
            :visible="signUpDialogVisible"
            :cancel-method="cancelSignUpDialog"
            :open-method="openSignUpDialog"
            :back-action="openLoginDialog"
        />
    </v-app>
</template>
<script lang="ts">
import LoginDialog from '@/components/LoginDialog.vue';
import store from '@/store/index';
import Api from '@/classes/api';
import SignUpDialog from '@/components/global/SignUpDialog.vue';

export default {
    name: 'App',
    components: { SignUpDialog, LoginDialog },
    store: store,
    data: () => ({
        loginDialogVisible: false,
        signUpDialogVisible: false,
    }),
    async mounted() {
        await store.dispatch('setLogged');

        console.log('asd');

        if (store.state.auth.logged && Object.keys(store.state.auth.userData).length === 0) {
            Api.getInstance()
                .users.me.read()
                .then((data) => store.dispatch('setUserData', data.data))
                .then(() => {
                    return Api.getInstance().roles.read({
                        filter: {
                            id: store.state.auth.userData.role,
                        },
                        single: true,
                    });
                })
                .then((role) => {
                    return store.dispatch('setUserData', {
                        ...store.state.auth.userData,
                        admin_access: role.data!.admin_access,
                    });
                });
        }
    },
    computed: {
        isAdmin() {
            return this.$store.state.auth.logged && this.$store.state.auth.userData?.admin_access;
        },
    },
    methods: {
        openLoginDialog() {
            this.loginDialogVisible = true;
        },
        cancelLoginDialog() {
            this.loginDialogVisible = false;
        },
        openSignUpDialog() {
            this.loginDialogVisible = false;
            this.signUpDialogVisible = true;
        },
        cancelSignUpDialog() {
            this.signUpDialogVisible = false;
        },
    },
};
</script>
