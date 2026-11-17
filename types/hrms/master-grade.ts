export interface MasterGradeResponse {
    success?: boolean;
    message?: string;
    data?: GradeDetail[] | {
        gradelList: GradeDetail[];
    };
    gradelList?: GradeDetail[];
    retrunMsg?: string;
    roleId?: number;
    HRMG_Id?: number;
    MI_Id?: number;
    HRMG_GradeName?: string | null;
    HRMG_GradeDisplayName?: string | null;
    HRMG_PayScaleRange?: string | null;
    HRMG_PayScaleFrom?: number;
    HRMG_IncrementOf?: number;
    HRMG_PayScaleTo?: number;
    HRMG_Order?: number | null;
    HRMG_ActiveFlag?: boolean;
    GradeDTO?: any;
    CreatedDate?: string | null;
    UpdatedDate?: string | null;
    total?: number;
    page?: number;
    page_size?: number;
}

export interface GradeDetail {
    HRMG_Id: number;
    MI_Id: number;
    HRMG_GradeName: string;
    HRMG_GradeDisplayName: string;
    HRMG_PayScaleRange: string;
    HRMG_PayScaleFrom: number;
    HRMG_IncrementOf: number;
    HRMG_PayScaleTo: number;
    HRMG_Order: number;
    HRMG_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface MasterGradeInput {
    HRMG_Id?: number;
    MI_Id: number;
    HRMG_GradeName: string;
    HRMG_GradeDisplayName: string;
    HRMG_PayScaleFrom: number;
    HRMG_IncrementOf: number;
    HRMG_PayScaleTo: number;
    HRMG_Order?: number;
    HRMG_ActiveFlag: boolean;
}

export interface OnchangeGradeDetailsRequest {
    CreatedDate?: string;
    UpdatedDate?: string;
    HRMG_Id: number;
    MI_Id: number;
    HRMG_GradeName: string;
    HRMG_GradeDisplayName: string;
    HRMG_PayScaleRange: string;
    HRMG_PayScaleFrom: number;
    HRMG_IncrementOf: number;
    HRMG_PayScaleTo: number;
    HRMG_Order: number;
    HRMG_ActiveFlag: boolean;
    gradelList: any[];
    retrunMsg: string;
    roleId: number;
    GradeDTO: any[];
}

export interface GradeSetOrderList {
    HRMG_Id: number;
    HRMG_GradeName: string;
    HRMG_Order: number;
}
