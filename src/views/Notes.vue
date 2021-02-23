<template>
    <div>
        <v-card v-for="(note, i) in notes" :class="`${i + 1 !== notes.length ? 'mb-4' : ''}`" :key="note.id">
            <v-card-title>
                {{ note.title }}
            </v-card-title>
        </v-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Api from '@/classes/api';

export default Vue.extend({
    name: 'Notes',
    data: () => ({
        notes: [],
    }),
    mounted() {
        this.reloadNotes();
    },
    methods: {
        async reloadNotes() {
            this.notes = (await Api.getInstance().items('notes').read()).data as [];
        },
    },
});
</script>
