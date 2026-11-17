/**
 * Leave Transaction Manual Types
 * API: /api/LeaveTransactionManual/get_onload_leave_transaction_list
 */

/**
 * Frontend model for Leave Transaction Manual
 */
export interface LeaveTransactionManual {
    id: number; // hreltD_Id
    employeeName: string; // hrmE_EmployeeFirstName
    leaveName: string; // hrmL_LeaveName
    fromDate: string | Date; // hreltD_FromDate
    toDate: string | Date; // hreltD_ToDate
    totalDays: number; // hreltD_TotDays
    transactionId: number; // hrelT_Id
    isActive: boolean; // hrelT_ActiveFlag
    employeeId: number; // hrmE_Id
    createdAt: Date;
}

/**
 * API Response structure for Leave Transaction Manual
 */
export interface LeaveTransactionManualApiData {
    hreltD_Id: number;
    hrmE_EmployeeFirstName: string;
    hrmL_LeaveName: string;
    hreltD_FromDate: string;
    hreltD_ToDate: string;
    hreltD_TotDays: number;
    hrelT_Id: number;
    hrelT_ActiveFlag: boolean;
    hrmE_Id: number;
}

/**
 * API Request for saving/updating Leave Transaction Manual
 * Based on user provided segment:
 * { "hrelT_Id": 0, "hreltD_Id": 242, "hrmE_Id": 1210, "hrmL_LeaveType": "OD", "hrmlY_Id": 88, "hrelT_FromDate": "...", "hrelT_ToDate": "...", "hrelT_TotDays": 1 }
 */
export interface LeaveTransactionManualSaveRequest {
    hrelT_Id: number;
    hreltD_Id: number;
    hrmE_Id: number;
    hrmL_LeaveType?: string;
    hrmlY_Id?: number;
    hrelT_FromDate: string;
    hrelT_ToDate: string;
    hrelT_TotDays: number;
}

/**
 * API Request for deleting Leave Transaction Manual
 */
export interface LeaveTransactionManualDeleteRequest {
    HRELTD_Id: number;
    HRELT_Id: number;
}
