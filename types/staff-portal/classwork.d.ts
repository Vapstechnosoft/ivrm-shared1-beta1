export interface IClassWorkInitialData {
    yearlist: IAcademicYear[];
    classlist: IClass[];
    classwork: IClassWork[];
    academicyear: IAcademicYear[];
    hrmE_Id?: number;
}

export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
    selected?: boolean;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
    selected?: boolean;
}

export interface ISubject {
    ismS_Id: number;
    ismS_SubjectName: string;
    asmC_SectionName?: string;
}

export interface IClassWork {
    icW_Id: number;
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id?: number; // Might be multiple in UI but single in some contexts? Legacy saves hm_section_list
    ismS_Id: number;
    ismS_SubjectName?: string;
    icW_Topic: string;
    icW_SubTopic?: string;
    icW_Content: string;
    icW_FromDate: string; // DateTime
    icW_ToDate: string; // DateTime
    icW_ActiveFlag: boolean;
    icW_Assignment?: string;
    icW_TeachingAid?: string;
    icW_Evaluation?: string;
    icW_Attachment?: string; // "HyperLink" or filename
    icW_FilePath?: string;
    asmcL_ClassName?: string;
    asmC_SectionName?: string;
    createdDate?: string;
    createdTime?: string;
    FilesCount?: number;
}

export interface IClassWorkAttachment {
    icwatT_Id?: number;
    icW_Id: number;
    icwatT_FileName: string;
    icwatT_Attachment: string;
    icW_Attachment?: string; // "HyperLink" check
}

export interface IClassWorkSave {
    ICW_Id: number;
    ASMAY_Id: number;
    ASMCL_Id: number;
    ISMS_Id: number;
    hm_section_list: { ASMS_Id: number }[];
    ICW_Topic: string;
    ICW_SubTopic?: string;
    ICW_Content: string;
    ICW_FromDate: Date;
    ICW_ToDate: Date;
    ICW_FilePath_Array: { ICW_FilePath: string; FileName: string }[];
    ICW_Assignment?: string;
    ICW_TeachingAid?: string;
    ICW_Evaluation?: string;
    ICW_Attachment?: string;
}
export interface IClassWorkMarksInitialData {
academicyear: any;


    
}
