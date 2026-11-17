export interface IClassWorkReport {
    icW_Id: number;
    icW_Topic: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    ismS_SubjectName: string;
    icwupl_FileName: string;
    icwupl_Date: string;
    employeename: string | null;
    userName: string | null;
    icW_Attachment: string | null;
    FilesCount?: number;
}

export interface IAttachment {
    icwatT_FileName: string;
    icwatT_Attachment: string;
    icW_Attachment: string | null;
}

export interface IReportPayload {
    fromdate: string;
    todate: string;
    classarray: { ASMCL_Id: number }[] | undefined;
}

export interface IInitialData {
    classlist: {
        asmcL_Id: number;
        asmcL_ClassName: string;
        asmcL_ActiveFlag: boolean;
        mI_Id: number;
    }[];
}

export interface IReportResponse {
    classreportlist: IClassWorkReport[];
}

export interface IAttachmentResponse {
    attachementlist: IAttachment[];
}

export interface IUploadClassDropdownList {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface ISubjectDetails {
    ismS_SubjectName: string;
    ismS_Id: number;
}

export interface IClassWorkDetails {
    asmcL_ClassName: string;
    asmcL_Id: number;
    asmC_SectionName: string;
    asmS_Id: number;
    ismS_SubjectName: string;
    ismS_Id: number;
    icW_Id: number;
    icW_Content: string;
    icW_Topic: string;
    icW_SubTopic: string;
    icW_FromDate: string; // ISO date string
    icW_ToDate: string; // ISO date string
    icW_ActiveFlag: boolean;
    icW_Assignment: string | null;
    icW_TeachingAid: string | null;
    icW_Evaluation: string | null;
    icW_Attachment: string | null;
    icW_FilePath: string | null;
    mI_Id: number;
    asmaY_Id: number;
    ihW_AssignmentNo: number | null;
    ihW_Attachment: string | null;
    ihW_Assignment: string | null;
    ihW_Date: string | null; // ISO date string or null
    ihW_Topic: string | null;
    ihW_ActiveFlag: boolean | null;
    ihW_Id: number | null;
    ivrmuL_Id: number | null;
    ihW_FilePath: string | null;
}

export interface IClassWorkUploadReport {
    topic: string;
    className: string;
    sectionName: string;
    subjectName: string;
    uploadDate: string;
    fileName: string;
    userName: string;
    employeeName: string;
}
