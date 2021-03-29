<template>
    <v-dialog v-model="shown" max-width="290">
        <v-card>
            <v-form ref="form" @submit.prevent.stop="submit">
                <v-card-title class="headline">
                    <v-btn icon class="mr-4" @click="goBack">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    Sign Up
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        :loading="loading"
                        v-model="email"
                        placeholder="E-Mail"
                        type="email"
                        :rules="emailRules"
                    ></v-text-field>
                    <v-text-field
                        :loading="loading"
                        v-model="password"
                        placeholder="Password"
                        type="password"
                        :rules="passwordRules"
                    ></v-text-field>
                    <v-text-field
                        :loading="loading"
                        v-model="passwordConfirm"
                        placeholder="Password confirmation"
                        type="password"
                        :rules="passwordConfirmRules"
                    ></v-text-field>
                    <p v-if="error" class="red--text darken-3">Error. Try again</p>
                </v-card-text>
                <v-card-actions>
                    <v-btn :loading="loading" color="green darken-1" type="submit" text>Sign Up</v-btn>
                    <v-btn :loading="loading" color="grey darken-1" type="button" text @click="cancel">Cancel</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Api from '@/classes/api';
import store from '@/store';
import localforage from 'localforage';

const EMAIL_REGEXP = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/gm;
export default {
    name: 'SignUpDialog',
    props: ['backAction', 'visible', 'cancelMethod', 'openMethod'],
    data: () => ({
        email: '',
        password: '',
        passwordConfirm: '',
        emailRules: [
            (email: string) => !!email || 'Required',
            (email: string) => !!email.match(EMAIL_REGEXP) || 'Not valid email',
        ],
        passwordRules: [
            (password: string) => !!password || 'Required',
            (password: string) => password.length >= 8 || 'Minimum length is 8',
        ],
        loading: false,
        error: false,
    }),
    watch: {
        shown(state: boolean) {
            if (state) this.$emit('opened');
        },
    },
    async updated() {
        if (store.state.auth.logged !== ((await localforage.getItem('directus_access_token')) !== null))
            await store.dispatch('setLogged');
        if (this.logged && Object.keys(this.userData).length === 0)
            await store.dispatch('setUserData', (await Api.getInstance().users.me.read()).data);
    },
    computed: {
        shown: {
            get() {
                return this.$props.visible;
            },
            set() {
                this.cancel();
            },
        },
        passwordConfirmRules() {
            return [
                ...this.passwordRules,
                (passwordConfirm: string) => passwordConfirm === this.password || 'Passwords not match',
            ];
        },
        logged: () => store.state.auth.logged,
        userData: () => store.state.auth.userData,
    },
    methods: {
        submit() {
            this.loading = true;
            this.error = false;
            if (this.$refs.form.validate()) {
                Api.getInstance()
                    .users.create({
                        email: this.email,
                        password: this.password,
                    })
                    .then(() => {
                        return Api.getInstance().auth.login({
                            email: this.email,
                            password: this.password,
                        });
                    })
                    .then(() => {
                        this.loading = false;
                        this.cancel();
                    })
                    .catch(() => {
                        this.loading = false;
                        this.error = true;
                    });
            } else {
                this.loading = false;
                this.error = false;
            }

            return false;
        },
        goBack() {
            this.cancel();
            this.$props.backAction();
        },
        cancel() {
            this.$refs.form.resetValidation();
            this.error = false;
            this.$props.cancelMethod();
        },
    },
};
</script>

<style scoped></style>
