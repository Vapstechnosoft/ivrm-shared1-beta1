/**
 * Request payload for GetLeaveOB endpoint
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetLeaveOB
 */
export interface GetLeaveOBRequest {
    MI_Id: number;
}

/**
 * Leave Opening Balance item from API response
 */
export interface LeaveOBItem {
    [key: string]: any;
    // Key fields that might be present
    HREOBL_Id?: number;
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRML_Id?: number;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    HREOBL_Date?: string;
    HREOBL_OBLeaves?: number;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
    HRMLY_Id?: number;
    HRMLY_LeaveYear?: string;
}

/**
 * Response data structure from GetLeaveOB endpoint
 */
export interface GetLeaveOBResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveOBItem[];
    leaveOBList?: LeaveOBItem[];
    openingBalanceList?: LeaveOBItem[];
    leaveOpeningBalanceList?: LeaveOBItem[];
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
 * Request payload for GetDepartments endpoint
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetDepartments
 */
export interface GetLeaveOpeningBalanceDepartmentsRequest {
    MI_Id: number;
}

/**
 * Department item from API response
 */
export interface LeaveOpeningBalanceDepartmentItem {
    [key: string]: any;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMD_Order?: number;
    HRMD_ActiveFlag?: boolean;
}

/**
 * Response data structure from GetDepartments endpoint
 */
