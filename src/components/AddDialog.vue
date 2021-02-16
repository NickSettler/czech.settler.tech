<template>
  <div>
    <v-dialog v-model="shown" max-width="290">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="accent" dark v-bind="attrs" v-on="on">
          Add word
        </v-btn>
      </template>
      <v-form ref="form" lazy-validation v-if="logged">
        <v-card>
          <v-card-title class="headline">
            Add new word?
          </v-card-title>
          <v-card-text>
            <v-text-field
              :rules="wordRules"
              v-model="czech"
              placeholder="Czech"
              @input="error = false"
            />
            <v-text-field
              :rules="wordRules"
              v-model="russian"
              placeholder="Russian"
              @input="error = false"
            />
            <p v-if="error" class="red--text darken-3">Error. Try again</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" text @click="shown = false">
              Close
            </v-btn>
            <v-btn color="green darken-1" text @click="addWord">
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
      <v-card v-else>
        <v-card-title class="headline">
          You must login
        </v-card-title>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="shown = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Api from "@/classes/api.ts";

export default {
  name: "AddDialog",
  props: ["listId", "reloadWords"],
  data: () => ({
    shown: false,
    czech: "",
    russian: "",
    wordRules: [value => !!value || "Required"],
    logged: Api.getInstance().auth.token !== null,
    error: false
  }),
  updated() {
    this.logged = Api.getInstance().auth.token !== null;
  },
  methods: {
    addWord() {
      if (this.$refs.form.validate()) {
        Api.getInstance()
          .items("words")
          .create({
            czech: this.czech,
            russian: this.russian
          })
          .then(wordData => {
            return Api.getInstance()
              .items("lists_words_2")
              .create({
                lists_id: this.$props.listId,
                words_id: wordData.data.id
              });
          })
          .then(() => {
            this.shown = false;
            this.$props.reloadWords();
          })
          .catch(() => {
            this.error = true;
          });
      }
    }
  }
};
</script>

<style scoped></style>
