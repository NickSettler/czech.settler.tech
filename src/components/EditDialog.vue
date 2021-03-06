<template>
    <div>
        <v-dialog v-model="dialogShown" max-width="360" @click:outside="cancelDialog">
            <template v-slot:activator="{ on, attrs }">
                <slot v-bind="attrs" v-on="on"></slot>
            </template>
            <v-form ref="form" lazy-validation v-if="logged">
                <v-card>
                    <v-card-title class="headline"> Edit {{ word.czech }}</v-card-title>
                    <v-card-text>
                        <v-text-field :rules="wordRules" v-model="czech" placeholder="Czech" @input="error = false" />
                        <v-text-field
                            :rules="wordRules"
                            v-model="russian"
                            placeholder="Russian"
                            @input="error = false"
                        />
                        <v-textarea v-model="description" placeholder="Description"></v-textarea>
                        <p v-if="error" class="red--text darken-3">Error. Try again</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="green darken-1" text @click="deleteWord" :disabled="loading"> Delete</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="cancelDialog" :disabled="loading"> Close</v-btn>
                        <v-btn color="green darken-1" text @click="updateWord" :disabled="loading"> Apply</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
            <v-card v-else>
                <v-card-title class="headline"> You must login</v-card-title>
                <v-card-actions>
                    <v-btn color="green darken-1" text @click="cancelDialog"> Ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="js">
import Api from "@/classes/api.ts";
import * as Sentry from "@sentry/vue";

export default {
    name: "EditDialog",
    props: ['wordId', 'handleCancel', 'visible'],
    data: () => ({
        shown: false,
        word: {},
        czech: '',
        russian: '',
        description: ``,
        wordRules: [
            value => !!value || "Required"
        ],
        logged: Api.getInstance().auth.token !== null,
        error: false,
        loading: true,
    }),
    mounted() {
        // this.getWordDetails();
    },
    computed: {
        dialogShown() {
            return this.shown && !this.loading;
        }
    },
    watch: {
        shown() {
            this.getWordDetails();
        }
    },
    updated() {
        this.logged = Api.getInstance().auth.token !== null;

        if (this.$props.visible)
            this.shown = true;
    },
    methods: {
        getWordDetails() {
            Api.getInstance().items('words').readOne(this.$props.wordId)
                .then(word => {
                    this.loading = false;
                    this.word = word;
                    this.description = word.description;
                    this.czech = word.czech;
                    this.russian = word.russian;
                });
        },
        deleteWord() {
            Api.getInstance().items('words').updateOne(this.$props.wordId, {
                    status: 'archived',
                }).then(() => {
                    this.shown = false;
                    this.cancelDialog();
                }).catch((error) => {
                    Sentry.captureException(error);
                    this.error = true;
                })
        },
        updateWord() {
            Api.getInstance().items('words').updateOne(this.$props.wordId, {
                czech: this.czech,
                russian: this.russian,
                description: this.description,
            }).then(() => {
                this.cancelDialog();
            }).catch(error => {
                Sentry.captureException(error);
            })
        },
        cancelDialog() {
            this.shown = false;
            this.czech = '';
            this.russian = '';
            this.description = '';
            this.handleCancel();
        }
    }
}
</script>

<style scoped></style>
