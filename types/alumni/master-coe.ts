export interface IMasterEvent {
    COEME_Id: number;
    COEME_EventName: string;
    COEME_EventDesc: string | null;
    COEME_SMSMessage: string | null;
    COEME_MailSubject: string | null;
    COEME_MailHeader: string | null;
    COEME_Mail_Message: string | null;
    COEME_MailFooter: string | null;
    COEME_ActiveFlag: boolean;
    COEME_ManualDefault_Flag: 'Manual' | 'Default';
    // CamelCase versions from API
    coemE_Id?: number;
    coemE_EventName?: string;
    coemE_EventDesc?: string | null;
    coemE_ActiveFlag?: boolean;
}

export interface IEventsMapping {
    COEE_Id: number;
    ASMAY_Id: number;
    COEME_Id: number;
    COEME_EventName?: string;
    ASMAY_Year?: string;
    COEE_EStartDate: string;
    COEE_EEndDate: string;
    COEE_EStartTime: string;
    COEE_EEndTime: string;
    COEE_StudentFlag: boolean;
    COEE_EmployeeFlag: boolean;
    COEE_AlumniFlag: boolean;
    COEE_OtherFlag: boolean;
    COEE_ManagementFlag: boolean;
    COEE_ActiveFlag: boolean;
    stu_class_list?: { ASMCL_Id: number }[];
    emp_type_list?: { HRMD_Id: number }[];
    images_listCoe?: { COEEI_Images: string }[];
    videos_list?: { COEEV_VideoURL: string }[];
    // CamelCase versions from API
    coeE_Id?: number;
    coemE_EventName?: string;
    asmaY_Year?: string;
    coeE_EStartDate?: string;
    coeE_EEndDate?: string;
    coeE_ActiveFlag?: boolean;
}
