export interface EarningDeductionType {
    HRMEDT_Id: number;
    HRMEDT_EarnDedType: string;
    HRMEDT_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface MasterEarningsDeductionsResponse {
    success: boolean;
    message: string;
    data: {
        HRMED_Id: number;
        MI_Id: number;
        HRMED_Name: string;
        HRMED_EDTypeFlag: string;
        HRMED_EarnDedFlag: string;
        HRMED_AmountPercentFlag: string;
        HRMED_AmountPercent: string;
        HRMED_ActiveFlag: boolean;
        HRMED_RoundOffFlag: string;
        earningdetectionList: EarningsDeductionDetail[];
        retrunMsg: string;
        roleId: number;
        HRMED_ReviseFlg: boolean;
        earningList: EarningsDeductionDetail[];
        detectionList: EarningsDeductionDetail[];
        eardettypelist: EarningDeductionType[];
        eardettypeDropdown: EarningDeductionType[];
        perc_OfDTO: PercOfDTO[];
        selectedearningdetectionList: any[] | null;
        percentOff: string | null;
        HREED_Amount: number | null;
        arrearlist: any[];
        grosslist: any[];
        EarningsDeductionsDTO: any[] | null;
        HRMED_Order: number | null;
    };
    total: number | null;
    page: number | null;
    page_size: number | null;
}

export interface MasterEarningsDeductionsOnloadResponse {
    success: boolean;
    message: string;
    data: {
        HRMED_Id: number;
        MI_Id: number;
        HRMED_Name: string | null;
        HRMED_EDTypeFlag: string | null;
        HRMED_EarnDedFlag: string | null;
        HRMED_AmountPercentFlag: string | null;
        HRMED_AmountPercent: string | null;
        HRMED_ActiveFlag: boolean;
        HRMED_RoundOffFlag: string | null;
        earningdetectionList: EarningsDeductionDetail[] | null;
        retrunMsg: string;
        roleId: number;
        HRMED_ReviseFlg: boolean;
        earningList: EarningsDeductionDetail[] | null;
        detectionList: EarningsDeductionDetail[] | null;
        eardettypelist: EarningDeductionType[] | null;
        eardettypeDropdown: EarningDeductionType[] | null;
        perc_OfDTO: any[] | null;
        selectedearningdetectionList: any[] | null;
        percentOff: string | null;
        HREED_Amount: number | null;
        arrearlist: any[] | null;
        grosslist: any[] | null;
        EarningsDeductionsDTO: any[] | null;
        HRMED_Order: number | null;
    };
    total: number | null;
    page: number;
    page_size: number;
}

export interface MasterEarningsDeductionsOnloadRequest {
    page: number;
    page_size: number;
    search_query: string;
    search_column: string;
    sort_column: string;
    sort_direction: string;
    is_export: boolean;
    MIID: number;
    LoginUserId: number;
    UserRole: string;
}

export interface EarningsDeductionDetail {
    HRMED_Id: number;
    MI_Id: number;
    HRMED_Name: string;
    HRMED_EDTypeFlag: string;
    HRMED_EarnDedFlag: string;
    HRMED_AmountPercentFlag: string;
    HRMED_AmountPercent: string;
    HRMED_ActiveFlag: boolean;
    HRMED_RoundOffFlag: string;
    HRMED_Order: number;
    HRMED_ReviseFlg: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface PercOfDTO {
    HRMEDP_Id: number;
    MI_Id: number;
    HRMED_Id: number;
    HRMEDP_HRMED_Id: number;
}

export interface MasterEarningsDeductionsInput {
    HRMED_Id?: number;
    MI_Id: number;
    HRMED_Name: string;
    HRMED_EDTypeFlag: string;
    HRMED_EarnDedFlag: string;
    HRMED_AmountPercentFlag: string;
    HRMED_AmountPercent: string;
    HRMED_ActiveFlag?: boolean;
    HRMED_RoundOffFlag: string;
    HRMED_Order?: number;
    HRMED_ReviseFlg: boolean;
    perc_OfDTO?: PercOfDTO[];
}

export interface MasterEarningsDeductionsSaveRequest {
    HRMED_Id: number;
    MI_Id: number;
    HRMED_Name: string;
    HRMED_EDTypeFlag: string;
    HRMED_EarnDedFlag: string;
    HRMED_AmountPercentFlag: string;
    HRMED_AmountPercent: string;
    HRMED_RoundOffFlag: string;
    HRMED_ReviseFlg: boolean;
    HRMED_Order?: number;
    perc_OfDTO: PercOfDTO[];
}

export interface EarningsDeductionSetOrderList {
    HRMED_Id: number;
    HRMED_Name: string;
    HRMED_Order: number;
}
