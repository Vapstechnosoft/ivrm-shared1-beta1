/**
 * Apply Leave API Types
 * Types for the Online Leave Application API endpoints
 */

/**
 * Request payload for GetOnlineLeave endpoint
 * POST /api/OnlineLeaveApplicationWrapperFacade/GetOnlineLeave
 */
export interface GetOnlineLeaveRequest {
    MI_Id: number;
    UserId: number;
}

/**
 * Response data structure from GetOnlineLeave endpoint
 * This is a complex nested structure - using any for flexibility
 */
export interface GetOnlineLeaveResponseData {
    [key: string]: any;
    // Common fields that might be present
    online_leave?: any[];
    leaveHistory?: any[];
    GridviewDetails?: any[];
    get_leave_status?: any[];
    get_leavestatus?: any[];
    master_eventlist?: any[];
    leave_name?: any[];
    leavearrayyear?: any[];
    get_emp?: any[];
    get_auth?: any[];
    get_leaveDetails?: any[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure
 */
export interface GetOnlineLeaveResponse {
    success: boolean;
    message: string;
    data: GetOnlineLeaveResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Date range item in frmToDates array
 * This is a very complex nested structure
 */
export interface FrmToDatesItem {
    [key: string]: any;
    // Key fields for leave application
    HRELAP_Id?: number;
    HRELAP_ApplicationID?: string;
    HRELAP_ApplicationDate?: string;
    HRELAP_FromDate?: string;
    HRELAP_ToDate?: string;
    HRELAP_TotalDays?: number;
    HRELAP_LeaveReason?: string;
    HRELAP_ContactNoOnLeave?: number;
    HRELAP_ReportingDate?: string;
    HRELAP_ApplicationStatus?: string;
    HRELAP_SupportingDocument?: string;
    HRME_Id?: number;
    HRML_Id?: number;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    MI_Id?: number;
    UserId?: number;
    approvaluser_array?: ApprovalUserItem[];
    frmToDates?: any[];
    temp_table_data?: any[];
}

/**
 * Approval user item
 */
export interface ApprovalUserItem {
    ApprovalEmpName?: string;
    Approval_HRME_Id: number;
    ApprovalLevelNo: number;
    ApprovalFinalFlag: boolean;
}

/**
 * Request payload for SaveOnlineLeave endpoint
 * POST /api/OnlineLeaveApplicationWrapperFacade/SaveOnlineLeave
 */
export interface SaveOnlineLeaveRequest {
    MI_Id: number;
    UserId: number;
    HRME_Id: number;
    frmToDates: FrmToDatesItem[];
    temp_table_data?: any[];
    HRELT_LeaveReason?: string;
    HRELT_SupportingDocument?: string;
    asmay_id?: number;
}

/**
 * Response from SaveOnlineLeave endpoint
 */
export interface SaveOnlineLeaveResponse {
    success: boolean;
    message: string;
    data: GetOnlineLeaveResponseData | null;
    retrunMsg?: string;
    returnval?: boolean;
    returnval_add?: boolean;
    returnval_Update?: boolean;
}

