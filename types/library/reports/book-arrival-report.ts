export interface IBookArrivalReportInitialData {
    lib_list: Array<{
        lmaL_Id: number;
        lmaL_LibraryName: string;
    }>;
    deptlist: Array<{
        lmD_Id: number;
        lmD_DepartmentName: string;
    }>;
}

export interface IBookArrivalReportRequest {
    p_type: string;
    p_type2: string;
    p_lmd_id: string | number;
    p_fromdate?: string;
    p_todate?: string;
    p_lmal_id: number;
    p_lms_id?: string | number;
    subjectsthomos?: boolean;
    stthomosSubject?: Array<{ lmS_Id: number }>;
}

export interface IBookArrivalReportGridData {
    lmbanO_AccessionNo: string;
    lmB_BookTitle: string;
    lmB_ISBNNo?: string;
    lmB_CallNo: string;
    lmB_ClassNo?: string;
    lmB_BookType: string;
    lmD_DepartmentName: string;
    authorName: string;
    lmP_PublisherName: string;
    lmL_LanguageName: string;
    lmB_PurOrDonated: string;
    lmB_EntryDate: string;
    lmB_PurchaseDate: string;
}

export interface IBookArrivalReportResponse {
    success: boolean;
    message: string;
    data: IBookArrivalReportGridData[];
    reportlist?: IBookArrivalReportGridData[];
}
