/**
 * Online Leave Application Types
 * API: /api/OnlineLeaveApplication/*
 */

/**
 * Employee Leave Details
 */
export interface EmployeeLeaveDetail {
    hrelS_Id: number;
    hrmL_LeaveName: string;
    hrmL_LeaveCode: string;
    hrelS_TotalLeaves: number;
    hrelS_CreditedLeaves: number;
    hrelS_TransLeaves: number;
    hrelS_CBLeaves: number;
    hrmL_Id: number;
    hrmE_Id: number;
    hrmL_WhenToApplyFlg: string | null;
    hrmL_NoOfDays: number | null;
}

/**
 * Employee Details
 */
export interface EmployeeDetail {
    hrmE_Id: number;
    hrmE_EmployeeName: string;
    hrmE_DOJ: string;
    hrmE_MobileNo: number;
    hrmE_EmailId: string;
    hrmdeS_DesignationName: string;
    hrmE_EmployeeCode: string;
    hrelapD_OutTime: string;
    hrelapD_InTime: string;
}

/**
 * Leave Count
 */
export interface LeaveCount {
    hrmL_LeaveName: string;
    clCount: number;
}

/**
 * Get Employee Leave Details Response
 */
export interface GetEmployeeLeaveDetailsResponse {
    employeeLeaveDetails: EmployeeLeaveDetail[];
    employeeDetails: EmployeeDetail[];
    leaveCount: LeaveCount[];
}

/**
 * Employee Leave Status Detail
 */
export interface EmployeeLeaveStatusDetail {
    hrelaP_Id: number;
    hrmL_LeaveName: string;
    hrelaP_FromDate: string;
    hrelaP_ToDate: string;
    hreltD_TotDays: number;
    hrelaP_TotalDays: number;
    hrelaP_ApplicationStatus: string;
    hrmL_Id: number;
    hrelaP_LeaveReason: string;
    hrelapA_Remarks: string | null;
    hrelaP_SupportingDocument: string;
}

/**
 * Leave Application Grid Detail
 */
export interface LeaveApplicationGridDetail {
    hrmE_EmployeeFirstName: string;
    hrmL_LeaveName: string;
    hrmL_LeaveType: string;
    hrelaP_ApplicationDate: string;
    hrelaP_FromDate: string;
    hrelaP_ToDate: string;
    hrelaP_TotalDays: number;
    hrelaP_LeaveReason: string;
    hrelaP_ApplicationStatus: string;
    hrelapD_InTime: string | null;
    hrelapD_OutTime: string | null;
}

/**
 * Get Employee Leave Status Details Response
 */
export interface GetEmployeeLeaveStatusDetailsResponse {
    employeeLeaveDetails: EmployeeLeaveStatusDetail[];
    leaveApplicationGridDetails: LeaveApplicationGridDetail[];
}

/**
 * From To Date
 */
export interface FromToDate {
    HRELAP_FromDate: string;
    HRELAP_ToDate: string;
    HRELAP_TotalDays: number;
}

/**
 * Temp Table Data
 */
export interface TempTableData {
    HRML_Id: number;
    HRML_LeaveName: string;
    HRELS_Id: number;
    HRELS_CBLeaves: number;
}

/**
 * Save Online Leave Application Request
 */
export interface SaveOnlineLeaveApplicationRequest {
    HRME_Id: number;
    asmay_id: number;
    HRELAP_ApplicationID: string | null;
    HRELAP_LeaveReason: string;
    HRELT_LeaveReason: string;
    HRELT_Reportingdate: string;
    HRELT_SupportingDocument: string;
    frmToDates: FromToDate[];
    temp_table_data: TempTableData[];
}

/**
 * Frontend model for Leave Balance (for table display)
 */
export interface LeaveBalance {
    id: number;
    leaveName: string;
    leaveCode: string;
    totalLeaves: number;
    creditedLeaves: number;
    transLeaves: number;
    balance: number;
    leaveId: number;
    employeeId: number;
    fromDate?: Date;
    toDate?: Date;
    noOfDays?: number;
}

/**
 * Frontend model for Leave Application (for table display)
 */
export interface LeaveApplication {
    id: number;
    leaveName: string;
    leaveReason: string;
    fromDate: Date;
    toDate: Date;
    totalDays: number;
    status: string;
    remarks: string | null;
    document: string;
}
