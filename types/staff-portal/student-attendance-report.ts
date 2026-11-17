
export interface IStudentAttendanceReportInitialData {
    academicList: IAcademicYear[];
    monthList: IMonth[];
    category_list: ICategory[];
    classlist: IClass[];
    categoryflag: boolean;
}

export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface IMonth {
    amM_ID: number;
    amM_NAME: string;
}

export interface ICategory {
    amC_Id: number;
    amC_Name: string;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
}

export interface IStudentItem {
    AMST_Id: number;
    name: string;
    AMST_AdmNo: string;
    Selected?: boolean;
}

export interface IReportFilterRequest {
    ASMAY_Id: number;
    ASMCL_Id?: number;
    ASMC_Id?: number;
    radiotype: number; // 1: Monthly, 2: Between Date, 3: Daily
    fromdate?: string;
    todate?: string;
    AMM_ID?: number;
    AMST_Id: number;
    type: number; // 1: All, 2: Individual
    datewise: number; // 0 or 1
    AMC_Id: number;
    classdetailsdata: { ASMCL_Id: number }[];
    sectionsdetailsdata: { ASMS_Id: number }[];
}

export interface IReportResponse {
    studentAttendanceList: IReportRow[];
    countclass: number;
    monthList: { day: string }[]; // For matrix view
    institutiondetails: any[];
    totalpercentageatt: any[];
}

export interface IReportRow {
    name: string;
    AMST_AdmNo: string;
    AMAY_RollNo: string;
    ASA_ClassHeld: number;
    ASA_Class_Attended: number;
    Percentage: number;
    Remarks: string;
    total?: number; // Calculated field
    percentage?: number; // Calculated field
    [key: string]: any; // For dynamic date columns (P, A, HO, etc.)
}
