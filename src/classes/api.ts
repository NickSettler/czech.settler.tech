import { Directus, Auth, AxiosTransport, DirectusOptions, LocalStorage } from '@directus/sdk';

export default class Api extends Directus<DirectusOptions> {
    private static API_URL = 'https://cms.settler.tech/';
    private static instance: Api;

    private constructor(url: string, options?: DirectusOptions) {
        super(url, options);
    }

    public static getInstance(): Api {
        if (!Api.instance) {
            const storage = new LocalStorage();
            const transport = new AxiosTransport(Api.API_URL, storage);

            const auth: Auth = new Auth(transport, storage, {
                mode: 'json',
            });

            Api.instance = new Api(Api.API_URL, {
                auth,
                storage,
                transport,
            });
        }

        return Api.instance;
    }

    get logged(): boolean {
        return this.auth.token !== null;
    }
}
