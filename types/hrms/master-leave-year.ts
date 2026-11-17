export interface MasterLeaveYearResponse {
    success?: boolean;
    message?: string;
    data?: LeaveYearDetail[] | MasterLeaveYearData;
    leaveYearList?: LeaveYearDetail[];
    retrunMsg?: string;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

export interface MasterLeaveYearData {
    HRMLY_Id: number;
    MI_Id: number;
    HRMLY_LeaveYear: string;
    HRMLY_FromDate: string;
    HRMLY_ToDate: string;
    HRMLY_ActiveFlag: boolean;
    leaveYearList?: LeaveYearDetail[];
    retrunMsg?: string;
    roleId?: number;
    ASMAY_From_Date?: string | null;
    ASMAY_To_Date?: string | null;
    HRMLY_LeaveYearOrder?: number;
    yeardetailList?: LeaveYearDetail[];
    LeaveorderDTO?: any | null;
    CreatedDate?: string;
    UpdatedDate?: string;
}

export interface LeaveYearDetail {
    HRMLY_Id: number;
    MI_Id: number;
    HRMLY_LeaveYear: string;
    HRMLY_FromDate: string;
    HRMLY_ToDate: string;
    HRMLY_ActiveFlag: boolean;
    HRMLY_LeaveYearOrder: number;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface MasterLeaveYearInput {
    HRMLY_Id?: number;
    MI_Id: number;
    HRMLY_LeaveYear: string;
    HRMLY_FromDate: string;
    HRMLY_ToDate: string;
    HRMLY_ActiveFlag: boolean;
    HRMLY_LeaveYearOrder?: number;
    CreatedDate?: string;
    UpdatedDate?: string;
}

export interface LeaveYearSetOrderList {
    HRMLY_Id: number;
    HRMLY_LeaveYear: string;
    HRMLY_LeaveYearOrder: number;
}
