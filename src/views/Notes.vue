<template>
    <v-sheet class="pa-4" min-height="70vh" rounded="lg">
        <div>
            <div class="d-flex justify-end mb-4">
                <CreateNoteDialog :success-handler="reloadNotes" />
            </div>
            <template v-for="(note, i) in notes">
                <NoteItem :key="note.id" :note="note" :final="i + 1 !== notes.length" :reload-handler="reloadNotes" />
            </template>
        </div>
    </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue';
import Api from '@/classes/api';
import { VariableModel } from '@/classes/types/directus';
import CreateNoteDialog from '@/components/notes/CreateNoteDialog.vue';
import NoteItem from '@/components/notes/NoteItem.vue';

type NotesDataType = {
    notes: VariableModel[];
};

export default Vue.extend({
    name: 'Notes',
    components: { NoteItem, CreateNoteDialog },
    data: (): NotesDataType => ({
        notes: [],
    }),
    mounted() {
        this.reloadNotes();
    },
    methods: {
        async reloadNotes() {
            this.notes = await this.getNotes().then(this.processNotes);
        },
        async getNotes() {
            return (
                await Api.getInstance()
                    .items('notes')
                    .readMany({
                        filter: {
                            status: 'published',
                            user_created: {
                                _eq: '$CURRENT_USER',
                            },
                        },
                    })
            ).data;
        },
        async processNotes(notes: VariableModel[]) {
            return await Promise.all(
                notes.map(async (note) => {
                    const userCreated = await Api.getInstance().users.readOne(note.user_created as string);

                    return {
                        ...note,
                        date_created: new Date(note.date_created),
                        user_created: {
                            uuid: note.user_created,
                            first_name: userCreated.first_name,
                            last_name: userCreated.last_name,
                        },
                    };
                }),
            );
        },
    },
});
</script>
