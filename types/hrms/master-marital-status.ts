export interface MasterMaritalStatusResponse {
    success?: boolean;
    message?: string;
    data?: MaritalStatusDetail[] | {
        maritalstatusList: MaritalStatusDetail[];
    };
    maritalstatusList?: MaritalStatusDetail[];
    retrunMsg?: string;
    roleId?: number;
    IVRMMMS_Id?: number;
    MI_Id?: number;
    IVRMMMS_MaritalStatus?: string | null;
    IVRMMMS_ActiveFlag?: boolean | null;
    CreatedDate?: string | null;
    UpdatedDate?: string | null;
    total?: number;
    page?: number;
    page_size?: number;
}

export interface MaritalStatusDetail {
    IVRMMMS_Id: number;
    MI_Id: number;
    IVRMMMS_MaritalStatus: string;
    IVRMMMS_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface MasterMaritalStatusInput {
    IVRMMMS_Id?: number;
    MI_Id: number;
    IVRMMMS_MaritalStatus: string;
    IVRMMMS_ActiveFlag: boolean;
}
