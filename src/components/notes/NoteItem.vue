<template>
    <div>
        <v-card :class="`${final ? 'mb-4' : ''}`" :key="note.id" @contextmenu.prevent="showMenu" @click.stop.prevent="">
            <v-card-title>
                {{ note.name }}
            </v-card-title>
            <v-card-subtitle> {{ note.user_created.first_name }} {{ note.user_created.last_name }} </v-card-subtitle>
        </v-card>
        <v-menu
            v-model="menuVisible"
            absolute
            :position-x="x"
            :position-y="y"
            offset-y
            close-on-click
            close-on-content-click
        >
            <v-list v-model="menuVisible">
                <NoteMenuItem :note="note" :action="deleteNote" :title="`Delete item ${this.$props.note.name}?`">
                    Delete
                </NoteMenuItem>
            </v-list>
        </v-menu>
    </div>
</template>

<script lang="ts">
import NoteMenuItem from '@/components/notes/NoteMenuItem.vue';
import { COLLECTIONS, VariableModel } from '@/classes/types/directus';
import Api from '@/classes/api';
export default {
    name: 'NoteItem',
    components: { NoteMenuItem },
    props: ['note', 'final', 'reloadHandler'],
    data: () => ({
        x: 0,
        y: 0,
        menuVisible: false,
    }),
    methods: {
        showMenu(e: MouseEvent) {
            if (this.menuVisible) {
                this.menuVisible = false;
                return;
            }
            this.menuVisible = false;
            this.x = e.clientX;
            this.y = e.clientY;
            this.$nextTick(() => {
                this.menuVisible = true;
            });
        },
        hideMenu(e: Event) {
            e.stopPropagation();
            e.preventDefault();
            this.menuVisible = false;
        },
        async deleteNote(note: VariableModel) {
            return await Api.getInstance().items(COLLECTIONS.NOTES).deleteOne(note.id).then(this.reloadHandler);
        },
    },
};
</script>

<style scoped></style>
