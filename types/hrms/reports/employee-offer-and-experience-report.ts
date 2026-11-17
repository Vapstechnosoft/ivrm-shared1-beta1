// Employee Offer and Experience Report Types

export interface EmployeeOfferAndExperienceReportFilterRequest {
    MI_Id: number;
    HRMGT_Id: number;
    HRMD_Id: number;
    HRMDES_Id: number;
    LogInUserId: number;
}

export interface EmployeeOfferAndExperienceReportSearchRequest {
    MI_Id: number;
    HRMGT_Id: number;
    HRMD_Id: number;
    HRMDES_Id: number;
    LogInUserId: number;
}

export interface EmployeeDropdown {
    HRME_Id: number;
    HRME_EmployeeCode: string;
    HRME_EmployeeFirstName: string;
    HRME_EmployeeMiddleName?: string;
    HRME_EmployeeLastName?: string;
    HRMD_Id?: number;
    HRMD_DepartmentName?: string;
    HRMDES_Id?: number;
    HRMDES_DesignationName?: string;
    HRMGT_Id?: number;
    HRMGT_EmployeeGroupType?: string;
    HRME_DOJ?: string;
    HRME_DOL?: string;
    HRME_LeftFlag?: boolean;
    HRMET_Id?: number;
    HRMET_EmployeeType?: string;
}

export interface EmployeeOfferAndExperienceReportFilterResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    employeedropdown: EmployeeDropdown[] | null;
}

export interface EmployeeOfferAndExperienceReportSearchResponse {
    MI_Id: number;
    retrunMsg: string | null;
    roleId: number;
    employeedropdown: EmployeeDropdown[] | null;
}

