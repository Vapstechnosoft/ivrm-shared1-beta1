export interface IBookCirculationReportInitialData {
    lib_list: Array<{
        lmaL_Id: number;
        lmaL_LibraryName: string;
    }>;
    classList?: Array<{
        asmcL_Id: number;
        asmcL_ClassName: string;
    }>;
    sectionList?: Array<{
        asmS_Id: number;
        asmC_SectionName: string;
    }>;
    // Subject filters
    parentsubjectlist?: Array<{
        ismS_Id: number;
        ismS_SubjectName: string;
    }>;
    subsubjectlist?: Array<{
        lmS_Id: number;
        lmS_SubjectName: string;
        lmS_ParentId: number;
    }>;
    booktype?: any[];
    booktitle?: any[];
}

export interface IBookCirculationReportRequest {
    Type: string; // Book Type: all, Issue, Reference, etc.
    AGType: 'Student' | 'Staff' | 'Guest' | 'Department' | 'all';
    TrnType: string; // Transaction Status: all, Issue, Return
    IssueFromDate?: string;
    IssueToDate?: string;
    DueFromdate?: string;
    DueTodate?: string;
    LMAL_Id: number;
    selectedClasslist?: Array<{ asmcL_Id: number }>;
    selectedSectionlist?: Array<{ asmS_Id: number }>;
    selectedSubjectlist?: Array<{ ismS_Id: number }>;
    selectedSubSubjectlist?: Array<{ lmS_Id: number }>;
}

// Union of all possible fields for different member types
export interface IBookCirculationReportGridData {
    LMB_BOOKTITLE: string;
    LMBANO_ACCESSIONNO: string;
    LBTR_STATUS: string;
    LBTR_ISSUEDDATE: string;
    LBTR_DUEDATE: string;
    LBTR_RETURNEDDATE: string | null;
    LBTR_FINECOLLECTED: number;
    LBTR_TOTALFINE: number;
    LMB_BOOKTYPE: string;

    // Student specific
    AMST_ADMNO?: string;
    AMST_NAME?: string;
    ASMCL_CLASSNAME?: string;
    ASMC_SECTIONNAME?: string;
    AMAY_ROLLNO?: string;
    LATEDAYS?: number;

    // Subject info
    ISMS_SUBJECTNAME?: string;
    LMS_SUBJECTNAME?: string;

    // Staff specific
    EMPNAME?: string;
    HRME_EMPLOYEECODE?: string;

    // Guest specific
    LBTR_GUESTNAME?: string;
    LBTR_GUESTEMAILID?: string;
    LBTR_GUESTCONTACTNO?: string;

    // Department specific
    HRMD_DEPARTMENTNAME?: string;
}

export interface IBookCirculationReportResponse {
    reportlist: IBookCirculationReportGridData[];
}
