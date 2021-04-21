<template>
    <div>
        <v-dialog v-model="shown" max-width="300" @click:outside="cancel">
            <template v-slot:activator="{ on, attrs }">
                <v-btn color="accent" v-bind="attrs" v-on="on"> Add List </v-btn>
            </template>
            <v-form @submit.prevent="submitHandler" ref="form">
                <v-card>
                    <v-card-title>Create new list</v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="name"
                            color="accent"
                            placeholder="Name"
                            :rules="nameRules"
                            :validate-on-blur="false"
                            :disabled="loading"
                            @input="error = false"
                        />
                        <p v-if="error" class="red--text darken-3">Error. Try again</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn :disabled="loading" type="submit" color="accent" text :loading="loading"> Create </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import store from '@/store';
import Api from '@/classes/api';

export default {
    name: 'AddListDialog',
    props: ['successHandler'],
    store: store,
    data: () => ({
        name: '',
        shown: false,
        nameRules: [(value: string) => !!value || 'Required'],
        loading: false,
        error: false,
    }),
    methods: {
        submitHandler() {
            if (this.loading) return;

            this.loading = true;
            Api.getInstance()
                .items('lists')
                .createOne({
                    name: this.name,
                })
                .then(() => this.$props.successHandler())
                .then(() => this.cancel())
                .catch(() => (this.error = true));
        },
        cancel() {
            this.name = '';
            this.loading = false;
            this.shown = false;
            this.error = false;
            this.$refs.form.resetValidation();
        },
    },
};
</script>

<style scoped></style>
