export interface IAttendanceReportInitialData {
    academicList: IAcademicYear[];
    category_list: ICategory[];
    categoryflag: boolean;
    photopathname?: string;
    amC_logo?: any[];
}

export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
    selected?: boolean;
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

export interface IAttendanceReportSearch {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMC_Id: number;
    AMC_Id: number;
    percentage: number;
    type: number; // 1: All, 2: Individual
}

export interface IStudentAttendance {
    Id?: number; // from user.Id in legacy
    AMST_Id: number;
    namme?: string; // Derived or direct
    AMST_FirstName: string;
    AMST_MiddleName?: string;
    Amst_LastName?: string;
    AMST_AdmNo: string;
    AMST_RegistrationNo: string;
    ASMCL_ClassName: string;
    ASMC_SectionName: string;
    classes: number; // Working days
    attendance: number; // Present days
    per: number; // Percentage
    FMCC_ConcessionName?: string;
}

export interface IAttendanceReportResponse {
    studentAttendanceList: IStudentAttendance[];
    amC_logo?: any[];
}
