import { IAcademicYear, IClass, ISection, ISubject } from './classwork';

export interface IClassWorkMarksInitialData {
    yearlist: IAcademicYear[];
    academicyear: IAcademicYear[];
    // classlist, sectionlist might be loaded dynamically or initially if needed, sticking to pattern
    hrmE_Id?: number;
}

export interface ITopic {
    ICW_Id: number;
    ICW_Topic: string;
    ICW_SubTopic?: string;
    ISMS_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    ASMAY_Id: number;
    ICW_FromDate: string;
    ICW_ToDate: string;
}

export interface IStudentMarks {
    AMST_Id: number;
    studentname: string;
    ICW_Id: number;
    ISMS_SubjectName: string;
    ICW_Topic: string;
    ICW_SubTopic: string;
    ICW_FromDate: string;
    ICW_ToDate: string;
    ICWUPL_Date: string;
    FilesCount: number;
    ICWUPL_Marks?: string;
    ICWUPL_StaffRemarks?: string;
    ICWUPL_Id: number;
    FileName1?: string;
    ICW_FilePath1?: string; // Staff Upload
    checkedvalue?: boolean;
    uploadfilestemp?: any[]; // for student uploads details
}

export interface IStudentUploadDetail {
    icwupL_Id: number;
    icwupL_FileName: string;
    icwupL_Attachment: string;
    icwuplatT_StaffRemarks?: string;
    icwuplatT_StaffUpload?: string; // Path
}

export interface IClassWorkMarksSave {
    getclasswork_list_array: {
        AMST_Id: number;
        ICW_Id: number;
        Marks?: string;
        ICWUPL_FileName?: string;
        ICWUPL_StaffUplaod?: string;
        ICWUPL_StaffRemarks?: string;
        ICWUPL_Id: number;
    }[];
}
