export interface IEmployeePunchAttendanceInitialData {
    filldepartment: IEmployeeDetails[];
}

export interface IEmployeeDetails {
    empFname: string;
    empMname: string;
    empLname: string;
    hrmE_DOJ: string;
    hrmD_DepartmentName: string;
    hrmdeS_DesignationName: string;
}

export interface IEmployeePunchAttendanceReportData {
    emp_punchDetails: IPunchDetail[] | null;
}

export interface IPunchDetail {
    punchdate: string;
    punchINtime: string;
    punchOUTtime: string;
    lateby: string;
    earlyby: string;
}

export interface IEmployeePunchAttendanceFilter {
    fromdate: string;
    todate: string;
}
