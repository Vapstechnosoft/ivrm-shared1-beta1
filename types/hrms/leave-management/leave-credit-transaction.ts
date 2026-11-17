/**
 * Common request structure for Leave Transaction Manual endpoints
 */
export interface LeaveTransactionManualRequest {
    MI_Id: number;
    EmpTypeIds: number[];
    DepartmentIds: number[];
    DesignationIds: number[];
    EmployeeIds: number[];
}

/**
 * Leave Transaction item from API response
 */
export interface LeaveTransactionItem {
    [key: string]: any;
    // Key fields that might be present
    HRELT_Id?: number;
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRML_Id?: number;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    HRELT_FromDate?: string;
    HRELT_ToDate?: string;
    HRELT_TotDays?: number;
    HRELT_LeaveReason?: string;
    HRELT_Status?: string;
    HRELT_Reportingdate?: string;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
}

/**
 * Response data structure from GetLeavetransm endpoint
 */
export interface GetLeavetransmResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveTransactionItem[];
    leaveTransactionList?: LeaveTransactionItem[];
    transactionList?: LeaveTransactionItem[];
    leaveTransmList?: LeaveTransactionItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetLeavetransm
 */
export interface GetLeavetransmResponse {
    success: boolean;
    message: string;
    data: GetLeavetransmResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Department item from API response
 */
export interface LeaveTransactionDepartmentItem {
    [key: string]: any;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMD_Order?: number;
    HRMD_ActiveFlag?: boolean;
}

/**
 * Response data structure from GetDepartments endpoint
 */
export interface GetLeaveTransactionDepartmentsResponseData {
    [key: string]: any;
    // Common fields that might be present
    DepartmentTempDto?: LeaveTransactionDepartmentItem[];
    departmentdropdownlist?: LeaveTransactionDepartmentItem[];
    departmentList?: LeaveTransactionDepartmentItem[];
    departments?: LeaveTransactionDepartmentItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetDepartments
 */
export interface GetLeaveTransactionDepartmentsResponse {
    success: boolean;
    message: string;
    data: GetLeaveTransactionDepartmentsResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Designation item from API response
 */
export interface LeaveTransactionDesignationItem {
    [key: string]: any;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
    HRMDES_Order?: number;
    HRMDES_ActiveFlag?: boolean;
}

/**
 * Response data structure from GetDesignation endpoint
 */
export interface GetLeaveTransactionDesignationResponseData {
    [key: string]: any;
    // Common fields that might be present
    DesignationTempDto?: LeaveTransactionDesignationItem[];
    designationarray?: LeaveTransactionDesignationItem[];
    designationdropdownlist?: LeaveTransactionDesignationItem[];
    designationList?: LeaveTransactionDesignationItem[];
    designations?: LeaveTransactionDesignationItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetDesignation
 */
export interface GetLeaveTransactionDesignationResponse {
    success: boolean;
    message: string;
    data: GetLeaveTransactionDesignationResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Employee item from API response
 */
export interface LeaveTransactionEmployeeItem {
    [key: string]: any;
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRME_EmailId?: string;
    HRME_MobileNo?: number;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
    HRMG_Id?: number;
    HRMG_GradeName?: string;
}

/**
 * Response data structure from GetEmployee endpoint
 */
export interface GetLeaveTransactionEmployeeResponseData {
    [key: string]: any;
    // Common fields that might be present
    EmployeeTempDto?: LeaveTransactionEmployeeItem[];
    employeedropdownlist?: LeaveTransactionEmployeeItem[];
    employeeList?: LeaveTransactionEmployeeItem[];
    employees?: LeaveTransactionEmployeeItem[];
    GridviewDetails?: LeaveTransactionEmployeeItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetEmployee
 */
export interface GetLeaveTransactionEmployeeResponse {
    success: boolean;
    message: string;
    data: GetLeaveTransactionEmployeeResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Employee LOP (Loss of Pay) item from API response
 */
export interface LeaveTransactionEmpLopItem {
    [key: string]: any;
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
    LOPDays?: number;
    LOPDate?: string;
    LOPReason?: string;
}

/**
 * Response data structure from GetEmpLop endpoint
 */
export interface GetLeaveTransactionEmpLopResponseData {
    [key: string]: any;
    // Common fields that might be present
    EmpLopTempDto?: LeaveTransactionEmpLopItem[];
    empLopList?: LeaveTransactionEmpLopItem[];
    empLopdropdownlist?: LeaveTransactionEmpLopItem[];
    employeeLopList?: LeaveTransactionEmpLopItem[];
    GridviewDetails?: LeaveTransactionEmpLopItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetEmpLop
 */
export interface GetLeaveTransactionEmpLopResponse {
    success: boolean;
    message: string;
    data: GetLeaveTransactionEmpLopResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for SaveData endpoint
 * POST /api/LeaveTransactionManualWrapperFacade/SaveData
 */
export interface SaveLeaveTransactionRequest {
    MI_Id: number;
    HRME_Id: number;
    HRML_LeaveType: string;
    HRELT_FromDate: string;
    HRELT_ToDate: string;
    HRELT_TotDays: number;
    HRELT_Id?: number;
    HRELTD_Id?: number;
    [key: string]: any; // Allow additional fields
}

/**
 * Response data structure from SaveData endpoint
 */
export interface SaveLeaveTransactionResponseData {
    [key: string]: any;
    // Common fields that might be present
    returnval?: boolean;
    returnval_add?: boolean;
    returnval_Update?: boolean;
    retrunMsg?: string;
    message?: string;
    HRELT_Id?: number;
    HRELTD_Id?: number;
    dupr?: boolean;
    returnduplicatestatus?: string;
}

/**
 * Full API response structure for SaveData
 */
export interface SaveLeaveTransactionResponse {
    success: boolean;
    message: string;
    data: SaveLeaveTransactionResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for DeleteDetails endpoint
 * POST /api/LeaveTransactionManualWrapperFacade/DeleteDetails
 */
export interface DeleteLeaveTransactionRequest {
    HRELT_Id: number;
}

/**
 * Response data structure from DeleteDetails endpoint
 */
export interface DeleteLeaveTransactionResponseData {
    [key: string]: any;
    // Common fields that might be present
    returnval?: boolean;
    retrunMsg?: string;
    message?: string;
    HRELT_Id?: number;
}

/**
 * Full API response structure for DeleteDetails
 */
export interface DeleteLeaveTransactionResponse {
    success: boolean;
    message: string;
    data: DeleteLeaveTransactionResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

