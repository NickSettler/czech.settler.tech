import Api from '@/classes/api';
import { Item, Query } from '@directus/sdk-js/dist/types/types';

export default class ListsController {
    private static readonly tableName: string = 'lists';

    public static async getLists(query: Query, callback: (() => unknown) | false = false): Promise<Item[] | Item> {
        if (callback) Api.getInstance().items(ListsController.tableName).read(query).then(callback);
        else return (await Api.getInstance().items(ListsController.tableName).read(query)).data;
    }
}
