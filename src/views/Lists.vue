<template>
    <div>
        <div class="d-flex flex-row mb-4">
            <AddListDialog :success-handler="getLists" />
        </div>
        <transition-group name="lists">
            <v-card
                elevation="2"
                hover
                v-for="(list, i) in lists"
                :key="list.id"
                :class="`${i + 1 !== lists.length ? 'mb-4' : ''} list-card`"
                :to="`/list/${list.id}`"
            >
                <v-app-bar flat color="rgba(0,0,0,0)">
                    <v-toolbar-title> {{ list.name }} </v-toolbar-title>
                    <v-spacer />
                    <ListMenu :list="list" :success-handler="getLists" />
                </v-app-bar>
            </v-card>
        </transition-group>
    </div>
</template>

<script>
import Api from '@/classes/api.ts';
import AddListDialog from '@/components/AddListDialog';
import ListMenu from '@/components/ListMenu';

export default {
    name: 'Lists',
    components: { ListMenu, AddListDialog },
    async mounted() {
        await this.getLists();
    },
    data: () => ({
        lists: [],
    }),
    methods: {
        async getLists() {
            this.lists = (
                await Api.getInstance()
                    .items('lists')
                    .read({
                        filter: {
                            status: 'published',
                        },
                        sort: 'date_created',
                    })
            ).data;
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
