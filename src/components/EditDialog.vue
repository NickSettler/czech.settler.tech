<template>
    <div>
        <v-dialog v-model="shown" max-width="360" @click:outside="cancelDialog">
            <template v-slot:activator="{on, attrs}">
                <slot v-bind="attrs" v-on="on"></slot>
            </template>
            <v-form ref="form" lazy-validation v-if="logged">
                <v-card>
                    <v-card-title class="headline">
                        Edit {{ word.czech }}
                    </v-card-title>
                    <v-card-text>
                        <v-text-field :rules="wordRules" v-model="czech" placeholder="Czech" @input="error = false"/>
                        <v-text-field :rules="wordRules" v-model="russian" placeholder="Russian"
                                      @input="error = false"/>
                        <v-textarea v-model="description" placeholder="Description"></v-textarea>
                        <p v-if="error" class="red--text darken-3">Error. Try again</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="green darken-1" text @click="deleteWord" :disabled="loading">
                            Delete
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="cancelDialog" :disabled="loading">
                            Close
                        </v-btn>
                        <v-btn color="green darken-1" text @click="updateWord" :disabled="loading">
                            Apply
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
            <v-card v-else>
                <v-card-title class="headline">
                    You must login
                </v-card-title>
                <v-card-actions>
                    <v-btn color="green darken-1" text @click="cancelDialog">
                        Ok
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="js">
import Api from "@/classes/api.ts";

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
    beforeMount() {
        Api.getInstance().items('words').read({
            filter: {
                id: `${this.$props.wordId}`
            },
            single: true
        })
            .then(data => {
                this.loading = false;
                this.word = data.data;
                this.description = data.data.description;
                this.czech = data.data.czech;
                this.russian = data.data.russian;
            });
    },
    updated() {
        this.logged = Api.getInstance().auth.token !== null;

        if (this.$props.visible)
            this.shown = true;
    },
    methods: {
        deleteWord() {
            Api.getInstance().items('words').delete(this.$props.wordId)
                .then(() => {
                    this.shown = false;
                    this.cancelDialog();
                })
        },
        updateWord() {
            Api.getInstance().items('words').update(this.$props.wordId, {
                czech: this.czech,
                russian: this.russian,
                description: this.description,
            }).then(() => {
                this.cancelDialog();
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

<style scoped>

</style>