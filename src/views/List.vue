<template>
    <div>
        <div class="d-flex flex-row mb-4">
            <v-btn class="mr-2" :depressed="displayStyle==='list'"
                   :color="displayStyle ==='list' ? 'primary' : 'accent'" @click="selectStyle('list')">
                List
            </v-btn>
            <v-btn class="mr-2" :depressed="displayStyle==='hidden'"
                   :color="displayStyle ==='hidden' ? 'primary' : 'accent'" @click="selectStyle('hidden')">
                Hidden
            </v-btn>
            <v-spacer></v-spacer>
            <AddDialog :list-id="this.$router.currentRoute.params.id" :reload-words="reloadWords"/>
        </div>
        <div v-if="displayStyle==='list'">
            <EditDialog :word-id="word.id" :visible="word.id === editingId" v-for="(word, i) in words" :key="word.id"
                        :handle-cancel="cancelEdit">
                <v-card elevation="2" :class="`${i + 1 !== words.length ? 'mb-4' : ''}`" hover
                        @click="editingId = word.id">
                    <v-card-text>
                        <p class="text-h6">
                            {{ word.czech }} - {{ word.russian }}
                        </p>
                    </v-card-text>
                </v-card>
            </EditDialog>
        </div>
        <div v-if="displayStyle==='hidden'">
            <v-card elevation="2" v-for="(word, i) in words" :key="word.id"
                    :class="`${i + 1 !== words.length ? 'mb-4' : ''}`" hover @click="unhideWord(word.id)">
                <v-card-text>
                    <p class="text-h6">
                        {{ word.hidden ? word.czech : word.russian }}
                    </p>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script>
import Api from "@/classes/api.ts";
import AddDialog from "@/components/AddDialog";
import EditDialog from "@/components/EditDialog";

export default {
    name: "List",
    components: {EditDialog, AddDialog},
    async mounted() {
        this.reloadWords();

        if (localStorage.getItem(`list-${this.$router.currentRoute.params.id}-style`) === null) {
            localStorage.setItem(`list-${this.$router.currentRoute.params.id}-style`, 'list');
        }
    },
    beforeMount() {
        if (localStorage.getItem(`list-${this.$router.currentRoute.params.id}-style`) !== null) {
            this.displayStyle = localStorage.getItem(`list-${this.$router.currentRoute.params.id}-style`)
        }
    },
    data: () => ({
        words: [],
        searchQuery: "",
        displayStyle: 'list',
        editingId: -1,
    }),
    methods: {
        async reloadWords() {
            const listId = this.$router.currentRoute.params.id
            const wordsIds = (await Api.getInstance().items('lists_words_2').read({
                filter: {
                    lists_id: listId
                },
                limit: 1000,
            })).data.map(relation => relation.words_id);

            this.words = (await Api.getInstance().items('words').read({
                filter: {
                    id: {
                        _in: wordsIds
                    }
                },
            })).data.map(word => {
                word['hidden'] = true;

                return word;
            }).sort((a, b) => {
                const aDate = new Date(a.date_created);
                const bDate = new Date(b.date_created);

                return aDate > bDate ? -1 : 1;
            }).sort((a, b) => {
                if (a.date_updated === null && b.date_updated === null)
                    return 0;

                const aDate = new Date(a.date_updated);
                const bDate = new Date(b.date_updated);

                return aDate > bDate ? -1 : 1;
            })
        },
        selectStyle(style) {
            this.displayStyle = style;
            localStorage.setItem(`list-${this.$router.currentRoute.params.id}-style`, style);
        },
        unhideWord(id) {
            this.words.find(word => word.id === id).hidden = !this.words.find(word => word.id === id).hidden;
        },
        cancelEdit() {
            this.reloadWords();
            this.editingId = -1;
        }
    }
}
</script>

<style scoped>

</style>