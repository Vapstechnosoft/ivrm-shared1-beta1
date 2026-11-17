export interface MasterGroupTypeResponse {
    success?: boolean;
    message?: string;
    data?: GroupTypeDetail[] | {
        grouptypeList: GroupTypeDetail[];
    };
    grouptypeList?: GroupTypeDetail[];
    retrunMsg?: string;
    total?: number;
    page?: number;
    page_size?: number;
}

export interface GroupTypeDetail {
    HRMGT_Id: number;
    MI_Id: number;
    HRMGT_EmployeeGroupType: string;
    HRMGT_Code: string;
    HRMGT_Order: number;
    HRMGT_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface MasterGroupTypeInput {
    HRMGT_Id?: number;
    MI_Id: number;
    HRMGT_EmployeeGroupType: string;
    HRMGT_Code: string;
    HRMGT_Order?: number;
    HRMGT_ActiveFlag: boolean;
}

export interface GroupTypeSetOrderList {
    HRMGT_Id: number;
    HRMGT_EmployeeGroupType: string;
    HRMGT_Order: number;
}
