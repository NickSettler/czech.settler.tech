<template>
    <v-app id="inspire">
        <v-app-bar
            app
            color="white"
            flat
            extended
        >
            <v-container class="py-0 fill-height">
                <v-avatar
                    class="mr-10"
                    color="grey darken-1"
                    size="32"
                ></v-avatar>

                <v-spacer></v-spacer>

                <v-responsive max-width="260" class="mr-6" v-if="!$vuetify.breakpoint.xs">
                    <v-text-field
                        dense
                        flat
                        hide-details
                        rounded
                        solo-inverted
                    ></v-text-field>
                </v-responsive>

                <LoginDialog/>

                <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </v-container>
        </v-app-bar>

        <v-main class="grey lighten-3">
            <v-container>
                <v-row>
                    <v-col :cols="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? 12 : 2">
                        <v-sheet rounded="lg">
                            <v-list color="transparent" dense>
                                <v-list-item link to="/">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Main
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item link to="/lists">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Lists
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-divider class="my-2"></v-divider>

                                <v-list-item to="/help" link>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Help
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-sheet>
                    </v-col>

                    <v-col>
                        <v-sheet class="pa-4" min-height="70vh" rounded="lg">
                            <router-view/>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>
<script>
import LoginDialog from "@/components/LoginDialog";

export default {
    components: {LoginDialog},
}
</script>