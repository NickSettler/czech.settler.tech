<template>
    <div>
        <v-dialog v-model="shown" max-width="290" @click:outside="cancel">
            <template v-slot:activator="{ on, attrs }">
                <v-btn color="accent" v-bind="attrs" v-on="on">Create note</v-btn>
            </template>
            <v-form ref="form" lazy-validation>
                <v-card>
                    <v-card-title>Create note</v-card-title>
                    <v-card-text>
                        <v-text-field
                            :validate-on-blur="false"
                            :rules="rules"
                            @input="error = false"
                            v-model="name"
                            :loading="loading"
                            placeholder="Name"
                        />
                        <p v-if="error" class="red--text darken-3">Error. Try again</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn text color="grey darken-1" @click="cancel" :loading="loading">Cancel</v-btn>
                        <v-btn text color="green darken-1" @click="create" :loading="loading">Create</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import Api from '@/classes/api';
import { COLLECTIONS } from '@/classes/types/directus';

export default {
    name: 'CreateNoteDialog',
    props: ['successHandler'],
    data: () => ({
        shown: false,
        name: '',
        rules: [(value: unknown) => !!value || 'Required'],
        loading: false,
        error: false,
    }),
    methods: {
        create() {
            if (this.$refs.form.validate()) {
                this.loading = true;
                Api.getInstance()
                    .items(COLLECTIONS.NOTES)
                    .create({
                        name: this.name,
                    })
                    .then(() => {
                        return this.$props.successHandler();
                    })
                    .then(() => {
                        this.loading = false;
                        this.cancel();
                    })
                    .catch(() => {
                        this.error = true;
                        this.loading = false;
                    });
            }
        },
        cancel() {
            this.shown = false;
            this.error = false;
            this.loading = false;
            this.name = '';
            this.$refs.form.resetValidation();
        },
    },
};
</script>

<style scoped></style>
