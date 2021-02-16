<template>
    <div>
        <v-card elevation="2" hover v-for="(list, i) in lists" :key="list.id"
                :class="`${i + 1 !== lists.length ? 'mb-4' : ''}`" :to="`/list/${list.id}`">
            <v-card-text>
                <p class="text-h6">
                    {{ list.name }}
                </p>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import Api from "@/classes/api.ts";

export default {
    name: "Lists",
    async mounted() {
        this.lists = (await Api.getInstance().items('lists').read({
            filter: {
                status: 'published'
            }
        })).data
    },
    data: () => ({
        lists: [],
    })
}
</script>

<style scoped>

</style>