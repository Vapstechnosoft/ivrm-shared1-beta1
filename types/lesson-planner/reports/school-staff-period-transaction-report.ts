export interface ITransactionReportFilter {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    HRME_Id: number;
}

export interface ITransactionReportPayload {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    HRME_Id: number;
}

export interface IEmployee {
    hrmE_Id: number;
    employeename: string;
}

export interface IYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
}

export interface ITransactionReportEmployee {
    isms_id: number;
    subjectname: string;
    staffname: string;
}

export interface ITransactionReportDetail {
    isms_id: number;
    topicname: string;
    allocateddate: string;
    staffname: string;
    lplcD_FilePath?: string;
    filepath?: string; // New API field name
    subjectname?: string;
    classname?: string;
    sectionname?: string;
}

export interface ITransactionReportResponse {
    masteryear: IYear[];
    masterclass?: IClass[];
    mastersection?: ISection[];
    employeedetails?: IEmployee[];

    getreport?: ITransactionReportDetail[];
    getreportemployee?: ITransactionReportEmployee[];

    // API also returns data as flat array
    data?: ITransactionReportDetail[];

    message?: string;
}
