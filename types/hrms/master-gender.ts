export interface MasterGenderResponse {
    success?: boolean;
    message?: string;
    data?: GenderItem[] | {
        genderList: GenderItem[];
    };
    genderList?: GenderItem[];
    retrunMsg?: string;
    roleId?: number;
    IVRMMG_Id?: number;
    MI_Id?: number;
    IVRMMG_GenderName?: string | null;
    IVRMMG_ActiveFlag?: boolean;
    CreatedDate?: string | null;
    UpdatedDate?: string | null;
    total?: number;
    page?: number;
    page_size?: number;
}

export interface GenderItem {
    IVRMMG_Id: number;
    MI_Id: number;
    IVRMMG_GenderName: string;
    IVRMMG_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface MasterGenderInput {
    IVRMMG_Id?: number;
    MI_Id: number;
    IVRMMG_GenderName: string;
    IVRMMG_ActiveFlag: boolean;
}
