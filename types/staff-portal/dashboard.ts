export interface IEmployeeDashboardResponse {
    yearlist: IAcademicYear[];
    asmaY_Id: number;
    empProfile: IEmployeeProfile[];
    filldepartment: IEmployeeBasicDetails[];
    coedata: IEvent[];
    calenderlist: IEvent[];
    studentcount: number;
    assetcount: number;
    purchasecount: number;
    bookcount: number;
    hrmE_TechNonTeachingFlg: string;
    medicalCount: IMedicalCount[];
    classsection: any[];
    classhandling: any[];
    displyamessage: any[];
    mobile: Array<{ hrmE_MobileNo: number }>;
    email: Array<{ hrmE_EmailId: string }>;
    tT_final_generation: ITTFinalGeneration[];
    allperiods: IAllPeriod[];
    periods: any[];
    class_sectons: any[];
    assetlist?: IAsset[];
    purchaselist?: IPurchase[];
    booklist?: IBook[];
    bookFillist?: IBookFile[];
    noticeboard?: INoticeBoard[];
    attachementlist?: INoticeAttachment[];
}

export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface IEmployeeProfile {
    hrmE_Id: number;
    hrmereqreQ_ConformFlg: number | null;
    hrmereqreQ_ReqStatus: string;
}

export interface IEmployeeBasicDetails {
    hrmE_Id: number;
    hrmE_EmployeeFirstName: string;
    hrmE_DOJ: string;
    hrmD_DepartmentName: string;
    hrmdeS_DesignationName: string;
    hrmE_EmployeeCode: string;
    hrmE_DOB: string;
    hrmE_PhotoNo: string;
}

export interface IEvent {
    eventName: string;
    coemE_EventName: string;
    coeE_EStartDate: string;
    coeE_EEndDate: string;
    title?: string;
    start?: Date;
}

export interface IMedicalCount {
    CountofRecordFiles: number;
}

export interface ITTFinalGeneration {
    periodCount: number;
    dayName: string;
}

export interface IAllPeriod {
    ttmD_DayCode: string;
    ttmD_DayName: string;
}

export interface INoticeBoard {
    INTB_Id: number;
    INTB_Title: string;
    INTB_Description: string;
    INTB_StartDate: string;
    INTB_EndDate: string;
    Filecount: number;
}

export interface INoticeAttachment {
    INTBFL_FileName: string;
    INTBFL_FilePath: string;
    INTB_Attachment: string;
    INTB_Id: number;
}

export interface IAsset {
    INVMI_ItemName: string;
    INVMS_StoreName: string;
    INVACO_CheckOutQty: number;
    INVACO_CheckoutDate: string;
    INVACO_ReceivedBy: string;
}

export interface IPurchase {
    INVMI_ItemName: string;
    INVMS_SupplierName: string;
    INVTPR_PRQty: number;
    INVTPO_POQty: number;
    INVMPR_PRDate: string;
    INVTPO_ExpectedDeliveryDate: string;
}

export interface IBook {
    LMB_BookTitle: string;
    LMB_Id: number;
}

export interface IBookFile {
    LMB_BookTitle: string;
    LMBFILE_FileName: string;
    LMBFILE_FilePath: string;
}

export interface IMedicalRecord {
    hremrF_FilePath: string;
    hremrF_FileName: string;
}

export interface INoticeFilterRequest {
    flag: string;
    OnClickOrOnChange: 'OnClick' | 'OnChange';
    ASMAY_Id?: number;
}

export interface IAssetFilterRequest {
    flag: 'Asset' | 'Purchase' | 'BOOK' | 'BOOKLIST';
    INTB_Id?: number;
}

export interface IMedicalRecordRequest {
    HRME_Id: number;
}
