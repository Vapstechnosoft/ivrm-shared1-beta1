// Types for Religion Category Mapping

export interface ReligionItem {
    IVRMMR_Id: number;
    IVRMMR_Name: string;
    Is_Active: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface CasteItem {
    IMCC_Id: number;
    IMCC_CategoryName: string;
    IMCC_CategoryCode: string;
    IMCC_CategoryDesc: string;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface CastIdItem {
    casteId: number;
}

export interface ReligionCategoryMappingDetail {
    IRCC_Id: number;
    MI_Id: number;
    UserId: number;
    IVRMMR_Id: number;
    IMCC_Id: number;
    IRCC_ActiveFlg: boolean;
    IRCC_CreatedBy: number;
    IRCC_UpdatedBy: number;
    IRCC_CreatedDate: string;
    IRCC_UpdatedDate: string;
    religion_list: any;
    get_masterlist: any;
    caste_list: any;
    editlist: any;
    returnval: boolean;
    castid: any;
    duplicate: boolean;
    IVRMMR_Name: string;
    IMCC_CategoryName: string;
    msg: any | null;
    categoryids?: number[];
}

export interface ReligionCategoryMappingResponse {
    success?: boolean;
    message?: string;
    data?: ReligionCategoryMappingDetail[] | {
        mapping?: ReligionCategoryMappingDetail[];
        religion_list?: ReligionItem[];
        caste_list?: CasteItem[];
        get_masterlist?: ReligionCategoryMappingDetail[];
    };
    get_masterlist?: ReligionCategoryMappingDetail[];
    IRCC_Id?: number;
    MI_Id?: number;
    UserId?: number;
    IVRMMR_Id?: number;
    IMCC_Id?: number;
    IRCC_ActiveFlg?: boolean;
    IRCC_CreatedBy?: number;
    IRCC_UpdatedBy?: number;
    IRCC_CreatedDate?: string;
    IRCC_UpdatedDate?: string;
    religion_list?: ReligionItem[];
    caste_list?: CasteItem[];
    editlist?: any[];
    returnval?: boolean;
    castid?: CastIdItem[];
    duplicate?: boolean;
    IVRMMR_Name?: string;
    IMCC_CategoryName?: string;
    msg?: string;
    total?: number;
    page?: number;
    page_size?: number;
}

export interface ReligionCategoryMappingRequest {
    IRCC_Id: number;
    MI_Id: number;
    UserId: number;
    IVRMMR_Id: number;
    IMCC_Id: number;
    IRCC_ActiveFlg: boolean;
    IRCC_CreatedBy: number;
    IRCC_UpdatedBy: number;
    IRCC_CreatedDate: string;
    IRCC_UpdatedDate: string;
    religion_list: ReligionItem[];
    get_masterlist: any[];
    caste_list: CasteItem[];
    editlist: any[];
    returnval: boolean;
    castid: CastIdItem[];
    duplicate: boolean;
    IVRMMR_Name: string;
    IMCC_CategoryName: string;
    msg: string;
}

export interface ReligionCategoryMappingInput {
    IRCC_Id?: number;
    MI_Id?: number;
    UserId?: number;
    IVRMMR_Id: number;
    IMCC_Id?: number;
    categoryids?: number[];
    IRCC_ActiveFlg?: boolean;
    IRCC_CreatedBy?: number;
    IRCC_UpdatedBy?: number;
    IRCC_CreatedDate?: string;
    IVRMMR_Name?: string;
    IMCC_CategoryName?: string;
    IMCC_CategoryCode?: string;
    IMCC_CategoryDesc?: string;
}
