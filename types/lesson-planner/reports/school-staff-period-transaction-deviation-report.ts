export interface IDeviationReportFilter {
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    HRME_Id: number;
}

export interface IDeviationReportPayload {
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

export interface IDeviationReportEmployee {
    isms_id: number;
    subjectname: string;
    staffname: string;
}

export interface IDeviationReportDetail {
    isms_id: number;
    topicname: string;
    allocateddate: string;
    takendate: string;
    datediffcount: number;
    staffname: string;
    subjectname?: string; // Present in flat API structure
    classname?: string;
    sectionname?: string;
}

export interface IDeviationReportResponse {
    masteryear: IYear[];
    masterclass?: IClass[];
    mastersection?: ISection[];
    employeedetails?: IEmployee[];

    getdevationreport?: IDeviationReportDetail[];
    getdevationreportemployee?: IDeviationReportEmployee[];

    // API returns data array directly
    data?: IDeviationReportDetail[];

    message?: string; // Optional message
}
