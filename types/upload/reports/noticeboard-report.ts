export interface INoticeBoardReport {
    intB_Id: number;
    intB_Title: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    intbupl_Date: string;
    employeename: string | null;
    filecount: number;
}

export interface INoticeBoardAttachment {
    intbfL_FileName: string;
    intbfL_FilePath: string;
    intB_Attachment: string | null;
    intB_Id: number;
}

export interface INoticeBoardReportPayload {
    fromdate: string;
    todate: string;
    classarray: { ASMCL_Id: number }[] | undefined;
    ASMAY_Id: number;
}

export interface INoticeBoardReportResponse {
    classreportlist: INoticeBoardReport[];
}

export interface INoticeBoardAttachmentResponse {
    attachementlist: INoticeBoardAttachment[];
}

export interface INoticeBoardInitialData {
    classlist: {
        asmcL_Id: number;
        asmcL_ClassName: string;
        asmcL_ActiveFlag: boolean;
        mI_Id: number;
    }[];
    acayear: {
        asmaY_Id: number;
        asmaY_Year: string;
        asmaY_From_Date: string;
        asmaY_To_Date: string;
    }[];
    academicYear: {
        asmaY_From_Date: string;
        asmaY_To_Date: string;
    }[];
}
export interface INoticeBoardUploadReport {
    topic: string;
    className: string;
    sectionName: string;
    subjectName: string;
    uploadDate: string;
    fileName: string;
    userName: string;
    employeeName: string;
}
