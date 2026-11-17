export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_From_Date: string;
    asmaY_To_Date: string;
    Selected?: boolean;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
}

export interface ISubject {
    ismS_Id: number;
    ismS_SubjectName: string;
}

export interface IMonth {
    ivrM_Month_Id: number;
    ivrM_Month_Name: string;
}

export interface IPeriod {
    ttmP_Id: number;
    ttmP_PeriodName: string;
    Selected?: boolean;
}

export interface IBatch {
    asasB_Id: number;
    asasB_BatchName: string;
}

export interface IStudentAttendance {
    amsT_Id: number;
    studentname: string;
    amsT_AdmNo: string;
    amsT_RegistrationNo: string;
    amaY_RollNo: number;
    selected: boolean;
    pdays: number | string;
    FirstHalfflag: boolean;
    SecondHalfflag: boolean;
    asA_Id: number;
    asA_Dailytwice_Flag?: string;
}

// export interface IStudentList {
//     amsT_Id: number;

//       amaY_RollNo: number,
//       amsT_AdmNo: string,
//       studentname: string,
//      // pday: null,
//      // selected: null,
//      // asaS_Id: null,
//      // firstHalfflag: null,
//      // secondHalfflag: null,
//     //  asA_Dailytwice_Flag: null,
//       asA_Id: number,
//      // ttmP_Id: null,
//       ismS_Id: number,
//       asasB_Id: number,
//       amsT_RegistrationNo: string
// }

export interface IAttendanceConfig {
    asC_Att_Default_OrderFlag: number;
}

export interface IStandardConfig {
    ivrmgC_AdmnoColumnDisplay: number;
    ivrmgC_RegnoColumnDisplay: number;
    ivrmgC_RollnoColumnDisplay: number;
}

export interface IAttendanceEntryInitialData {
    academicYearList: IAcademicYear[];
    currentYear: IAcademicYear[];
    classList: IClass[];
    sectionList: ISection[];
    monthList: IMonth[];
    subjectList: ISubject[];
    batchList: IBatch[];
    periodlist: IPeriod[];
    message: string | null;
    //studentList: IStudentList[];
}

export interface IStudentDataResponse {
    studentList: IStudentAttendance[];
    asA_Att_EntryType: 'D' | 'H' | 'M' | 'P' | string;
    sectionList: ISection[];
    admissionstandarad: IAttendanceConfig[];
    getstandarad: IStandardConfig[];
    attendanceentryflag: 'A' | 'P' | string;
    countclass1: number;
    message: string | null;
    subjectList: ISubject[];
    // For monthly
    countclass?: number;
    startdate?: string;
    enddate?: string;
    // For period
    attcount?: number;
    asA_Regular_Extra?: string;
}

export interface IViewHistoryResponse {
    viewStudentPeriodWiseAttDetails: {
        ASMAY_Year: string;
        ASMCL_ClassName: string;
        ASMC_SectionName: string;
        ASA_FROMDATE: string;
        ASA_Entry_DateTime: string;
        ISMS_SUBJECTNAME?: string;
        TTMP_PeriodName?: string;
        EMPLOYEENAME: string;
        TotalCount?: number;
        PresentCount?: number;
        AbsentCount?: number;
        DELETE_FLAG: number;
        ASA_Id: number;
    }[];
}

export interface ISaveAttendanceRequest {
    ASA_Id: number;
    ismS_Id: number;
    ASMAY_Id: number;
    ASA_Att_Type: string;
    ASMCL_Id: number;
    ASMS_Id: number;
    TTMP_Id: number;
    ASA_Entry_DateTime: string;
    ASA_FromDate: string;
    ASA_ToDate: string;
    ASA_ClassHeld: string;
    ASA_Regular_Extra: string;
    asasB_Id: number;
    stdList: IStudentAttendance[];
}
