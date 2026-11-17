// Front Office Month End Report API Types

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    total?: number;
    page?: number;
    page_size?: number;
}

// Class from API response
export interface FOMonthEndReportClass {
    asmcL_Id: number;
    mI_Id: number;
    asmcL_ClassName: string;
    asmcL_MinAgeYear: number;
    asmcL_MinAgeMonth: number;
    asmcL_MinAgeDays: number;
    asmcL_MaxAgeYear: number;
    asmcL_MaxAgeMonth: number;
    asmcL_MaxAgeDays: number;
    asmcL_Order: number;
    asmcL_ClassCode: string | null;
    asmcL_ActiveFlag: boolean;
    asmcL_MaxCapacity: number;
    school_M_ClassList: any | null;
    returnval: any | null;
    enteredData: any | null;
    searchColumn: any | null;
    count: number;
    message: any | null;
    asmcL_PreadmFlag: number;
    getclasslist: any | null;
    createdDate: string | null;
    updatedDate: string | null;
}

// Section from API response
export interface FOMonthEndReportSection {
    asmS_Id: number;
    mI_Id: number;
    asmC_SectionName: string;
    asmC_SectionCode: string | null;
    asmC_Order: number;
    asmC_ActiveFlag: number;
    asmC_MaxCapacity: number;
    createdDate: string | null;
    updatedDate: string | null;
}

// Month from API response
export interface FOMonthEndReportMonth {
    mI_Id: number;
    filltypes: any | null;
    filldepartment: any | null;
    filldesignation: any | null;
    fillemployee: any | null;
    filldata: any | null;
    multipletype: any | null;
    multipledep: any | null;
    multipledes: any | null;
    multiplehrmeid: any | null;
    hrmD_Id: number;
    hrmD_DepartmentName: string | null;
    hrmdeS_Id: number;
    hrmdeS_DesignationName: string | null;
    hrmE_Id: number;
    hrmE_EmployeeFirstName: string | null;
    hrmE_EmployeeMiddleName: string | null;
    hrmE_EmployeeLastName: string | null;
    hrmE_EmployeeCode: string | null;
    selectdate: any | null;
    selectmonth: any | null;
    selectyear: any | null;
    fromdate: any | null;
    todate: any | null;
    punchtype: any | null;
    fillmonth: any | null;
    monthid: number;
    monthname: string;
    fillyear: any | null;
    yearid: number;
    userId: number;
    role_flag: any | null;
    ivrmrT_Id: number;
}

// Year from API response
export interface FOMonthEndReportYear {
    hrmlY_Id: number;
    mI_Id: number;
    hrmlY_LeaveYear: string;
    hrmlY_FromDate: string;
    hrmlY_ToDate: string;
    hrmlY_ActiveFlag: boolean;
    leaveYearList: any | null;
    retrunMsg: any | null;
    roleId: number;
    asmaY_From_Date: string | null;
    asmaY_To_Date: string | null;
    hrmlY_LeaveYearOrder: number;
    yeardetailList: any | null;
    leaveorderDTO: any | null;
    createdDate: string | null;
    updatedDate: string | null;
}

// Request body for getdata endpoint
export interface FOMonthEndReportGetDataRequest {
    page: number;
    page_size: number;
    search_query: string;
    search_column: string;
    sort_column: string;
    sort_direction: string;
    is_export: boolean;
    miid: number;
    loginUserId: number;
    userRole: string;
}

// Response data structure
export interface FOMonthEndReportGetDataResponse {
    classes: FOMonthEndReportClass[];
    sections: FOMonthEndReportSection[];
    months: FOMonthEndReportMonth[];
    years: FOMonthEndReportYear[];
}

// Full API Response
export interface FOMonthEndReportApiResponse {
    success: boolean;
    message: string;
    data: FOMonthEndReportGetDataResponse;
    total: number;
    page: number;
    page_size: number;
}

