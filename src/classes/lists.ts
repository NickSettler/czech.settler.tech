import Api from '@/classes/api';
import { PartialItem, QueryMany } from '@directus/sdk';
import { VariableModel } from '@/classes/types/directus';

export default class ListsController {
    private static readonly tableName: string = 'lists';

    public static async getLists(
        query: QueryMany<VariableModel>,
        callback: (() => unknown) | false = false,
    ): Promise<PartialItem<VariableModel>> {
        if (callback)
            Api.getInstance()
                .items(ListsController.tableName)
                .readMany(query as QueryMany<unknown>)
                .then(callback);
        else
            return (
                await Api.getInstance()
                    .items(ListsController.tableName)
                    .readMany(query as QueryMany<unknown>)
            ).data as PartialItem<unknown>;
    }
}
