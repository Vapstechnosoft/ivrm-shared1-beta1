export interface IBookRegisterReportRequest {
    Type: string;
    LMD_Id: number;
}

export interface IBookRegisterReportGridData {
    lmB_BookType: string;
    lmD_DepartmentName: string;
    lmB_BookTitle: string;
    lmP_PublisherName: string;
    lmbA_AuthorFirstName: string;
    lmL_LanguageName: string;
    lmS_SubjectName: string;
    lmB_EntryDate: string;
    lmB_PurchaseDate: string;
    lmB_ISBNNo: string;
    lmB_PurOrDonated: string;
}

export interface IBookRegisterReportInitialData {
    deptlist: Array<{
        lmD_Id: number;
        lmD_DepartmentName: string;
    }>;
    clsslist?: any[];
    booktype?: any[];
}
