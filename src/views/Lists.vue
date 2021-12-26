<template>
    <v-sheet class="pa-4" min-height="70vh" rounded="lg">
        <div>
            <div class="d-flex flex-row flex-wrap mb-4 align-stretch justify-start flex-sm-column flex-md-row">
                <v-row class="flex-grow-1">
                    <v-col class="col-auto d-flex align-center">
                        <AddListDialog v-if="logged" :success-handler="createListSuccessHandler" />
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                        <v-select
                            v-model="sortOption"
                            :items="sortOptionsArray"
                            color="accent"
                            :full-width="false"
                            item-color="accent"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                        <v-text-field v-model="searchQuery" label="Search" color="accent" :full-width="false" />
                    </v-col>
                </v-row>
            </div>
            <transition-group name="lists">
                <v-card
                    elevation="2"
                    hover
                    v-for="(list, i) in filteredLists"
                    :key="list.id"
                    :class="`${i + 1 !== filteredLists.length ? 'mb-4' : ''} list-card`"
                    :to="`/list/${list.id}`"
                >
                    <v-app-bar flat color="rgba(0,0,0,0)">
                        <v-toolbar-title> {{ list.name }} </v-toolbar-title>
                        <v-spacer />
                        <ListMenu :list="list" :success-handler="retrieveLists" />
                    </v-app-bar>
                </v-card>
            </transition-group>
        </div>
    </v-sheet>
</template>

<script lang="ts">
import AddListDialog from '@/components/AddListDialog.vue';
import ListMenu from '@/components/ListMenu.vue';
import store from '@/store/index';
import ListsController from '@/classes/lists';

type SortOption = {
    name: string;
    field: string;
};

type ListsDataType = {
    lists: [];
    sortOption: string;
    sortOptions: SortOption[];
    searchQuery: string;
};

export default {
    name: 'Lists',
    components: { ListMenu, AddListDialog },
    store: store,
    metaInfo: {
        title: 'Lists',
        sortOptions: [],
    },
    async mounted() {
        await this.retrieveLists();
        this.$watch('sortOptions', () => {}, { deep: true });
    },
    data: (): ListsDataType => ({
        lists: [],
        sortOption: store.state.lists.listSort,
        sortOptions: [
            { name: 'Date Created', field: 'date_created' },
            { name: 'Date Updated', field: 'date_updated' },
        ],
        searchQuery: '',
    }),
    watch: {
        sortOption(sort: string) {
            store.dispatch('setListSort', sort);
            this.sortLists(this.lists);
        },
        logged(newState: boolean, oldState: boolean) {
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
        filteredLists(): any[] {
            return this.lists.filter((list: any) => {
                return list.name.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
        },
        sortOptionsArray(): Array<SortOption> {
            return this.sortOptions.map((option: SortOption) => option.name, []);
        },
        sortOptionField(): string {
            return this.sortOptions.find((option: SortOption) => option.name === this.sortOption).field;
        },
    },
    methods: {
        async createListSuccessHandler() {
            await this.retrieveLists();
            this.$gtag.event('create_list');
        },
        async retrieveLists() {
            this.lists = await this.getLists().then(this.sortLists);
        },
        sortLists(lists: []) {
            return lists.sort((a, b) => {
                const aDate = new Date(a[this.sortOptionField]);
                const bDate = new Date(b[this.sortOptionField]);

                return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
            });
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

<style scoped>
.lists-enter-active,
.lists-leave-active {
    transition: all 0.5s;
}
.lists-enter {
    opacity: 0;
    transform: translateY(12px);
}
.lists-leave-to {
    opacity: 0;
    transform: translateX(64%);
}
</style>
