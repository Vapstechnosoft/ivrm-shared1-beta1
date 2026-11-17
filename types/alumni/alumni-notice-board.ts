export interface IAlumniNoticeBoard {
    alntB_Id: number;
    mI_Id?: number;
    alntB_Title: string;
    alntB_Description: string;
    alntB_FilePath?: string;
    alntB_Attachment?: string;
    alntB_DisplayDate?: string | Date | null;
    alntB_StartDate: string | Date;
    alntB_EndDate: string | Date;
    alntB_ActiveFlag?: boolean;
    alntB_CreatedDate?: string | Date;
    alntB_UpdatedDate?: string | Date;
    attachment_Array?: IAlumniNoticeBoardFile[];
}

export interface IAlumniNoticeBoardFile {
    alntbfL_Id?: number;
    alntbfL_FileName: string;
    alntbfL_FilePath: string;
    alntB_Id?: number;
}
