// API Response interface
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// Request interfaces
export interface EmployeeProfileReportOnloadRequest {
    MI_Id: number;
    roleId: number;
    retrunMsg: string;
    groupTypedropdown: GroupTypeDropdown[];
    departmentdropdown: DepartmentDropdown[];
    designationdropdown: DesignationDropdown[];
    employeedropdown: EmployeeDropdown[];
}

export interface EmployeeProfileReportSearchRequest {
    MI_Id: number;
    groupTypeIds: number[];
    departmentIds: number[];
    designationIds: number[];
    employeeIds: number[];
    roleId: number;
}

export interface EmployeeProfileReportFilterRequest {
    MI_Id: number;
    LogInUserId: number;
    hrmgT_IdList?: number[];
    hrmD_IdList?: number[];
    hrmdeS_IdList?: number[];
}

export interface EmployeeProfileReportFilterResponse extends ApiResponse<any> {
    data: {
        employeedropdown?: EmployeeDropdown[];
    };
}

// Response interfaces
export interface GroupTypeDropdown {
    HRMGT_Id: number;
    MI_Id: number;
    HRMGT_EmployeeGroupType: string;
    HRMGT_Code: string;
    HRMGT_Order: number;
    HRMGT_ActiveFlag: boolean;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface DepartmentDropdown {
    HRMD_Id: number;
    MI_Id: number;
    HRMD_DepartmentName: string;
    HRMD_Order: number;
    HRMD_ActiveFlag: boolean;
    HRMDC_ID: number | null;
    HRMD_InternalTrainingMinimumHrs: number;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface DesignationDropdown {
    HRMDES_Id: number;
    MI_Id: number;
    HRMDES_DesignationName: string;
    HRMDES_BasicAmount: number;
    HRMDES_SanctionedSeats: number;
    HRMDES_DisplaySanctionedSeatsFlag: boolean;
    HRMDES_Order: number;
    HRMDES_ActiveFlag: boolean;
    HRMDC_ID: number | null;
    CreatedDate: string;
    UpdatedDate: string;
}

export interface EmployeeDropdown {
    HRME_Id: number;
    MI_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName: string | null;
    HRME_EmployeeLastName: string;
    HRME_DateOfJoining: string;
    HRME_DateOfLeaving?: string;
    HRME_MobileNo: string;
    HRME_EmailID: string;
    HRME_ProfilePhoto?: string;
    HRMGT_Id: number;
    HRMD_Id: number;
    HRMDES_Id: number;
}

export interface EmployeeProfileReportResponse {
    MI_Id: number;
    roleId: number;
    retrunMsg: string;
    groupTypedropdown: GroupTypeDropdown[];
    departmentdropdown: DepartmentDropdown[];
    designationdropdown: DesignationDropdown[];
    employeedropdown: EmployeeDropdown[];
}

export interface EmployeeProfileDetailResponse {
    employeeDetails: EmployeeProfileDetail;
    success: boolean;
    message: string;
}

export interface EmployeeProfileDetail {
    EmployeeCode: string;
    EmployeeName: string;
    Designation: string;
    InstitutionName: string;
    ContactDetails: string[];
    EmailId: string;
    JoinDate: string;
    LeftDate: string;
    TotalServiceDays: number;
    BloodGroup: string;
    Address: string;
    Age: number;
    Religion: string;
    DOB: string;
    AadharCardNumber: string;
    FatherName: string;
    ProfilePhoto?: string;
}

// Type exports
export type EmployeeProfileReportOnloadResponse = ApiResponse<EmployeeProfileReportResponse>;
export type EmployeeProfileReportSearchResponse = ApiResponse<EmployeeProfileDetailResponse>;
