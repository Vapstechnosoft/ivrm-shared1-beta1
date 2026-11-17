/**
 * Master Leave API Types
 * Types for the Master Leave Management API endpoints
 */

/**
 * Request payload for GetLeave endpoint
 * POST /api/MasterLeaveWrapperFacade/GetLeave
 */
export interface MasterLeaveGetRequest {
    MI_Id: number;
    HRML_Id: number;
}

/**
 * Leave Type dropdown item from master_eventlist
 */
export interface LeaveTypeDropdownItem {
    value: string;
    label: string;
    [key: string]: any;
}

/**
 * Leave Order dropdown item from leaveorderlist
 */
export interface LeaveOrderDropdownItem {
    value: number;
    label: string;
    [key: string]: any;
}

/**
 * Individual Master Leave item from the new GET API
 */
export interface MasterLeaveListItem {
    hrmL_Id: number;
    mI_Id: number;
    hrmL_LeaveName: string;
    hrmL_LeaveCode: string;
    hrmL_LeaveDetails: string;
    hrmL_LeaveCreditFlg: boolean;
    hrmL_LeaveType: string;
    hrmL_LateDeductFlag: boolean;
    hrmL_LateDeductOrder: number;
    hrmL_WhenToApplyFlg: string | null;
    hrmL_NoOfDays: number | null;
    hrmL_ProbationNotApplicableFlg?: boolean;
    hrmL_ActiveFlag?: boolean | number;
    createdDate: string;
    updatedDate: string;
}

/**
 * Response data structure from GetLeave endpoint (Legacy or Wrapper)
 */
export interface MasterLeaveGetResponseData {
    edit_m_event: any | null;
    leaveData: MasterLeaveListItem[] | any | null;
    dupr: boolean;
    selected_master_event: any | null;
    returnduplicatestatus: any | null;
    returnval_Update: boolean;
    returnval_add: boolean;
    retrunMsg: string | null;
    returnval: boolean;
    master_eventlist: LeaveTypeDropdownItem[] | any[] | null;
    leaveorderlist: LeaveOrderDropdownItem[] | any[] | null;
    GridviewDetails: MasterLeaveListItem[] | any | null;
    leavelistedit: any | null;
    message?: string | null;
}

/**
 * Full API response structure
 */
export interface MasterLeaveGetResponse {
    success: boolean;
    message: string;
    data: MasterLeaveListItem[] | MasterLeaveGetResponseData;
    total: number | null;
    page: number | null;
    page_size: number | null;
}

/**
 * Request payload for Save/Update Leave endpoint
 * POST /api/MasterLeaveWrapperFacade/SaveLeave (or similar)
 */
export interface MasterLeaveSaveRequest {
    MI_Id: number;
    HRML_Id: number;
    HRML_LeaveName: string;
    HRML_LeaveCode: string;
    HRML_LeaveDetails: string;
    HRML_LeaveCreditFlg: boolean;
    HRML_LeaveType: string;
    HRML_LateDeductFlag: boolean;
    HRML_LateDeductOrder: number;
    CreatedDate?: string;
    UpdatedDate?: string;
    HRML_ActiveFlag?: boolean | number;
    HRML_ProbationNotApplicableFlg?: boolean;
    HRML_LeaveApplyCriteria?: string | null;
    HRML_DaysForApplyCriteria?: string | number | null;
    HRML_MaxDaysForApply?: string | number | null;
}

/**
 * Response from Save/Update Leave endpoint
 */
export interface MasterLeaveSaveResponse {
    success: boolean;
    message: string;
    data: MasterLeaveGetResponseData | null;
    retrunMsg?: string;
    returnval?: boolean;
    returnval_add?: boolean;
    returnval_Update?: boolean;
}

/**
 * Master Leave DTO for validation
 */
export interface MasterLeaveDTOO {
    MI_Id: number;
    HRML_Id: number;
}

/**
 * Request payload for ValidateOrderNumber endpoint
 * POST /api/MasterLeaveWrapperFacade/ValidateOrderNumber
 */
export interface MasterLeaveValidateOrderRequest {
    MasterLeaveDTOO: MasterLeaveDTOO[];
}

/**
 * Response from ValidateOrderNumber endpoint
 */
export interface MasterLeaveValidateOrderResponse {
    success: boolean;
    message: string;
    data: any;
    retrunMsg?: string;
    returnval?: boolean;
}

/**
 * Request payload for DeletePages endpoint
 * POST /api/MasterLeaveWrapperFacade/DeletePages
 */
export interface MasterLeaveDeleteRequest {
    HRML_Id: number;
}

/**
 * Response from DeletePages endpoint
 */
export interface MasterLeaveDeleteResponse {
    success: boolean;
    message: string;
    data: any;
    retrunMsg?: string;
    returnval?: boolean;
}
