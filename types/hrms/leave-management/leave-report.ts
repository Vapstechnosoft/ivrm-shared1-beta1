/**
 * Request payload for GetLeaveReport endpoint
 * POST /api/LeaveReportWrapperFacade/GetLeaveReport
 */
export interface GetLeaveReportRequest {
    MI_Id: number;
}

/**
 * Leave Report item from API response
 */
export interface LeaveReportItem {
    [key: string]: any;
    // Key fields that might be present
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRML_Id?: number;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    HRELAP_Id?: number;
    HRELAP_ApplicationID?: string;
    HRELAP_ApplicationDate?: string;
    HRELAP_FromDate?: string;
    HRELAP_ToDate?: string;
    HRELAP_TotalDays?: number;
    HRELAP_ApplicationStatus?: string;
    HRELAP_LeaveReason?: string;
    HRELS_OBLeaves?: number;
    HRELS_CreditedLeaves?: number;
    HRELS_TotalLeaves?: number;
    HRELS_CBLeaves?: number;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
}

/**
 * Response data structure from GetLeaveReport endpoint
 */
export interface GetLeaveReportResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveReportItem[];
    leaveReportList?: LeaveReportItem[];
    reportList?: LeaveReportItem[];
    leaveList?: LeaveReportItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetLeaveReport
 */