export interface GetLeaveOpeningBalanceDepartmentsResponseData {
    [key: string]: any;
    // Common fields that might be present
    DepartmentTempDto?: LeaveOpeningBalanceDepartmentItem[];
    departmentdropdownlist?: LeaveOpeningBalanceDepartmentItem[];
    departmentList?: LeaveOpeningBalanceDepartmentItem[];
    departments?: LeaveOpeningBalanceDepartmentItem[];
    GridviewDetails?: LeaveOpeningBalanceDepartmentItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetDepartments
 */
export interface GetLeaveOpeningBalanceDepartmentsResponse {
    success: boolean;
    message: string;
    data: GetLeaveOpeningBalanceDepartmentsResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for GetDesignation endpoint
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetDesignation
 */
export interface GetLeaveOpeningBalanceDesignationRequest {
    MI_Id: number;
}

/**
 * Designation item from API response
 */
export interface LeaveOpeningBalanceDesignationItem {
    [key: string]: any;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
    HRMDES_Order?: number;
    HRMDES_ActiveFlag?: boolean;
}

/**
 * Response data structure from GetDesignation endpoint
 */
export interface GetLeaveOpeningBalanceDesignationResponseData {
    [key: string]: any;
    // Common fields that might be present
    DesignationTempDto?: LeaveOpeningBalanceDesignationItem[];
    designationdropdownlist?: LeaveOpeningBalanceDesignationItem[];
    designationList?: LeaveOpeningBalanceDesignationItem[];
    designations?: LeaveOpeningBalanceDesignationItem[];
    GridviewDetails?: LeaveOpeningBalanceDesignationItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetDesignation
 */
export interface GetLeaveOpeningBalanceDesignationResponse {
    success: boolean;
    message: string;
    data: GetLeaveOpeningBalanceDesignationResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Request payload for GetOBDetails endpoint
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetOBDetails
 */
export interface GetOBDetailsRequest {
    MI_Id: number;
}

/**
 * OB Details item from API response
 */
export interface OBDetailsItem {
    [key: string]: any;
    // Key fields that might be present
    HREOBL_Id?: number;
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRML_Id?: number;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    HREOBL_Date?: string;
    HREOBL_OBLeaves?: number;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
    HRMLY_Id?: number;
    HRMLY_LeaveYear?: string;
}

/**
 * Response data structure from GetOBDetails endpoint
 */
export interface GetOBDetailsResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: OBDetailsItem[];
    obDetailsList?: OBDetailsItem[];
    openingBalanceDetailsList?: OBDetailsItem[];
    detailsList?: OBDetailsItem[];
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetOBDetails
 */
export interface GetOBDetailsResponse {
    success: boolean;
    message: string;
    data: GetOBDetailsResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Employee OB filter item (used in emptypes, empdept, empdesg arrays)
 */
export interface EmployeeOBFilterItem {
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
    HRMGT_Id?: number;
    HRMGT_EmployeeGroupType?: string;
    MI_Id?: number;
}

/**
 * Request payload for GetEmployeOB endpoint
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetEmployeOB
 */
export interface GetEmployeOBRequest {
    MI_Id: number;
    emptypes?: EmployeeOBFilterItem[];
    empdept?: EmployeeOBFilterItem[];
    empdesg?: EmployeeOBFilterItem[];
    [key: string]: any; // Allow additional fields
}

/**
 * Employee OB item from API response
 */
export interface EmployeeOBItem {
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
    HRML_Id?: number;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    HREOBL_Id?: number;
    HREOBL_Date?: string;
    HREOBL_OBLeaves?: number;
    HRMLY_Id?: number;
    HRMLY_LeaveYear?: string;
    leave_ob_name?: string;
}

/**
 * Response data structure from GetEmployeOB endpoint
 */
export interface GetEmployeOBResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: EmployeeOBItem[];
    employeeOBList?: EmployeeOBItem[];
    employeOBList?: EmployeeOBItem[];
    employeeList?: EmployeeOBItem[];
    emptypes?: EmployeeOBFilterItem[];
    empdept?: EmployeeOBFilterItem[];
    empdesg?: EmployeeOBFilterItem[];
    DepartmentTempDto?: Array<{ HRMD_Id: number; HRMD_DepartmentName: string }>;
    DesignationTempDto?: Array<{ HRMDES_Id: number; HRMDES_DesignationName: string }>;
    GroupTypeTempDto?: Array<{ HRMGT_Id: number; HRMGT_EmployeeGroupType: string }>;
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetEmployeOB
 */
export interface GetEmployeOBResponse {
    success: boolean;
    message: string;
    data: GetEmployeOBResponseData;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;
}

/**
 * Temp table data item (used in temp_table_data array for Save)
 */
export interface LeaveOpeningBalanceTempTableItem {
    [key: string]: any;
    // Key fields that might be present
    HREOBL_Id?: number;
    HRME_Id?: number;
    HRML_Id?: number;
    HRMLY_Id?: number;
    HREOBL_Date?: string;
    HREOBL_OBLeaves?: number;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    leave_ob_name?: string;
    MI_Id?: number;
    CreatedDate?: string;
    UpdatedDate?: string;
}

/**
 * Request payload for Save endpoint
 * POST /api/LeaveOpeningBalanceWrapperFacade/Save
 */
export interface SaveLeaveOpeningBalanceRequest {
    MI_Id: number;
    HRME_Id?: number;
    HRMLY_Id?: number;
    temp_table_data?: LeaveOpeningBalanceTempTableItem[];
    [key: string]: any; // Allow additional fields
}

/**
 * Response data structure from Save endpoint
 */
export interface SaveLeaveOpeningBalanceResponseData {
    [key: string]: any;
    // Common fields that might be present
    returnval?: boolean;
    returnval_add?: boolean;
    returnval_Update?: boolean;
    retrunMsg?: string;
    message?: string;
    dupr?: boolean;
    returnduplicatestatus?: string;
    HREOBL_Id?: number;
    data?: any;
}

/**
 * Full API response structure for Save
 */
export interface SaveLeaveOpeningBalanceResponse {
    success: boolean;
    message: string;
    data: SaveLeaveOpeningBalanceResponseData;
}

/**
 * Request payload for DeletePages endpoint
 * POST /api/LeaveOpeningBalanceWrapperFacade/DeletePages
 */
export interface DeleteLeaveOpeningBalanceRequest {
    HREOBL_Id: number;
}

/**
 * Response data structure from DeletePages endpoint
 */
export interface DeleteLeaveOpeningBalanceResponseData {
    [key: string]: any;
    // Common fields that might be present
    returnval?: boolean;
    retrunMsg?: string;
    message?: string;
}

/**
 * Full API response structure for DeletePages
 */
export interface DeleteLeaveOpeningBalanceResponse {
    success: boolean;
    message: string;
    data: DeleteLeaveOpeningBalanceResponseData;
}

/**
 * Request payload for GetPageDetails endpoint
 * POST /api/LeaveOpeningBalanceWrapperFacade/GetPageDetails
 */
export interface GetLeaveOpeningBalancePageDetailsRequest {
    Id: number;
}

/**
 * Page details item from API response
 */
export interface LeaveOpeningBalancePageDetailsItem {
    [key: string]: any;
    // Key fields that might be present
    HREOBL_Id?: number;
    HRME_Id?: number;
    HRME_EmployeeCode?: string;
    HRME_EmployeeFirstName?: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRML_Id?: number;
    HRML_LeaveName?: string;
    HRML_LeaveCode?: string;
    HRMLY_Id?: number;
    HRMLY_LeaveYear?: string;
    HREOBL_Date?: string;
    HREOBL_OBLeaves?: number;
    leave_ob_name?: string;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
}

/**
 * Response data structure from GetPageDetails endpoint
 */
export interface GetLeaveOpeningBalancePageDetailsResponseData {
    [key: string]: any;
    // Common fields that might be present
    GridviewDetails?: LeaveOpeningBalancePageDetailsItem[];
    pageDetails?: LeaveOpeningBalancePageDetailsItem;
    details?: LeaveOpeningBalancePageDetailsItem;
    data?: LeaveOpeningBalancePageDetailsItem;
    message?: string;
    returnval?: boolean;
    retrunMsg?: string;
}

/**
 * Full API response structure for GetPageDetails
 */
export interface GetLeaveOpeningBalancePageDetailsResponse {
    success: boolean;
    message: string;
    data: GetLeaveOpeningBalancePageDetailsResponseData;
}

