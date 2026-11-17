export interface IInvRMonthEndReportLoadData {
    acayear: IInvRMonthEndReportAcademicYear[];
    month_array: IInvRMonthEndReportMonth[];
}

export interface IInvRMonthEndReportAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface IInvRMonthEndReportMonth {
    ivrM_Month_Id: number;
    ivrM_Month_Name: string;
}

export interface IInvRMonthEndReportPayload {
    ASMAY_Id: number;
    month: string | number; // IVRM_Month_Id
    year: string; // The split year string (e.g., "2023" or "2024")
    IE_Name?: string; // Optional field for report header
}

export interface IInvRMonthEndReportData {
    grnCount: number;
    salesCount: number;
    itemCount: number;
    email: number;
    sms: number;
}

export interface IInvRMonthEndReportTableRow {
    id: number;
    inventory: string;
    count: number;
    sms: number;
    email: number;
}
