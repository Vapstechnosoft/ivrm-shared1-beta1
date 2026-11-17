export interface ILibTransactionReportRequest {
    LMAL_Id: number;
    ASMAY_Id: number;
    Issue_Date: string;
    IssueToDate: string;
    statuscount: boolean;
}

export interface ILibTransactionReportGridData {
    ASMCL_Id?: number;
    ASMCL_ClassName?: string;
    ASMS_Id?: number;
    ASMC_SectionName?: string;
    LBTR_Status?: string;
    seccount: number;
}

export interface ILibTransactionReportInitialData {
    yearlist: Array<{
        asmaY_Id: number;
        asmaY_Year: string;
    }>;
    msterliblist1: Array<{
        lmaL_Id: number;
        lmaL_LibraryName: string;
    }>;
}

export interface ILibTransactionReportYearListData {
    departmentList: Array<{
        asmaY_Id: number;
        asmaY_Year: string;
    }>;
}
