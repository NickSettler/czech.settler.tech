<template>
    <div>
        <v-dialog v-model="shown" max-width="290">
            <v-form
                id="login-form"
                v-if="!logged"
                ref="loginForm"
                lazy-validation
                @submit="login"
                action="/"
                method="post"
            >
                <v-card>
                    <v-card-title class="headline"> Login </v-card-title>
                    <v-card-text>
                        <v-text-field
                            type="email"
                            :rules="emailRules"
                            v-model="email"
                            placeholder="Email"
                            @input="error = false"
                            autocomplete="email"
                            name="email"
                        />
                        <v-text-field
                            type="password"
                            :rules="passwordRules"
                            v-model="password"
                            placeholder="Password"
                            @input="error = false"
                            autocomplete="current-password"
                            name="password"
                        />
                        <p v-if="error" class="red--text darken-3">Error. Try again</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn type="submit" color="green darken-1" text> Login </v-btn>
                        <v-btn color="green darken-1" text @click="cancel"> Close </v-btn>
                        <v-spacer />
                        <v-btn text color="grey darken-1" @click="$props.openSignUp()">Sign Up</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
            <v-card v-else>
                <v-card-title class="headline"> Logged {{ userData.first_name }} </v-card-title>
                <v-card-actions>
                    <v-btn color="green darken-1" text @click="logout"> Logout </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import Api from '@/classes/api.ts';
import Vue from 'vue';
import { VForm } from '@/classes/types/vuetify';
import { LoginCredentials } from '@directus/sdk-js/dist/types/handlers';
import store from '@/store/index';
import localforage from 'localforage';

export default Vue.extend({
    name: 'LoginDialog',
    props: ['visible', 'cancelMethod', 'openMethod', 'openSignUp'],
    store: store,
    data: () => ({
        email: '',
        password: '',
        emailRules: [
            (value: any) => !!value || 'Required',
            (value: string) => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value) || 'Email not valid',
        ],
        passwordRules: [(value: any) => !!value || 'Required'],
        token: '',
        error: false,
    }),
    computed: {
        logged: () => store.state.auth.logged,
        userData: () => store.state.auth.userData,
        shown: {
            get() {
                return this.$props.visible;
            },
            set() {
                this.cancel();
            },
        },
    },
    async updated() {
        if (store.state.auth.logged !== ((await localforage.getItem('directus_access_token')) !== null))
            await store.dispatch('setLogged');
        if (this.logged && Object.keys(this.userData).length === 0)
            await store.dispatch('setUserData', (await Api.getInstance().users.me.read()).data);
    },
    methods: {
        login(e: Event) {
            e.preventDefault();

            if ((this.$refs.loginForm as VForm).validate()) {
                const credentials: LoginCredentials = {
                    email: this.email,
                    password: this.password,
                };

                if (this.token) credentials.otp = this.token;

                Api.getInstance()
                    .auth.login(credentials)
                    .then(async () => {
                        if (window.PasswordCredential) {
                            const c = await navigator.credentials.create({
                                password: e.target as HTMLFormElement,
                            });

                            this.cancel();

                            return navigator.credentials.store(c!);
                        } else {
                            this.cancel();
                            return Promise.resolve();
                        }
                    })
                    .catch(() => {
                        this.error = true;
                    });
            }
        },
        logout() {
            Api.getInstance()
                .auth.logout()
                .then(() => {
                    this.cancel();
                });
        },
        open() {
            this.error = false;
            this.$props.openMethod();
        },
        cancel() {
            this.error = false;
            this.$props.cancelMethod();
        },
    },
});
</script>

<style scoped></style>
