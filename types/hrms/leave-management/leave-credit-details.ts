/**
 * Leave Credit Details API Types
 * Types for the Leave Credit Details API endpoints
 */

/**
 * Request payload for GetLeave endpoint
 * POST /api/LeaveCreditWrapperFacade/GetLeave
 */
export interface GetLeaveCreditDetailsRequest {
    MI_Id: number;
}

/**
 * Leave Credit Detail item from API response
 */
export interface LeaveCreditDetailItem {
    [key: string]: any;
    // Key fields that might be present
    HRMLD_Id?: number;
    HRML_Id?: number;
    HRMD_Id?: number;
    HRMDES_Id?: number;
    HRMG_Id?: number;
    HRMLD_NoOfDays?: number | string;
    HRMLD_MaxLeaveApplicable?: number;
    HRMLD_CarryForFlg?: boolean;
    HRMLD_EncashFlg?: boolean;
    HRMD_DepartmentName?: string;
    HRMDES_DesignationName?: string;
    HRMG_GradeName?: string;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    MI_Id?: number;
}

/**
 * Response data structure from GetLeave endpoint
 */
export interface GetLeaveCreditDetailsResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveCreditDetailItem[];
    leaveCreditDetails?: LeaveCreditDetailItem[];
    leaveCreditList?: LeaveCreditDetailItem[];
    leaveDetails?: LeaveCreditDetailItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure
 */
