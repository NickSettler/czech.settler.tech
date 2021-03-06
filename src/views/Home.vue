<template>
    <v-sheet class="pa-4" min-height="70vh" rounded="lg">
        <div>
            <v-card v-if="logged">
                <v-card-text>
                    <p class="text-h6 black--text">Total lists count</p>
                    <p class="text-body-1">{{ lists.length }}</p>
                </v-card-text>
            </v-card>
            <template v-else>
                <v-card class="mb-6">
                    <v-card-text>
                        <p class="text-h6 black--text">Public lists count</p>
                        <p class="text-body-1">{{ lists.length }}</p>
                    </v-card-text>
                </v-card>
                <v-card v-if="lists.length > 0">
                    <v-card-text>
                        <p class="text-h6 black--text">Public lists</p>
                        <v-list dense>
                            <v-list-item v-for="list in lists" :key="list.id" link :to="`/list/${list.id}`">
                                <v-list-item-title>
                                    {{ list.name }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </template>
        </div>
    </v-sheet>
</template>

<script lang="ts">
import store from '@/store/index';
import { VariableModel } from '@/classes/types/directus';
import ListsController from '@/classes/lists';

type HomeDataType = {
    lists: Array<VariableModel>;
};

export default {
    name: 'Home',
    store: store,
    metaInfo: {
        title: 'Home',
    },
    data: (): HomeDataType => ({
        lists: [],
    }),
    async mounted() {
        await this.retrieveLists();
    },
    watch: {
        logged(newState: unknown, oldState: unknown) {
            if (newState !== oldState) {
                this.lists = [];
                this.retrieveLists();
            }
        },
    },
    computed: {
        logged(): boolean {
            return this.$store.state.auth.logged;
        },
    },
    methods: {
        async retrieveLists() {
            this.lists = await this.getLists();
        },
        async getLists() {
            const filterObject: Record<string, string> = {
                status: 'published',
            };

            if (this.logged) filterObject.user_created = '$CURRENT_USER';

            return await ListsController.getLists({
                filter: filterObject,
            });
        },
    },
};
</script>
