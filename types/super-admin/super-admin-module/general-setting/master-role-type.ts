export interface IMasterRoleType {
    id: number;
    roleType: string;
    name: string;
    masterRoleId?: number;
    institutionType: string;
    activeFlag: number;
    createdDate?: string;
    updatedDate?: string;
}
