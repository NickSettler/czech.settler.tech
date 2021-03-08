<template>
    <div>
        <v-dialog v-model="shown" max-width="290" @click:outside="cancel">
            <template v-slot:activator="{ on, attrs }">
                <v-list-item v-bind="attrs" v-on="on">
                    <v-list-item-title> <slot /> </v-list-item-title>
                </v-list-item>
            </template>
            <v-form ref="form">
                <v-card>
                    <v-card-title>{{ this.$props.title }}</v-card-title>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="grey darken-1" text @click="cancel" :loading="loading">Cancel</v-btn>
                        <v-btn color="green darken-1" text @click="emitEvent" :loading="loading"> <slot /> </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'NoteMenuItem',
    props: ['note', 'title', 'action'],
    data: () => ({
        shown: false,
        error: false,
        loading: false,
    }),
    methods: {
        cancel() {
            if (!this.loading) {
                this.shown = false;
                this.loading = false;
                this.error = false;
            }
        },
        emitEvent() {
            this.loading = true;
            this.error = false;
            this.$props
                .action(this.$props.note)
                .then(() => {
                    this.loading = false;
                    this.error = false;
                    this.shown = false;
                })
                .catch(() => {
                    this.loading = false;
                    this.error = true;
                });
        },
    },
};
</script>

<style scoped></style>
