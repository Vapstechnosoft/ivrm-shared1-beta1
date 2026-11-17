export interface IRackReportInitialData {
    lib_list: Array<{
        lmaL_Id: number;
        lmaL_LibraryName: string;
    }>;
    racklist: Array<{
        lmrA_Id: number;
        lmrA_RackName: string;
        lmrA_FloorName?: string;
    }>;
    booklist?: Array<{
        lmb_Id: number;
        lmb_BookTitle: string;
    }>;
    subjectlist?: Array<{
        lmsU_Id: number;
        lmsU_SubjectName: string;
    }>;
    floorlist?: Array<any>;
}

export interface IRackReportRequest {
    MI_Id?: number;
    LMAL_Id: number;
    FromDate?: string;
    ToDate?: string;
    LMRA_Id: number | string;
    LMB_Id?: number;
    LMSU_Id?: number;
    IssueStatus?: string;
    ReturnStatus?: string;
}

export interface IRackReportGridData {
    lmbano_AccessionNo: string;
    lmb_BookTitle: string;
    rack_Name: string;
    lmra_FloorName: string;
    lmb_BookType: string;
    rack_Location: string;
    lmbano_AvialableStatus: string;
}

export interface IRackReportResponse {
    reportlist: IRackReportGridData[];
}
