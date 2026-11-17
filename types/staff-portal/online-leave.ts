
export interface IOnlineLeaveEmployee {
    hrmE_Id: number;
    hrmE_EmployeeFirstName: string;
    hrmE_DOJ: string;
    hrmdeS_DesignationName: string;
    hrmE_EmailId: string;
    hrmE_MobileNo: string;
}

export interface ILeaveBalance {
    hrelS_Id: number;
    hrmL_Id: number;
    hrmL_LeaveName: string;
    hrelS_TotalLeaves: number;
    hrelS_CBLeaves: number;
    // UI specific fields
    fromDate?: Date;
    toDate?: Date;
    hrelaP_TotalDays?: number;
    cklop?: boolean; // Half day flag
}

export interface ILeaveHistory {
    hrelaP_Id: number;
    hrmL_LeaveName: string;
    hrelaP_LeaveReason: string;
    hrelaP_FromDate: string;
    hrelaP_ToDate: string;
    hreltD_TotDays: number;
    hrelaP_ApplicationStatus: string;
    hrelapA_Remarks: string;
    hrelaP_SupportingDocument: string;
}

export interface IOnlineLeaveInitialData {
    online_leave: IOnlineLeaveEmployee[];
    leave_name: ILeaveBalance[];
    dpcount?: { clCount: number }[];
}

export interface IOnlineLeaveHistoryData {
    leave_name: ILeaveHistory[];
    compoffodgridvalues: any[];
}

export interface ILeaveApplicationRequest {
    HRELAP_ApplicationDate: string;
    HRELAP_LeaveReason: string;
    HRELAP_ContactNoOnLeave: number;
    HRELAP_ReportingDate: string;
    HRELT_SupportingDocument: string;
    temp_table_data: ILeaveBalance[];
    frmToDates: {
        HRELAP_FromDate: string;
        HRELAP_ToDate: string;
        HRELAP_TotalDays: number;
    }[];
}

export interface ILeaveRequestExtraPayload {
    HRELAP_ApplicationDate: string;
    HRELAP_FromDate: string;
    HRELAP_ToDate: string;
    HRELAP_TotalDays: number;
    HRELAP_LeaveReason: string;
    HRELAP_ContactNoOnLeave: number;
    HRELAP_ReportingDate: string;
    HRELT_SupportingDocument: string;
    HRML_LeaveType: string;
    HRELAPD_InTime: string;
    HRELAPD_OutTime: string;
}
