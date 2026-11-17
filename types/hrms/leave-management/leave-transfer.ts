/**
 * Leave Transfer API Types
 * Types for the Leave Transfer API endpoints
 */

/**
 * Request payload for GetBasicData endpoint
 * POST /api/LeaveTransferWrapperFacade/GetBasicData
 */
export interface GetLeaveTransferBasicDataRequest {
    MI_Id: number;
}

/**
 * Response data structure from GetBasicData endpoint
 * This will contain dropdown options and basic data for the leave transfer page
 */
export interface GetLeaveTransferBasicDataResponseData {
    [key: string]: any;
    // Common fields that might be present
    typeOptions?: Array<{ label: string; value: string }>;
    departmentOptions?: Array<{ label: string; value: string }>;
    designationOptions?: Array<{ label: string; value: string }>;
    leaveYearOptions?: Array<{ label: string; value: string }>;
    leaveNameOptions?: Array<{ label: string; value: string }>;
    GroupTypeTempDto?: Array<{ HRMGT_Id: number; HRMGT_EmployeeGroupType: string }>;
    DepartmentTempDto?: Array<{ HRMD_Id: number; HRMD_DepartmentName: string }>;
    DesignationTempDto?: Array<{ HRMDES_Id: number; HRMDES_DesignationName: string }>;
    leavearrayyear?: Array<{ HRMLY_Id: number; HRMLY_LeaveYear: string }>;
    master_eventlist?: Array<{ HRML_Id: number; HRML_LeaveName: string }>;
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure
 */
export interface GetLeaveTransferBasicDataResponse {
    success: boolean;
    message: string;
    data: GetLeaveTransferBasicDataResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for GetLeaveOB endpoint
 * POST /api/LeaveTransferWrapperFacade/GetLeaveOB
 */
export interface GetLeaveOBRequest {
    MI_Id: number;
}

/**
 * Response data structure from GetLeaveOB endpoint
 * This will contain leave balance/employee data
 */
export interface GetLeaveOBResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: any[];
    leaveOBList?: any[];
    employeeList?: any[];
    leaveBalanceList?: any[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetLeaveOB
 */
export interface GetLeaveOBResponse {
    success: boolean;
    message: string;
    data: GetLeaveOBResponseData;
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
    HRMGT_Id?: number;
    HRMGT_EmployeeGroupType?: string;
    MI_Id?: number;
    // Add other fields as needed
}

/**
 * Request payload for GetDepartments endpoint
 * POST /api/LeaveTransferWrapperFacade/GetDepartments
 */
export interface GetDepartmentsRequest {
    MI_Id: number;
    emptypes: EmployeeTypeItem[];
}

/**
 * Response data structure from GetDepartments endpoint
 * This will contain department options based on selected employee types
 */
export interface GetDepartmentsResponseData {
    [key: string]: any;
    // Common fields that might be present
    DepartmentTempDto?: Array<{ HRMD_Id: number; HRMD_DepartmentName: string }>;
    departmentdropdownlist?: any[];
    Department_types?: any[];
    filldepartment?: any[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetDepartments
 */
export interface GetDepartmentsResponse {
    success: boolean;
    message: string;
    data: GetDepartmentsResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for GetDesignation endpoint
 * POST /api/LeaveTransferWrapperFacade/GetDesignation
 */
export interface GetDesignationRequest {
    MI_Id: number;
    emptypes: EmployeeTypeItem[];
}

/**
 * Response data structure from GetDesignation endpoint
 * This will contain designation options based on selected employee types
 */
export interface GetDesignationResponseData {
    [key: string]: any;
    // Common fields that might be present
    DesignationTempDto?: Array<{ HRMDES_Id: number; HRMDES_DesignationName: string }>;
    designationarray?: Array<{ HRMDES_Id: number; HRMDES_DesignationName: string }>;
    designationdropdownlist?: any[];
    Designation_types?: any[];
    filldesignation?: any[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetDesignation
 */
export interface GetDesignationResponse {
    success: boolean;
    message: string;
    data: GetDesignationResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Employee list item in emplist array
 */
export interface EmployeeListItem {
    HRME_Id: number;
    HRELS_CreditedLeaves: number;
    HRELS_TotalLeaves: number;
    HRELS_Id: number;
    HRELS_CBLeaves: number;
    HRMLY_Id: number;
    HRML_Id: number;
}

/**
 * Request payload for SaveDetails endpoint
 * POST /api/LeaveTransferWrapperFacade/SaveDetails
 */
export interface SaveLeaveTransferDetailsRequest {
    MI_Id: number;
    HRME_SubstituteFlag: string;
    HRELAP_Id: number;
    HRML_Id: number;
    monthid: number;
    yearid: number;
    emplist: EmployeeListItem[];
    UserId: string;
    HRELS_Id: number;
    HRME_Id: number;
    HRELS_OBLeaves: number;
    HRELS_CreditedLeaves: number;
    HRELS_TotalLeaves: number;
    HRELS_TransLeaves: number;
    HRMLY_Id: number;
    HRELS_EncashedLeaves: number;
    HRELS_CBLeaves: number;
}

/**
 * Response data structure from SaveDetails endpoint
 */
export interface SaveLeaveTransferDetailsResponseData {
    [key: string]: any;
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
    returnval_add?: boolean;
    returnval_Update?: boolean;
}

/**
 * Full API response structure for SaveDetails
 */
export interface SaveLeaveTransferDetailsResponse {
    success: boolean;
    message: string;
    data: SaveLeaveTransferDetailsResponseData | null;
    retrunMsg?: string;
    returnval?: boolean;
    returnval_add?: boolean;
    returnval_Update?: boolean;
}

/**
 * Request payload for LeaveCarryForward endpoint
 * POST /api/LeaveTransferWrapperFacade/LeaveCarryForward
 */
export interface LeaveCarryForwardRequest {
    MI_Id: number;
    emplist: EmployeeListItem[];
}

/**
 * Response data structure from LeaveCarryForward endpoint
 */
export interface LeaveCarryForwardResponseData {
    [key: string]: any;
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
    returnval_add?: boolean;
    returnval_Update?: boolean;
}

/**
 * Full API response structure for LeaveCarryForward
 */
export interface LeaveCarryForwardResponse {
    success: boolean;
    message: string;
    data: LeaveCarryForwardResponseData | null;
    retrunMsg?: string;
    returnval?: boolean;
    returnval_add?: boolean;
    returnval_Update?: boolean;
}

/**
 * Request payload for DeletePages endpoint
 * POST /api/LeaveTransferWrapperFacade/DeletePages
 */
export interface DeleteLeaveTransferRequest {
    HRELS_Id: number;
}

/**
 * Response data structure from DeletePages endpoint
 */
export interface DeleteLeaveTransferResponseData {
    [key: string]: any;
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for DeletePages
 */
export interface DeleteLeaveTransferResponse {
    success: boolean;
    message: string;
    data: DeleteLeaveTransferResponseData | null;
    retrunMsg?: string;
    returnval?: boolean;
}

