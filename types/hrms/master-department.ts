export interface MasterDepartmentResponse {
    success?: boolean;
    message?: string;
    data?: DepartmentDetail[] | {
        departmentList: DepartmentDetail[];
    };
    departmentList?: DepartmentDetail[];
    retrunMsg?: string;
    HRMDC_ID?: any;
    roleId?: number;
    HRMD_Id?: number;
    MI_Id?: number;
    HRMD_DepartmentName?: string | null;
    HRMD_Order?: number | null;
    HRMD_ActiveFlag?: boolean;
    HRMD_InternalTrainingMinimumHrs?: number | null;
    DeraptmentDTO?: any;
    CreatedDate?: string | null;
    UpdatedDate?: string | null;
    total?: number;
    page?: number;
    page_size?: number;
}

export interface DepartmentDetail {
    HRMD_Id: number;
    MI_Id: number;
    HRMD_DepartmentName: string;
    HRMD_Order: number;
    HRMD_ActiveFlag: boolean;
    HRMDC_ID: any;
    HRMD_InternalTrainingMinimumHrs: number;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface MasterDepartmentInput {
    HRMD_Id?: number;
    MI_Id: number;
    HRMD_DepartmentName: string;
    HRMD_Order?: number;
    HRMD_ActiveFlag: boolean;
    HRMD_InternalTrainingMinimumHrs: number;
}

export interface OnloadGetDepartmentDetailsRequest {
    CreatedDate?: string;
    UpdatedDate?: string;
    HRMD_Id: number;
    MI_Id: number;
    HRMD_DepartmentName: string;
    HRMD_Order: number;
    HRMD_ActiveFlag: boolean;
    departmentList: Array<{
        HRMD_Id: number;
        MI_Id: number;
        HRMD_DepartmentName: string;
        HRMD_Order: number;
        HRMD_ActiveFlag: boolean;
        HRMDC_ID: any;
        HRMD_InternalTrainingMinimumHrs: number;
    }>;
    retrunMsg: string;
    HRMDC_ID: number;
    roleId: number;
    HRMD_InternalTrainingMinimumHrs: number;
    DeraptmentDTO: Array<{
        HRMD_Id: number;
        MI_Id: number;
        HRMD_DepartmentName: string;
        HRMD_Order: number;
        HRMD_ActiveFlag: boolean;
        HRMDC_ID: any;
        HRMD_InternalTrainingMinimumHrs: number;
    }>;
}

export interface SaveDepartmentRequest {
    CreatedDate: string;
    UpdatedDate: string;
    HRMD_Id: number;
    MI_Id: number;
    HRMD_DepartmentName: string;
    HRMD_Order: number;
    HRMD_ActiveFlag: boolean;
    departmentList: Array<{
        CreatedDate: string;
        UpdatedDate: string;
        HRMD_Id: number;
        MI_Id: number;
        HRMD_DepartmentName: string;
        HRMD_Order: number;
        HRMD_ActiveFlag: boolean;
        HRMD_InternalTrainingMinimumHrs: number;
    }>;
    retrunMsg: string;
    HRMDC_ID: number;
    roleId: number;
    HRMD_InternalTrainingMinimumHrs: number;
    DeraptmentDTO: any[];
}

export interface DepartmentSetOrderList {
    HRMD_Id: number;
    HRMD_DepartmentName: string;
    HRMD_Order: number;
}
