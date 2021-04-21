export enum AUTH_TOKEN_KEYS {
    TOKEN = 'auth_token',
    EXPIRES = 'auth_expires',
    REFRESH_TOKEN = 'auth_refresh_token',
}

export default class AuthController {
    public static clearTokenData() {
        return new Promise<boolean>((resolve) => {
            localStorage.removeItem(AUTH_TOKEN_KEYS.TOKEN);
            localStorage.removeItem(AUTH_TOKEN_KEYS.EXPIRES);
            localStorage.removeItem(AUTH_TOKEN_KEYS.REFRESH_TOKEN);

            resolve(true);
        });
    }
}
