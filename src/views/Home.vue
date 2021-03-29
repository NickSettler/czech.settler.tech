<template>
    <div>
        <v-card>
            <v-card-text>
                <p class="text-h6 black--text">Total lists count</p>
                <p class="text-body-1">{{ lists.length }}</p>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
import Api from '@/classes/api.ts';
import store from '@/store/index';
import { VariableModel } from '@/classes/types/directus';

type HomeDataType = {
    lists: Array<VariableModel>;
};

export default {
    name: 'Home',
    store: store,
    metaInfo: {
        title: 'Home',
    },
    async mounted() {
        this.lists = (await Api.getInstance().items('lists').read()).data;
    },
    data: () => ({
        lists: [],
    }),
};
</script>
