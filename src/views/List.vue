<template>
    <div>
        <div class="d-flex flex-row mb-4">
            <v-btn
                class="mr-2"
                :depressed="displayStyle === 'list'"
                :color="displayStyle === 'list' ? 'primary' : 'accent'"
                @click="selectStyle('list')"
            >
                List
            </v-btn>
            <v-btn
                class="mr-2"
                :depressed="displayStyle === 'hidden'"
                :color="displayStyle === 'hidden' ? 'primary' : 'accent'"
                @click="selectStyle('hidden')"
            >
                Hidden
            </v-btn>
            <v-btn icon color="accent" v-if="displayStyle === 'hidden'" @click="toggleTranslation">
                <v-icon> mdi-google-translate </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <AddDialog :list-id="this.$router.currentRoute.params.id" :reload-words="reloadWords" />
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
    editingId: number;
};

export default {
    name: 'List',
    components: { EditDialog, AddDialog },
    store: store,
    metaInfo: {
        title: 'List',
    },
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
            this.displayStyle = localStorage.getItem(`list-${this.$router.currentRoute.params.id}-style`);
        }
        if (localStorage.getItem(`list-${this.$router.currentRoute.params.id}-translation`) !== null) {
            this.displayTranslation = localStorage.getItem(`list-${this.$router.currentRoute.params.id}-translation`);
        }
    },
    data: (): ListDataType => ({
        words: [],
        searchQuery: '',
        displayStyle: 'list',
        displayTranslation: 'czech',
        editingId: -1,
    }),
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
                    .read({
                        filter: {
                            lists_id: listId,
                        },
                        limit: 1000,
                    })
            ).data.map((relation: VariableModel) => relation.words_id);

            this.words = (
                await Api.getInstance()
                    .items('words')
                    .read({
                        filter: {
                            id: {
                                _in: wordsIds,
                            },
                        },
                    })
            ).data
                .map((word: VariableModel) => {
                    word['hidden'] = true;

                    return word;
                })
                .sort((a: VariableModel, b: VariableModel) => {
                    const aDate = new Date(a.date_created);
                    const bDate = new Date(b.date_created);

                    return aDate > bDate ? -1 : 1;
                })
                .sort((a: VariableModel, b: VariableModel) => {
                    if (a.date_updated === null && b.date_updated === null) return 0;

                    const aDate = new Date(a.date_updated);
                    const bDate = new Date(b.date_updated);

                    return aDate > bDate ? -1 : 1;
                });
        },
        selectStyle(style: string) {
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

<style scoped></style>
