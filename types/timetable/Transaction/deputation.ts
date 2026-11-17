export interface IDeputationForm {
    asmaY_Id: string;
    ttmD_Date: Date;
    absent_Staff_Flag: boolean;
    hrE_Id: string;
    ttmD_Day: string;
    ttmD_Remarks: string;
    sms_Flag: boolean;
    email_Flag: boolean;
    notification_Flag: boolean;
}

export interface IStaffDropdown {
    hrE_Id: number;
    staffName: string;
}

export interface IAcademicYearDropdown {
    asmaY_Id: number;
    asmaY_Year: string;
}
