<template>
    <div>
        <v-dialog v-model="shown" max-width="290" @click:outside="cancel">
            <template v-slot:activator="{ on, attrs }">
                <v-btn color="accent" dark v-bind="attrs" v-on="on" fab small depressed>
                    <v-icon> mdi-plus </v-icon>
                </v-btn>
            </template>
            <v-form ref="form" lazy-validation v-if="logged" @submit.prevent>
                <v-card>
                    <v-card-title class="headline"> Add new word? </v-card-title>
                    <v-card-text>
                        <v-text-field
                            type="text"
                            autocomplete="off"
                            :validate-on-blur="false"
                            :rules="wordRules"
                            v-model="czech"
                            placeholder="Czech"
                            @input="error = false"
                            :loading="loading"
                        />
                        <v-text-field
                            type="text"
                            autocomplete="off"
                            :validate-on-blur="false"
                            :rules="wordRules"
                            v-model="russian"
                            placeholder="Russian"
                            @input="error = false"
                            :loading="loading"
                        />
                        <v-textarea
                            v-model="description"
                            placeholder="Description"
                            :loading="loading && !!description"
                            :disabled="loading && !description"
                        ></v-textarea>
                        <p v-if="error" class="red--text darken-3">Error. Try again</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="green darken-1" text @click="cancel" :loading="loading"> Close </v-btn>
                        <v-btn type="submit" color="green darken-1" text @click="addWord" :loading="loading">
                            Add
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
            <v-card v-else>
                <v-card-title class="headline"> You must login </v-card-title>
                <v-card-actions>
                    <v-btn color="green darken-1" text @click="cancel"> OK </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="js">
import Api from "@/classes/api.ts";
import * as Sentry from '@sentry/vue';

export default {
    name: "AddDialog",
    props: ["listId", "reloadWords"],
    data: () => ({
        shown: false,
        czech: "",
        russian: "",
        description: "",
        wordRules: [value => !!value || "Required"],
        logged: Api.getInstance().auth.token !== null,
        loading: false,
        error: false
    }),
    updated() {
        this.logged = Api.getInstance().auth.token !== null;
    },
    methods: {
        addWord() {
            this.loading = true;
            if (this.$refs.form.validate()) {
                Api.getInstance()
                    .items("words")
                    .createOne({
                        description: this.description,
                        czech: this.czech,
                        russian: this.russian
                    })
                    .then(wordData => {
                        return Api.getInstance()
                            .items("lists_words_2")
                            .createOne({
                                lists_id: this.$props.listId,
                                words_id: wordData.id
                            });
                    })
                    .then(() => {
                        this.cancel();
                    })
                    .catch((error) => {
                        Sentry.captureException(error);
                        this.loading = false;
                        this.error = true;
                    });
            }
        },
        cancel(){
            this.czech = "";
            this.russian = "";
            this.description = "";
            this.shown = false;
            this.loading = false;
            this.error = false;
            this.$refs.form.resetValidation();
            this.reloadWords();
        }
    }
};
</script>

<style scoped></style>
