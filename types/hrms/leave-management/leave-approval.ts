/**
 * Leave Approval API Types
 * Types for the Leave Approval API endpoints
 */

/**
 * Request payload for GetApprovalStatus endpoint
 * POST /api/LeaveApprovalFacade/GetApprovalStatus
 */
export interface GetApprovalStatusRequest {
    MI_Id: number;
}

/**
 * Response data structure from GetApprovalStatus endpoint
 * This will contain leave approval status data
 */
export interface GetApprovalStatusResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: any[];
    approvalList?: any[];
    leaveApprovalList?: any[];
    pendingLeaves?: any[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure
 */
export interface GetApprovalStatusResponse {
    success: boolean;
    message: string;
    data: GetApprovalStatusResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Leave status item in get_leave_status array
 * This is a complex nested structure
 */
export interface LeaveStatusItem {
    [key: string]: any;
    // Key fields that might be present
    HRELAP_Id?: number;
    HRME_Id?: number;
    HRML_Id?: number;
    HRELT_Status?: string;
    HRELTD_FromDate?: string;
    HRELTD_ToDate?: string;
    HRELAPA_Remarks?: string;
    MI_Id?: number;
}

/**
 * Request payload for GetStatusAsync endpoint
 * POST /api/LeaveApprovalFacade/GetStatusAsync
 */
export interface GetStatusAsyncRequest {
    MI_Id: number;
    retrunMsg?: string;
    HRME_Id?: number;
    HRELTD_FromDate?: string;
    HRELTD_ToDate?: string;
    HRELT_Status?: string;
    LoginId?: number;
    HRELAPA_Remarks?: string;
    get_leave_status?: LeaveStatusItem[];
}

/**
 * Response data structure from GetStatusAsync endpoint
 */
export interface GetStatusAsyncResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: any[];
    approvalList?: any[];
    leaveApprovalList?: any[];
    get_leave_status?: any[];
    get_leavestatus?: any[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetStatusAsync
 */
export interface GetStatusAsyncResponse {
    success: boolean;
    message: string;
    data: GetStatusAsyncResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for RejectStatusAsync endpoint
 * POST /api/LeaveApprovalFacade/RejectStatusAsync
 */
export interface RejectStatusAsyncRequest {
    MI_Id: number;
    LoginId: number;
    HRELAPA_Remarks: string;
    get_leave_status: LeaveStatusItem[];
}

/**
 * Response data structure from RejectStatusAsync endpoint
 */
export interface RejectStatusAsyncResponseData {
    [key: string]: any;
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
    returnval_Update?: boolean;
}

/**
 * Full API response structure for RejectStatusAsync
 */
export interface RejectStatusAsyncResponse {
    success: boolean;
    message: string;
    data: RejectStatusAsyncResponseData | null;
    retrunMsg?: string;
    returnval?: boolean;
    returnval_Update?: boolean;
}

/**
 * Request payload for GetApprovedLeave endpoint
 * POST /api/LeaveApprovalFacade/GetApprovedLeave
 */
export interface GetApprovedLeaveRequest {
    MI_Id: number;
    LoginId: number;
}

/**
 * Response data structure from GetApprovedLeave endpoint
 */
export interface GetApprovedLeaveResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: any[];
    approvedLeaves?: any[];
    leaveApprovalList?: any[];
    approvedLeaveList?: any[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetApprovedLeave
 */
export interface GetApprovedLeaveResponse {
    success: boolean;
    message: string;
    data: GetApprovedLeaveResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for ViewLeaveBalanceHistory endpoint
 * POST /api/LeaveApprovalFacade/ViewLeaveBalanceHistory
 */
export interface ViewLeaveBalanceHistoryRequest {
    HRME_Id: number;
}

/**
 * Response data structure from ViewLeaveBalanceHistory endpoint
 */
export interface ViewLeaveBalanceHistoryResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: any[];
    leaveBalanceHistory?: any[];
    balanceHistory?: any[];
    leaveHistory?: any[];
    historyList?: any[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for ViewLeaveBalanceHistory
 */
export interface ViewLeaveBalanceHistoryResponse {
    success: boolean;
    message: string;
    data: ViewLeaveBalanceHistoryResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for GetRequestStatus endpoint
 * POST /api/LeaveApprovalFacade/GetRequestStatus
 */
export interface GetRequestStatusRequest {
    MI_Id: number;
    LoginId: number;
}

/**
 * Response data structure from GetRequestStatus endpoint
 */
export interface GetRequestStatusResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: any[];
    requestStatusList?: any[];
    statusList?: any[];
    leaveRequestStatus?: any[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetRequestStatus
 */
export interface GetRequestStatusResponse {
    success: boolean;
    message: string;
    data: GetRequestStatusResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Document item in doc_list2 array
 */
export interface DocListItem {
    HRELAPA_Remarks: string;
    HRELAPD_InTime: string;
    HRELAPD_OutTime: string;
    Status: string;
    HRELAP_Id: number;
    HRME_Id: number;
}

/**
 * Request payload for GetApproveStatusAsync endpoint
 * POST /api/LeaveApprovalFacade/GetApproveStatusAsync
 */
export interface GetApproveStatusAsyncRequest {
    LoginId: number;
    MI_Id: number;
    doc_list2: DocListItem[];
}

/**
 * Response data structure from GetApproveStatusAsync endpoint
 */
export interface GetApproveStatusAsyncResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: any[];
    approveStatusList?: any[];
    statusList?: any[];
    approvalStatus?: any[];
    doc_list2?: DocListItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
    returnval_Update?: boolean;
}

/**
 * Full API response structure for GetApproveStatusAsync
 */
export interface GetApproveStatusAsyncResponse {
    success: boolean;
    message: string;
    data: GetApproveStatusAsyncResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for GetPeriodApprovalStatus endpoint
 * POST /api/LeaveApprovalFacade/GetPeriodApprovalStatus
 */
export interface GetPeriodApprovalStatusRequest {
    MI_Id: number;
    LoginId: number;
}

/**
 * Response data structure from GetPeriodApprovalStatus endpoint
 */
export interface GetPeriodApprovalStatusResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: any[];
    periodApprovalStatus?: any[];
    approvalStatusList?: any[];
    periodStatusList?: any[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetPeriodApprovalStatus
 */
export interface GetPeriodApprovalStatusResponse {
    success: boolean;
    message: string;
    data: GetPeriodApprovalStatusResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for PeriodLeaveStatus endpoint
 * POST /api/LeaveApprovalFacade/PeriodLeaveStatus
 */
export interface PeriodLeaveStatusRequest {
    HRELAPDD_ApprovalFlg: string;
    HRELAPDD_Remarks: string;
    LoginId: number;
    get_leave_status: LeaveStatusItem[];
}

/**
 * Response data structure from PeriodLeaveStatus endpoint
 */
export interface PeriodLeaveStatusResponseData {
    [key: string]: any;
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
    returnval_Update?: boolean;
    periodLeaveStatus?: any[];
    statusList?: any[];
}

/**
 * Full API response structure for PeriodLeaveStatus
 */
export interface PeriodLeaveStatusResponse {
    success: boolean;
    message: string;
    data: PeriodLeaveStatusResponseData | null;
    retrunMsg?: string;
    returnval?: boolean;
    returnval_Update?: boolean;
}

/**
 * Leave Approval Grid Item
 */
export interface LeaveApprovalGridItem {
    hrmE_Id: number;
    hrelaP_Id: number;
    hrmE_FullName: string;
    hrmL_LeaveName: string;
    hreltD_FromDate: string;
    hrelaP_FromDate: string;
    hreltD_ToDate: string;
    hrelaP_ToDate: string;
    hreltD_TotDays: number;
    hrelapD_TotalDays: number;
    hrmE_EmployeeCode: string;
    hrelT_Status: string;
    hrelapD_LeaveStatus: string;
    hrelapA_Remarks: string | null;
    rejectionFlag: number;
}

/**
 * Approve or Reject Leave Status Request
 */
export interface ApproveRejectLeaveStatusRequest {
    approveRejectType: string;
    hrmE_Id: number;
    hreltD_FromDate: string;
    hreltD_ToDate: string;
    get_leave_status: {
        hrelaP_Id: number;
        hrelT_Status: string;
        hrelapA_Remarks: string;
    }[];
}

/**
 * Leave Balance History Item
 */
export interface LeaveBalanceHistoryItem {
    empName: string;
    empLeaveType: string;
    empCreatedLeaves: number;
    empUsedLeaves1: number;
    empBalanceLeaves: number;
    empUsedLeaves: number;
}

