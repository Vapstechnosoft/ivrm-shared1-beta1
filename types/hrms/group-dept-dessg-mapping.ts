// Types for Group Department Designation Mapping

export interface GroupTypeDropdown {
    HRMGT_Id: number;
    MI_Id: number;
    HRMGT_EmployeeGroupType: string;
    HRMGT_Code: string;
    HRMGT_Order: number;
    HRMGT_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface DepartmentDropdown {
    HRMD_Id: number;
    MI_Id: number;
    HRMD_DepartmentName: string;
    HRMD_Code: string;
    HRMD_Order: number;
    HRMD_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface DesignationDropdown {
    HRMDES_Id: number;
    MI_Id: number;
    HRMDES_DesignationName: string;
    HRMDES_DisplayName: string;
    HRMDES_Code: string;
    HRMDES_Order: number;
    HRMDES_ActiveFlg: boolean;
    HRMDES_AliasName: string;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface GroupDeptDessgMappingDetail {
    HRGTDDS_Id: number;
    MI_Id: number;
    HRMGT_Id: number;
    HRMD_Id: number;
    HRMDES_Id: number;
    HRGTDDS_ActiveFlg: boolean;
    HRGTDDS_CreatedBy: number;
    HRGTDDS_UpdatedBy: number;
    HRGTDDS_CreatedDate: string;
    HRGTDDS_UpdatedDate: string;
    HRMGT_EmployeeGroupType: string;
    HRMD_DepartmentName: string;
    HRMDES_DesignationName: string;
    designationids?: number[]; // Optional: array of designation IDs for multi-select support
    returnval: boolean;
    msg: string | null;
}

export interface GroupDeptDessgMappingResponse {
    success?: boolean;
    message?: string;
    data?: GroupDeptDessgMappingDetail[] | {
        gridviewdata?: GroupDeptDessgMappingDetail[];
        groupTypedropdown?: GroupTypeDropdown[];
        departmentdropdown?: DepartmentDropdown[];
        designationdropdown?: DesignationDropdown[];
        HRGTDDS_Id?: number;
        MI_Id?: number;
        HRMGT_Id?: number;
        HRMD_Id?: number;
        HRMDES_Id?: number;
        HRGTDDS_ActiveFlg?: boolean;
        HRGTDDS_CreatedBy?: number;
        HRGTDDS_UpdatedBy?: number;
        HRGTDDS_CreatedDate?: string;
        HRGTDDS_UpdatedDate?: string;
        designationids?: any;
        LogInUserId?: number;
        HRMGT_EmployeeGroupType?: string | null;
        HRMD_DepartmentName?: string | null;
        HRMDES_DesignationName?: string | null;
        returnval?: boolean;
        msg?: string | null;
    };
    gridviewdata?: GroupDeptDessgMappingDetail[];
    HRGTDDS_Id?: number;
    MI_Id?: number;
    HRMGT_Id?: number;
    HRMD_Id?: number;
    HRMDES_Id?: number;
    HRGTDDS_ActiveFlg?: boolean;
    HRGTDDS_CreatedBy?: number;
    HRGTDDS_UpdatedBy?: number;
    HRGTDDS_CreatedDate?: string;
    HRGTDDS_UpdatedDate?: string;
    groupTypedropdown?: GroupTypeDropdown[];
    departmentdropdown?: DepartmentDropdown[];
    designationdropdown?: DesignationDropdown[];
    editlist?: any;
    designationids?: any;
    LogInUserId?: number;
    HRMGT_EmployeeGroupType?: string | null;
    HRMD_DepartmentName?: string | null;
    HRMDES_DesignationName?: string | null;
    returnval?: boolean;
    msg?: string | null;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

export interface GroupDeptDessgMappingInput {
    hrgtddS_Id?: number;
    mI_Id: number;
    hrmgT_Id: number;
    hrmD_Id: number;
    hrmdeS_Id: number;
    hrgtddS_ActiveFlg: boolean;
    hrgtddS_CreatedBy?: number;
    hrgtddS_UpdatedBy?: number;
    hrgtddS_CreatedDate?: string;
    hrgtddS_UpdatedDate?: string;
    groupTypedropdown?: any;
    departmentdropdown?: any;
    designationdropdown?: any;
    gridviewdata?: any;
    editlist?: any;
    designationids?: number[];
    logInUserId?: number;
    hrmgT_EmployeeGroupType?: string | null;
    hrmD_DepartmentName?: string | null;
    hrmdeS_DesignationName?: string | null;
    returnval?: boolean;
    msg?: string | null;
}

export interface LoadDataRequest {
    HRGTDDS_Id: number;
    MI_Id: number;
    HRMGT_Id: number;
    HRMD_Id: number;
    HRMDES_Id: number;
    HRGTDDS_ActiveFlg: boolean;
    HRGTDDS_CreatedBy: number;
    HRGTDDS_UpdatedBy: number;
    HRGTDDS_CreatedDate: string;
    HRGTDDS_UpdatedDate: string;
    groupTypedropdown: any[];
    departmentdropdown: any[];
    designationdropdown: any[];
    gridviewdata: any[];
    designationids: number[];
    LogInUserId: number;
    HRMGT_EmployeeGroupType: string;
    HRMD_DepartmentName: string;
    HRMDES_DesignationName: string;
    returnval: boolean;
    msg: string;
}
