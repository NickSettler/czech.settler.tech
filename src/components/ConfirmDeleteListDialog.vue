<template>
    <div>
        <v-dialog v-model="shown" max-width="300" @click:outside="cancel">
            <template v-slot:activator="{ on, attrs }">
                <v-list-item v-bind="attrs" v-on="on">
                    <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
            </template>
            <v-card>
                <v-card-title>Delete list {{ this.$props.list.name }}?</v-card-title>
                <p v-if="error" class="red--text darken-3">Error. Try again</p>
                <v-card-actions>
                    <v-spacer />
                    <v-btn outlined color="grey" @click="cancel" :loading="loading">Cancel</v-btn>
                    <v-btn color="primary" @click="deleteList" :loading="loading">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Api from '@/classes/api';

export default {
    name: 'ConfirmDeleteListDialog',
    props: ['list', 'successHandler'],
    data: () => ({
        shown: false,
        loading: false,
        error: false,
    }),
    methods: {
        deleteList() {
            this.loading = true;
            Api.getInstance()
                .items('lists')
                .delete(this.$props.list.id)
                .then(() => this.$props.successHandler())
                .then(() => this.cancel())
                .catch(() => (this.error = true));
        },
        cancel() {
            this.loading = false;
            this.error = false;
            this.shown = false;
        },
    },
};
</script>

<style scoped></style>
