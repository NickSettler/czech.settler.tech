<template>
    <v-sheet class="pa-4" min-height="70vh" rounded="lg">
        <div>
            <div
                :class="`d-flex flex-row ${
                    $vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? 'mb-2' : 'mb-6'
                } align-end`"
            >
                <v-btn
                    class="mr-2"
                    @click="selectStyle(displayStyle === 'list' ? 'hidden' : 'list')"
                    fab
                    small
                    depressed
                    color="accent"
                >
                    <v-icon>
                        {{ displayStyle === 'list' ? 'mdi-eye' : 'mdi-eye-off' }}
                    </v-icon>
                </v-btn>
                <transition name="fade">
                    <div v-if="displayStyle === 'hidden'">
                        <v-btn icon color="accent" v-if="displayStyle === 'hidden'" @click="toggleTranslation">
                            <v-icon> mdi-google-translate </v-icon>
                        </v-btn>
                        <v-btn icon color="accent" v-if="displayStyle === 'hidden'" @click="randomWordsSort">
                            <v-icon> mdi-shuffle </v-icon>
                        </v-btn>
                    </div>
                </transition>
                <v-spacer></v-spacer>
                <p class="caption mb-0 mr-4 d-none d-md-block">
                    Showing {{ words.length }} word{{ words.length > 0 ? 's' : '' }}
                </p>
                <AddDialog
                    v-if="logged"
                    :list-id="this.$router.currentRoute.params.id"
                    :reload-words="reloadWords"
                    class="mr-1"
                />
            </div>
            <div class="is-flex d-flex d-md-none mb-4">
                <v-spacer />
                <p class="caption mb-0 mr-4">Showing {{ words.length }} word{{ words.length > 0 ? 's' : '' }}</p>
            </div>
            <div v-if="displayStyle === 'list'">
                <EditDialog
                    :word-id="word.id"
                    :visible="word.id === editingId"
                    v-for="(word, i) in words"
                    :key="word.id"
                    :handle-cancel="cancelEdit"
                >
                    <v-card
                        elevation="2"
                        :class="`${i + 1 !== words.length ? 'mb-4' : ''}`"
                        :hover="logged"
                        @click="logged ? (editingId = word.id) : false"
                    >
                        <v-card-text>
                            <p class="text-h6">{{ word.czech }} - {{ word.russian }}</p>
                            <p
                                style="white-space: pre-wrap"
                                class="body-2 mb-0"
                                v-if="word.description"
                                v-html="word.description"
                            ></p>
                        </v-card-text>
                    </v-card>
                </EditDialog>
            </div>
            <div v-if="displayStyle === 'hidden'">
                <v-card
                    elevation="2"
                    v-for="(word, i) in words"
                    :key="word.id"
                    :class="`${i + 1 !== words.length ? 'mb-4' : ''}`"
                    hover
                    @click="unhideWord(word.id)"
                >
                    <v-card-text>
                        <p class="text-h6" v-if="displayTranslation === 'czech'">
                            {{ word.hidden ? word.czech : word.russian }}
                        </p>
                        <p class="text-h6" v-if="displayTranslation === 'russian'">
                            {{ word.hidden ? word.russian : word.czech }}
                        </p>
                    </v-card-text>
                </v-card>
            </div>
        </div>
    </v-sheet>
</template>

<script lang="ts">
import Api from '@/classes/api.ts';
import AddDialog from '@/components/AddDialog.vue';
import EditDialog from '@/components/EditDialog.vue';
import store from '@/store';
import { VariableModel } from '@/classes/types/directus';

type ListDataType = {
    words: Array<VariableModel>;
    searchQuery: string;
    displayStyle: string;
    displayTranslation: string;
    needRandomSort: boolean;
    editingId: number;
};

export default {
    name: 'List',
    components: { EditDialog, AddDialog },
    store: store,
    metaInfo: {
        title: 'List',
    },
    data: (): ListDataType => ({
        words: [],
        searchQuery: '',
        displayStyle: 'list',
        displayTranslation: 'czech',
        needRandomSort: false,
        editingId: -1,
    }),
    async mounted() {
        this.reloadWords();

        if (localStorage.getItem(`list-${this.$router.currentRoute.params.id}-style`) === null) {
            localStorage.setItem(`list-${this.$router.currentRoute.params.id}-style`, 'list');
        }

        if (localStorage.getItem(`list-${this.$router.currentRoute.params.id}-translation`) === null) {
            localStorage.setItem(`list-${this.$router.currentRoute.params.id}-translation`, 'czech');
        }
    },
    beforeMount() {
        if (localStorage.getItem(`list-${this.$router.currentRoute.params.id}-style`) !== null) {
            const displayStyle = localStorage.getItem(`list-${this.$router.currentRoute.params.id}-style`);
            this.displayStyle = displayStyle;
            if (displayStyle === 'hidden') this.needRandomSort = true;
        }
        if (localStorage.getItem(`list-${this.$router.currentRoute.params.id}-translation`) !== null) {
            this.displayTranslation = localStorage.getItem(`list-${this.$router.currentRoute.params.id}-translation`);
        }
    },
    computed: {
        logged() {
            return this.$store.state.auth.logged;
        },
    },
    methods: {
        async reloadWords() {
            const listId = this.$router.currentRoute.params.id;
            const wordsIds = (
                await Api.getInstance()
                    .items('lists_words_2')
                    .readMany({
                        filter: {
                            lists_id: listId,
                        },
                        limit: 1000,
                    })
            ).data.map((relation: VariableModel) => relation.words_id);

            this.words = (wordsIds.length > 0
                ? (
                      await Api.getInstance()
                          .items('words')
                          .readMany({
                              filter: {
                                  id: {
                                      _in: wordsIds,
                                  },
                                  status: {
                                      _eq: 'published',
                                  },
                              },
                          })
                  ).data
                : []
            )
                .map((word: VariableModel) => {
                    word['hidden'] = true;

                    return word;
                })
                .sort((a: VariableModel, b: VariableModel) => {
                    const aDate = new Date(a.date_created);
                    const bDate = new Date(b.date_created);

                    return aDate > bDate ? -1 : 1;
                });

            if (this.needRandomSort) {
                this.randomWordsSort();
                this.needRandomSort = false;
            }
        },
        randomWordsSort() {
            this.words = this.words.sort(() => Math.floor(Math.random() * (2 + 1)) - 1);
        },
        selectStyle(style: string) {
            if (this.displayStyle !== style) this.menuVisible = false;
            this.displayStyle = style;
            localStorage.setItem(`list-${this.$router.currentRoute.params.id}-style`, style);
        },
        toggleTranslation() {
            this.words = this.words.map((word: VariableModel) => {
                word.hidden = true;
                return word;
            });
            localStorage.setItem(
                `list-${this.$router.currentRoute.params.id}-translation`,
                this.displayTranslation === 'czech' ? 'russian' : 'czech',
            );
            this.displayTranslation = this.displayTranslation === 'czech' ? 'russian' : 'czech';
        },
        unhideWord(id: unknown) {
            this.words.find((word: VariableModel) => word.id === id).hidden = !this.words.find(
                (word: VariableModel) => word.id === id,
            ).hidden;
        },
        cancelEdit() {
            this.reloadWords();
            this.editingId = -1;
        },
    },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition-property: visibility, opacity;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;
}
.fade-enter,
.fade-leave-active,
.fade-leave-to {
    opacity: 0;
    visibility: collapse;
}
</style>
