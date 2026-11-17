export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
    Selected?: boolean;
}

export interface IMonth {
    ivrM_Month_Id: number;
    ivrM_Month_Name: string;
    Selected?: boolean;
}

export interface IMonthEndReportData {
    trmR_Id: number;
    trmR_RouteName: string;
    trmR_order: number;
    stdCnt: number;
}

export interface IMonthEndReportResponse {
    acdlist: IAcademicYear[];
    monthlist: IMonth[];
    fillstudentstrenth: IMonthEndReportData[];
    success: boolean;
    message: string;
}

export interface IMonthEndReportParams {
    ASMAY_Id: number;
    IVRM_Month_Id: number;
}
