<template>
    <div>
        <v-menu offset-y left close-on-content-click close-on-click>
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon @click.stop.prevent="" v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </template>
            <v-list>
                <ConfirmDeleteListDialog :list="this.$props.list" :success-handler="this.$props.successHandler" />
            </v-list>
        </v-menu>
    </div>
</template>

<script>
import ConfirmDeleteListDialog from '@/components/ConfirmDeleteListDialog';
export default {
    name: 'ListMenu',
    components: { ConfirmDeleteListDialog },
    props: ['list', 'successHandler'],
};
</script>

<style scoped></style>
