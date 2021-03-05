import DirectusSDK from '@directus/sdk-js';
import localforage from 'localforage';
import { AuthOptions, ItemsHandler } from '@directus/sdk-js/dist/types/handlers';

export default class Api extends DirectusSDK {
    private static API_URL = 'https://cms.settler.tech/';
    private static instance: Api;

    private constructor(
        url: string,
        options?: {
            auth: Partial<AuthOptions>;
        },
    ) {
        super(url, options);
    }

    items(collection: string): ItemsHandler {
        super
            .items(collection)
            .read()
            .catch(() => {
                localforage.removeItem('directus_access_token');
                localforage.removeItem('directus_access_token_expires');
                localforage.removeItem('directus_refresh_token');

                return super.items(collection).read();
            });

        return super.items(collection);
    }

    public static getInstance(): Api {
        if (!Api.instance) {
            Api.instance = new Api(Api.API_URL, {
                auth: {
                    storage: localforage,
                    mode: 'json',
                    autoRefresh: true,
                },
            });
        }

        return Api.instance;
    }

    get logged(): boolean {
        return this.auth.token !== null;
    }
}
