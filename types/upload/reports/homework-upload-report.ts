export interface IHomeWorkReport {
    ihW_Id: number;
    ihW_Topic: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    ismS_SubjectName: string;
    ihwupl_FileName: string;
    ihwupl_Date: string;
    employeename: string | null;
    userName: string | null;
    ihW_Attachment: string | null;
    asmaY_Id?: number;
}

export interface IHomeWorkAttachment {
    ihwatT_FileName: string;
    ihwatT_Attachment: string;
    ihW_Attachment: string | null;
}

export interface IHomeWorkReportPayload {
    fromdate: string;
    todate: string;
    classarray: { ASMCL_Id: number }[] | undefined;
    type: string;
}

export interface IHomeWorkReportResponse {
    classreportlist: IHomeWorkReport[];
}

export interface IHomeWorkAttachmentResponse {
    attachementlist: IHomeWorkAttachment[];
}
export interface IHomeWorkDetails {
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

export interface IHomeWorkUploadReport {
    topic: string;
    className: string;
    sectionName: string;
    subjectName: string;
    uploadDate: string;
    fileName: string;
    userName: string;
    employeeName: string;
}
