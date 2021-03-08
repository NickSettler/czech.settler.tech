export enum MODEL_STATUS {
    PUBLISHED = 'published',
    DRAFT = 'draft',
    ARCHIVED = 'archived',
}

export type CustomModelUser = {
    uuid: string;
    first_name: string;
    last_name: string;
};

export type DefaultModel = {
    id: number;
    status: MODEL_STATUS;
    sort: number;
    user_created: string | CustomModelUser;
    user_updated: string | CustomModelUser;
    date_created: string;
    date_updated: string;
};

export type VariableModel = DefaultModel & {
    [prop: string]: any;
};
