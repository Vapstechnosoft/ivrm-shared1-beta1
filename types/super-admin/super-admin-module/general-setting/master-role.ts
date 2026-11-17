export interface IMasterRole {
    id: number;
    concurrencyStamp: string | null;
    name: string;
    normalizedName: string;
    roleType: string;
    activeFlag: number;
    createdDate: string;
    updatedDate: string;
}

export interface IMasterRoleResponse {
    pagesdata: IMasterRole[];
}