export interface GetLeaveCreditDetailsResponse {
    success: boolean;
    message: string;
    data: GetLeaveCreditDetailsResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for GetLeaveCode endpoint
 * POST /api/LeaveCreditWrapperFacade/GetLeaveCode
 */
export interface GetLeaveCodeRequest {
    leavecode: number;
}

/**
 * Leave Code item from API response
 */
export interface LeaveCodeItem {
    [key: string]: any;
    // Key fields that might be present
    HRML_Id?: number;
    HRML_LeaveCode?: string;
    HRML_LeaveName?: string;
    leaveCode?: string;
    leaveName?: string;
    leaveId?: number;
}

/**
 * Response data structure from GetLeaveCode endpoint
 */
export interface GetLeaveCodeResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveCodeItem[];
    leaveCodeList?: LeaveCodeItem[];
    leaveList?: LeaveCodeItem[];
    leaveCodes?: LeaveCodeItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetLeaveCode
 */
export interface GetLeaveCodeResponse {
    success: boolean;
    message: string;
    data: GetLeaveCodeResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Employee type item in emptypes array
 * This is a complex nested structure
 */
export interface EmployeeTypeItem {
    [key: string]: any;
    // Key fields that might be present
    HRMGT_Id?: number;
    HRMGT_EmployeeGroupType?: string;
    MI_Id?: number;
}

/**
 * Request payload for GetDepartments endpoint
 * POST /api/LeaveCreditWrapperFacade/GetDepartments
 */
export interface GetLeaveCreditDepartmentsRequest {
    MI_Id: number;
    emptypes: EmployeeTypeItem[];
}

/**
 * Department item from API response
 */
export interface DepartmentItem {
    [key: string]: any;
    // Key fields that might be present
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMD_Order?: number;
    HRMD_ActiveFlag?: boolean;
}

/**
 * Response data structure from GetDepartments endpoint
 */
export interface GetLeaveCreditDepartmentsResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: DepartmentItem[];
    DepartmentTempDto?: DepartmentItem[];
    departmentdropdownlist?: DepartmentItem[];
    Department_types?: string[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetDepartments
 */
export interface GetLeaveCreditDepartmentsResponse {
    success: boolean;
    message: string;
    data: GetLeaveCreditDepartmentsResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for GetDesignation endpoint
 * POST /api/LeaveCreditWrapperFacade/GetDesignation
 */
export interface GetLeaveCreditDesignationRequest {
    MI_Id: number;
    emptypes: EmployeeTypeItem[];
}

/**
 * Designation item from API response
 */
export interface DesignationItem {
    [key: string]: any;
    // Key fields that might be present
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
    HRMDES_Order?: number;
    HRMDES_ActiveFlag?: boolean;
}

/**
 * Response data structure from GetDesignation endpoint
 */
export interface GetLeaveCreditDesignationResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: DesignationItem[];
    DesignationTempDto?: DesignationItem[];
    designationarray?: DesignationItem[];
    designationdropdownlist?: DesignationItem[];
    Designation_types?: string[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetDesignation
 */
export interface GetLeaveCreditDesignationResponse {
    success: boolean;
    message: string;
    data: GetLeaveCreditDesignationResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for GetGrade endpoint
 * POST /api/LeaveCreditWrapperFacade/GetGrade
 */
export interface GetLeaveCreditGradeRequest {
    MI_Id: number;
    emptypes: EmployeeTypeItem[];
}

/**
 * Grade item from API response
 */
export interface GradeItem {
    [key: string]: any;
    // Key fields that might be present
    HRMG_Id?: number;
    HRMG_GradeName?: string;
    HRMG_GradeDisplayName?: string;
    HRMG_Order?: number;
    HRMG_ActiveFlag?: boolean;
}

/**
 * Response data structure from GetGrade endpoint
 */
export interface GetLeaveCreditGradeResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: GradeItem[];
    GradeTempDto?: GradeItem[];
    gradeList?: GradeItem[];
    grade_types?: string[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetGrade
 */
export interface GetLeaveCreditGradeResponse {
    success: boolean;
    message: string;
    data: GetLeaveCreditGradeResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for SaveData endpoint
 * POST /api/LeaveCreditWrapperFacade/SaveData
 */
export interface SaveLeaveCreditDetailsRequest {
    MI_Id: number;
    HRML_Id: number;
    HRMLD_NoOfDays: string;
    HRMLD_MaxLeaveApplicable: number;
    LoginId: number;
    Emp_types: EmployeeTypeItem[];
    dept_types: any[];
    desig_types: any[];
    grade_types: any[];
    HRMLD_CarryForFlg: boolean;
    HRMLD_EncashFlg: boolean;
    HRMLDCF_MaxLeaveAplFlg: boolean;
    HRMLDCF_MaxLeaveCF: number;
    selectedcarryMonthList: number[];
    selectedMonthList: number[];
    [key: string]: any; // Allow additional fields
}

/**
 * Response data structure from SaveData endpoint
 */
export interface SaveLeaveCreditDetailsResponseData {
    [key: string]: any;
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
    returnval_Update?: boolean;
    returnval_add?: boolean;
    HRMLD_Id?: number;
    dupr?: boolean;
    returnduplicatestatus?: string;
}

/**
 * Full API response structure for SaveData
 */
export interface SaveLeaveCreditDetailsResponse {
    success: boolean;
    message: string;
    data: SaveLeaveCreditDetailsResponseData | null;
    retrunMsg?: string;
    returnval?: boolean;
    returnval_Update?: boolean;
    returnval_add?: boolean;
    dupr?: boolean;
}

/**
 * Request payload for LeaveMaster endpoint
 * POST /api/LeaveCreditWrapperFacade/LeaveMaster
 */
export interface GetLeaveMasterRequest {
    MI_Id: number;
    HRML_LeaveCode: string;
    HRMLDCM_Id: number;
}

/**
 * Leave Master item from API response
 */
export interface LeaveMasterItem {
    [key: string]: any;
    // Key fields that might be present
    HRMLDCM_Id?: number;
    HRMLD_Id?: number;
    HRML_Id?: number;
    HRMLDCM_LCMonthCode?: string;
    monthName?: string;
    monthId?: number;
}

/**
 * Response data structure from LeaveMaster endpoint
 */
export interface GetLeaveMasterResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveMasterItem[];
    leaveMasterList?: LeaveMasterItem[];
    leaveCM?: LeaveMasterItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for LeaveMaster
 */
export interface GetLeaveMasterResponse {
    success: boolean;
    message: string;
    data: GetLeaveMasterResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for LeaveDetailsCreditMonth endpoint
 * POST /api/LeaveCreditWrapperFacade/LeaveDetailsCreditMonth
 */
export interface GetLeaveDetailsCreditMonthRequest {
    HRMLDCM_Id: number;
    HRMLDCM_LCMonthCode: string;
}

/**
 * Leave Details Credit Month item from API response
 */
export interface LeaveDetailsCreditMonthItem {
    [key: string]: any;
    // Key fields that might be present
    HRMLDCM_Id?: number;
    HRMLD_Id?: number;
    HRML_Id?: number;
    HRMLDCM_LCMonthCode?: string;
    monthName?: string;
    monthId?: number;
    monthCode?: string;
}

/**
 * Response data structure from LeaveDetailsCreditMonth endpoint
 */
export interface GetLeaveDetailsCreditMonthResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveDetailsCreditMonthItem[];
    leaveDetailsCreditMonthList?: LeaveDetailsCreditMonthItem[];
    leaveCM?: LeaveDetailsCreditMonthItem[];
    creditMonthList?: LeaveDetailsCreditMonthItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for LeaveDetailsCreditMonth
 */
export interface GetLeaveDetailsCreditMonthResponse {
    success: boolean;
    message: string;
    data: GetLeaveDetailsCreditMonthResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for LeaveDetailsCF endpoint
 * POST /api/LeaveCreditWrapperFacade/LeaveDetailsCF
 */
export interface GetLeaveDetailsCFRequest {
    HRMLDCF_Id: number;
    HRMLDCF_MaxLeaveAplFlg: boolean;
}

/**
 * Leave Details CF (Carry Forward) item from API response
 */
export interface LeaveDetailsCFItem {
    [key: string]: any;
    // Key fields that might be present
    HRMLDCF_Id?: number;
    HRMLDCF_MaxLeaveAplFlg?: boolean;
    HRMLDCF_MaxLeaveCF?: number;
    HRMLD_Id?: number;
    HRML_Id?: number;
    monthId?: number;
    monthName?: string;
}

/**
 * Response data structure from LeaveDetailsCF endpoint
 */
export interface GetLeaveDetailsCFResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveDetailsCFItem[];
    leaveDetailsCFList?: LeaveDetailsCFItem[];
    leaveCf?: LeaveDetailsCFItem[];
    carryForwardList?: LeaveDetailsCFItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for LeaveDetailsCF
 */
export interface GetLeaveDetailsCFResponse {
    success: boolean;
    message: string;
    data: GetLeaveDetailsCFResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for LeaveDetailsCFMonth endpoint
 * POST /api/LeaveCreditWrapperFacade/LeaveDetailsCFMonth
 */
export interface GetLeaveDetailsCFMonthRequest {
    HRMLDCFM_Id: number;
    HRMLDCFM_MonthId: number;
}

/**
 * Leave Details CF Month item from API response
 */
export interface LeaveDetailsCFMonthItem {
    [key: string]: any;
    // Key fields that might be present
    HRMLDCFM_Id?: number;
    HRMLDCF_Id?: number;
    HRMLDCFM_MonthId?: number;
    HRMLD_Id?: number;
    HRML_Id?: number;
    monthId?: number;
    monthName?: string;
    monthCode?: string;
}

/**
 * Response data structure from LeaveDetailsCFMonth endpoint
 */
export interface GetLeaveDetailsCFMonthResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveDetailsCFMonthItem[];
    leaveDetailsCFMonthList?: LeaveDetailsCFMonthItem[];
    leaveCf?: LeaveDetailsCFMonthItem[];
    carryForwardMonthList?: LeaveDetailsCFMonthItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for LeaveDetailsCFMonth
 */
export interface GetLeaveDetailsCFMonthResponse {
    success: boolean;
    message: string;
    data: GetLeaveDetailsCFMonthResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for LeaveDetailsEnCash endpoint
 * POST /api/LeaveCreditWrapperFacade/LeaveDetailsEnCash
 */
export interface GetLeaveDetailsEnCashRequest {
    HRMLDEC_Id: number;
    HRMLDEC_ServiceAplFlg: boolean;
    HRMLDEC_ServiceYear: string;
    HRMLDEC_ServiceMonth: string;
    HRMLDEC_ServiceDays: string;
    HRMLDEC_MaxLeaveFlg: boolean;
    HRMLDEC_MaxLeaves: number;
    HRMLDEC_MinLeaveFlg: boolean;
    HRMLDEC_MinLeaves: number;
    HRMLDEC_ScheduleFlg: string;
    HRMLDEC_ScheduleYear: string;
    HRMLDEC_ScheduleMonth: string;
}

/**
 * Leave Details EnCash item from API response
 */
export interface LeaveDetailsEnCashItem {
    [key: string]: any;
    // Key fields that might be present
    HRMLDEC_Id?: number;
    HRMLD_Id?: number;
    HRML_Id?: number;
    HRMLDEC_ServiceAplFlg?: boolean;
    HRMLDEC_ServiceYear?: string;
    HRMLDEC_ServiceMonth?: string;
    HRMLDEC_ServiceDays?: string;
    HRMLDEC_MaxLeaveFlg?: boolean;
    HRMLDEC_MaxLeaves?: number;
    HRMLDEC_MinLeaveFlg?: boolean;
    HRMLDEC_MinLeaves?: number;
    HRMLDEC_ScheduleFlg?: string;
    HRMLDEC_ScheduleYear?: string;
    HRMLDEC_ScheduleMonth?: string;
    HRMLDEC_VariableFixedFlg?: boolean;
    HRMLDEC_FixedAmount?: number;
}

/**
 * Response data structure from LeaveDetailsEnCash endpoint
 */
export interface GetLeaveDetailsEnCashResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveDetailsEnCashItem[];
    leaveDetailsEnCashList?: LeaveDetailsEnCashItem[];
    encashList?: LeaveDetailsEnCashItem[];
    encashmentList?: LeaveDetailsEnCashItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for LeaveDetailsEnCash
 */
export interface GetLeaveDetailsEnCashResponse {
    success: boolean;
    message: string;
    data: GetLeaveDetailsEnCashResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}


/**
 * Item for leave name dropdown
 */
export interface LeaveNameDropdownItem {
    hrmL_Id: number;
    hrmL_LeaveName: string;
    hrmL_LeaveCode: string;
    hrmL_LeaveDetails?: string;
    hrmL_LeaveCreditFlg?: boolean;
    hrmL_LeaveType?: string;
}

/**
 * Item for credit month dropdown
 */
export interface CreditMonthDropdownItem {
    ivrM_Month_Id: number;
    ivrM_Month_Name: string;
}