export interface GetLeaveReportResponse {
    success: boolean;
    message: string;
    data: GetLeaveReportResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Employee type filter item (used in emptypes array)
 */
export interface LeaveReportEmployeeTypeFilterItem {
    [key: string]: any;
    // Key fields that might be present
    HRMGT_Id?: number;
    HRMGT_EmployeeGroupType?: string;
    MI_Id?: number;
}

/**
 * Request payload for GetDepartments endpoint
 * POST /api/LeaveReportWrapperFacade/GetDepartments
 */
export interface GetLeaveReportDepartmentsRequest {
    MI_Id: number;
    emptypes?: LeaveReportEmployeeTypeFilterItem[];
    [key: string]: any; // Allow additional fields
}

/**
 * Department item from API response
 */
export interface LeaveReportDepartmentItem {
    [key: string]: any;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMD_Order?: number;
    HRMD_ActiveFlag?: boolean;
}

/**
 * Response data structure from GetDepartments endpoint
 */
export interface GetLeaveReportDepartmentsResponseData {
    [key: string]: any;
    // Common fields that might be present
    DepartmentTempDto?: LeaveReportDepartmentItem[];
    departmentdropdownlist?: LeaveReportDepartmentItem[];
    departmentList?: LeaveReportDepartmentItem[];
    departments?: LeaveReportDepartmentItem[];
    GridviewDetails?: LeaveReportDepartmentItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetDepartments
 */
export interface GetLeaveReportDepartmentsResponse {
    success: boolean;
    message: string;
    data: GetLeaveReportDepartmentsResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for GetDesignation endpoint
 * POST /api/LeaveReportWrapperFacade/GetDesignation
 */
export interface GetLeaveReportDesignationRequest {
    MI_Id: number;
    emptypes?: LeaveReportEmployeeTypeFilterItem[];
    [key: string]: any; // Allow additional fields
}

/**
 * Designation item from API response
 */
export interface LeaveReportDesignationItem {
    [key: string]: any;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
    HRMDES_Order?: number;
    HRMDES_ActiveFlag?: boolean;
}

/**
 * Response data structure from GetDesignation endpoint
 */
export interface GetLeaveReportDesignationResponseData {
    [key: string]: any;
    // Common fields that might be present
    DesignationTempDto?: LeaveReportDesignationItem[];
    designationdropdownlist?: LeaveReportDesignationItem[];
    designationList?: LeaveReportDesignationItem[];
    designations?: LeaveReportDesignationItem[];
    GridviewDetails?: LeaveReportDesignationItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetDesignation
 */
export interface GetLeaveReportDesignationResponse {
    success: boolean;
    message: string;
    data: GetLeaveReportDesignationResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Department filter item (used in empdept array)
 */
export interface LeaveReportDepartmentFilterItem {
    [key: string]: any;
    // Key fields that might be present
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    MI_Id?: number;
}

/**
 * Request payload for GetEmployees endpoint
 * POST /api/LeaveReportWrapperFacade/GetEmployees
 */
export interface GetLeaveReportEmployeesRequest {
    MI_Id: number;
    emptypes?: LeaveReportEmployeeTypeFilterItem[];
    empdept?: LeaveReportDepartmentFilterItem[];
    [key: string]: any; // Allow additional fields
}

/**
 * Employee item from API response
 */
export interface LeaveReportEmployeeItem {
    [key: string]: any;
    // Key fields that might be present
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
}

/**
 * Response data structure from GetEmployees endpoint
 */
export interface GetLeaveReportEmployeesResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveReportEmployeeItem[];
    employeeList?: LeaveReportEmployeeItem[];
    employees?: LeaveReportEmployeeItem[];
    employeelist?: LeaveReportEmployeeItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetEmployees
 */
export interface GetLeaveReportEmployeesResponse {
    success: boolean;
    message: string;
    data: GetLeaveReportEmployeesResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for GetReport endpoint
 * POST /api/LeaveReportWrapperFacade/GetReport
 */
export interface GetLeaveReportDataRequest {
    MI_Id: number;
    selectedLeave?: string;
    selectedEmployee?: string;
    HRELTD_FromDate?: string;
    HRELT_ToDate?: string;
    Edit_flag?: boolean;
    selectedreport?: number[];
    UserId?: number;
    [key: string]: any; // Allow additional fields
}

/**
 * Report item from API response
 */
export interface LeaveReportDataItem {
    [key: string]: any;
    // Key fields that might be present
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRML_Id?: number;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    HRELAP_Id?: number;
    HRELAP_ApplicationID?: string;
    HRELAP_ApplicationDate?: string;
    HRELAP_FromDate?: string;
    HRELAP_ToDate?: string;
    HRELAP_TotalDays?: number;
    HRELAP_ApplicationStatus?: string;
    HRELAP_LeaveReason?: string;
    HRELS_OBLeaves?: number;
    HRELS_CreditedLeaves?: number;
    HRELS_TotalLeaves?: number;
    HRELS_CBLeaves?: number;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
}

/**
 * Response data structure from GetReport endpoint
 */
export interface GetLeaveReportDataResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveReportDataItem[];
    reportList?: LeaveReportDataItem[];
    leaveReportList?: LeaveReportDataItem[];
    reportData?: LeaveReportDataItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetReport
 */
export interface GetLeaveReportDataResponse {
    success: boolean;
    message: string;
    data: GetLeaveReportDataResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for PeriodGetLeaveReport endpoint
 * POST /api/LeaveReportWrapperFacade/PeriodGetLeaveReport
 */
export interface GetPeriodLeaveReportRequest {
    MI_Id: number;
    [key: string]: any; // Allow additional fields
}

/**
 * Period leave report item from API response
 */
export interface PeriodLeaveReportItem {
    [key: string]: any;
    // Key fields that might be present
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRML_Id?: number;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    period?: string;
    periodName?: string;
    HRELS_OBLeaves?: number;
    HRELS_CreditedLeaves?: number;
    HRELS_TotalLeaves?: number;
    HRELS_CBLeaves?: number;
    HRELS_TransLeaves?: number;
    HRELS_EncashedLeaves?: number;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
}

/**
 * Response data structure from PeriodGetLeaveReport endpoint
 */
export interface GetPeriodLeaveReportResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: PeriodLeaveReportItem[];
    periodReportList?: PeriodLeaveReportItem[];
    leavePeriodReportList?: PeriodLeaveReportItem[];
    reportData?: PeriodLeaveReportItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for PeriodGetLeaveReport
 */
export interface GetPeriodLeaveReportResponse {
    success: boolean;
    message: string;
    data: GetPeriodLeaveReportResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for PeriodGetDepartments endpoint
 * POST /api/LeaveReportWrapperFacade/PeriodGetDepartments
 */
export interface GetPeriodLeaveReportDepartmentsRequest {
    MI_Id: number;
    emptypes?: LeaveReportEmployeeTypeFilterItem[];
    [key: string]: any; // Allow additional fields
}

/**
 * Department item for period leave report
 */
export interface PeriodLeaveReportDepartmentItem {
    [key: string]: any;
    // Key fields that might be present
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMD_Order?: number;
    HRMD_ActiveFlag?: boolean;
}

/**
 * Response data structure from PeriodGetDepartments endpoint
 */
export interface GetPeriodLeaveReportDepartmentsResponseData {
    [key: string]: any;
    // Common fields that might be present
    DepartmentTempDto?: PeriodLeaveReportDepartmentItem[];
    departmentdropdownlist?: PeriodLeaveReportDepartmentItem[];
    departmentList?: PeriodLeaveReportDepartmentItem[];
    departments?: PeriodLeaveReportDepartmentItem[];
    GridviewDetails?: PeriodLeaveReportDepartmentItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for PeriodGetDepartments
 */
export interface GetPeriodLeaveReportDepartmentsResponse {
    success: boolean;
    message: string;
    data: GetPeriodLeaveReportDepartmentsResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for PeriodGetDesignation endpoint
 * POST /api/LeaveReportWrapperFacade/PeriodGetDesignation
 */
export interface GetPeriodLeaveReportDesignationRequest {
    MI_Id: number;
    emptypes?: LeaveReportEmployeeTypeFilterItem[];
    [key: string]: any; // Allow additional fields
}

/**
 * Designation item for period leave report
 */
export interface PeriodLeaveReportDesignationItem {
    [key: string]: any;
    // Key fields that might be present
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
    HRMDES_Order?: number;
    HRMDES_ActiveFlag?: boolean;
}

/**
 * Response data structure from PeriodGetDesignation endpoint
 */
export interface GetPeriodLeaveReportDesignationResponseData {
    [key: string]: any;
    // Common fields that might be present
    DesignationTempDto?: PeriodLeaveReportDesignationItem[];
    designationdropdownlist?: PeriodLeaveReportDesignationItem[];
    designationList?: PeriodLeaveReportDesignationItem[];
    designations?: PeriodLeaveReportDesignationItem[];
    GridviewDetails?: PeriodLeaveReportDesignationItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for PeriodGetDesignation
 */
export interface GetPeriodLeaveReportDesignationResponse {
    success: boolean;
    message: string;
    data: GetPeriodLeaveReportDesignationResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for PeriodGetEmployees endpoint
 * POST /api/LeaveReportWrapperFacade/PeriodGetEmployees
 */
export interface GetPeriodLeaveReportEmployeesRequest {
    MI_Id: number;
    emptypes?: LeaveReportEmployeeTypeFilterItem[];
    empdept?: LeaveReportDepartmentFilterItem[];
    [key: string]: any; // Allow additional fields
}

/**
 * Employee item for period leave report
 */
export interface PeriodLeaveReportEmployeeItem {
    [key: string]: any;
    // Key fields that might be present
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
}

/**
 * Response data structure from PeriodGetEmployees endpoint
 */
export interface GetPeriodLeaveReportEmployeesResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: PeriodLeaveReportEmployeeItem[];
    employeeList?: PeriodLeaveReportEmployeeItem[];
    employees?: PeriodLeaveReportEmployeeItem[];
    employeelist?: PeriodLeaveReportEmployeeItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for PeriodGetEmployees
 */
export interface GetPeriodLeaveReportEmployeesResponse {
    success: boolean;
    message: string;
    data: GetPeriodLeaveReportEmployeesResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for PeriodGetReport endpoint
 * POST /api/LeaveReportWrapperFacade/PeriodGetReport
 */
export interface GetPeriodLeaveReportDataRequest {
    MI_Id: number;
    selectedLeave?: string;
    selectedEmployee?: string;
    HRELTD_FromDate?: string;
    HRELT_ToDate?: string;
    Edit_flag?: boolean;
    selectedreport?: number[];
    UserId?: number;
    [key: string]: any; // Allow additional fields
}

/**
 * Period report data item from API response
 */
export interface PeriodLeaveReportDataItem {
    [key: string]: any;
    // Key fields that might be present
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRML_Id?: number;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    period?: string;
    periodName?: string;
    HRELS_OBLeaves?: number;
    HRELS_CreditedLeaves?: number;
    HRELS_TotalLeaves?: number;
    HRELS_CBLeaves?: number;
    HRELS_TransLeaves?: number;
    HRELS_EncashedLeaves?: number;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
}

/**
 * Response data structure from PeriodGetReport endpoint
 */
export interface GetPeriodLeaveReportDataResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: PeriodLeaveReportDataItem[];
    periodReportList?: PeriodLeaveReportDataItem[];
    leavePeriodReportList?: PeriodLeaveReportDataItem[];
    reportData?: PeriodLeaveReportDataItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for PeriodGetReport
 */
export interface GetPeriodLeaveReportDataResponse {
    success: boolean;
    message: string;
    data: GetPeriodLeaveReportDataResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for GetReportYearwise endpoint
 * POST /api/LeaveReportWrapperFacade/GetReportYearwise
 */
export interface GetLeaveReportYearwiseRequest {
    MI_Id: number;
    selectedLeave?: string;
    selectedEmployee?: string;
    HRELTD_FromDate?: string;
    HRELT_ToDate?: string;
    Edit_flag?: boolean;
    selectedreport?: number[];
    UserId?: number;
    valreturn?: string;
    [key: string]: any; // Allow additional fields
}

/**
 * Yearwise report item from API response
 */
export interface LeaveReportYearwiseItem {
    [key: string]: any;
    // Key fields that might be present
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRML_Id?: number;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    year?: string;
    yearName?: string;
    HRELS_OBLeaves?: number;
    HRELS_CreditedLeaves?: number;
    HRELS_TotalLeaves?: number;
    HRELS_CBLeaves?: number;
    HRELS_TransLeaves?: number;
    HRELS_EncashedLeaves?: number;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
}

/**
 * Response data structure from GetReportYearwise endpoint
 */
export interface GetLeaveReportYearwiseResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveReportYearwiseItem[];
    yearwiseReportList?: LeaveReportYearwiseItem[];
    leaveYearwiseReportList?: LeaveReportYearwiseItem[];
    reportData?: LeaveReportYearwiseItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
    valreturn?: string;
}

/**
 * Full API response structure for GetReportYearwise
 */
export interface GetLeaveReportYearwiseResponse {
    success: boolean;
    message: string;
    data: GetLeaveReportYearwiseResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

