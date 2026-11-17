export interface IAvailableBooksReportInitialData {
    libraryList: Array<{
        lmaL_Id: number;
        lmaL_LibraryName: string;
    }>;

    departmentList: Array<{
        lmD_Id: number;
        lmD_DepartmentName: string;
    }>;
}

export interface IAvailableBooksReportRequest {
    Type: string;
    Type2: string;
    LMD_Id: number;
    LMAL_Id: number;
    Fromdate?: string;
    ToDate?: string;
    statuscount: boolean;
    subjectsthomos: boolean;
    stthomosSubject: any[];
}

export interface IAvailableBooksReportGridData {
    lmB_EntryDate: string;
    lmbanO_AccessionNo: string;
    lmB_BookTitle: string;
    lmB_ISBNNo?: string;
    lmB_CallNo: string;
    lmB_ClassNo?: string;
    lmB_NetPrice: number;
    lmB_BookType: string;
    lmD_DepartmentName: string;
    authorName: string;
    lmP_PublisherName: string;
    lmL_LanguageName: string;
    lmS_SubjectName: string;
    lmB_PurOrDonated?: string;
    lmB_Price?: number;
    lmB_BillNo?: string;
    lmB_PurchaseDate?: string;
}

export type IAvailableBooksReportResponse = IAvailableBooksReportGridData[];
