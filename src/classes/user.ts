import Api from '@/classes/api';
import { PartialItem } from '@directus/sdk';
import store from '@/store';

export type UserDataStore = {
    adminAccessNeeded: boolean;
};

export const DefaultUserDataStoreOptions: UserDataStore = {
    adminAccessNeeded: false,
};

export default class UserController {
    public static async getUserData() {
        return await Api.getInstance().users.me.read();
    }

    public static async storeUserData({ adminAccessNeeded }: UserDataStore = DefaultUserDataStoreOptions) {
        if (adminAccessNeeded)
            return await UserController.getUserData()
                .then((userData: PartialItem<any>) => {
                    return store.dispatch('setUserData', userData);
                })
                .then(() => {
                    return Api.getInstance().roles.readOne(store.state.auth.userData.role);
                })
                .then((role: PartialItem<any> | null | undefined) => {
                    return store.dispatch('setUserData', {
                        ...store.state.auth.userData,
                        admin_access: role.admin_access,
                    });
                });

        return await UserController.getUserData().then((userData: PartialItem<any>) => {
            store.dispatch('setUserData', userData);
        });
    }
}
