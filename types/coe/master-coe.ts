export interface MappedEventCoe {

    coee_Id: number;
    coeE_Id: number;
    asmaY_Id: number;
    coemE_Id: number;
    coee_EStartDate: string;
    coee_EEndDate: string;
    coee_EStartTime: string;
    coee_EEndTime: string;
    coee_SMSMessage: string;
    coee_SMSActiveFlag: boolean;
    coee_MailSubject: string;
    coee_MailHeader: string;
    coee_MailFooter: string;
    coee_Mail_Message: string;
    coee_MailHTMLTemplate: string;
    coee_MailActiveFlag: boolean;
    coee_ReminderDate: string;
    coee_RepeatFlag: boolean;
    coee_ReminderSchedule: string;
    coee_ReminderDays?: string;
    coee_StudentFlag: boolean;
    coee_AlumniFlag: boolean;
    coee_EmployeeFlag: boolean;
    coee_ManagementFlag: boolean;
    coee_OtherFlag: boolean;
    coee_ActiveFlag: boolean;

    // Lists for payload (might not be returned in GET all the time, or as separate objects)
    stu_class_list?: { asmcL_Id: number }[];
    emp_type_list?: { hrmD_Id: number }[];
    others_list?: {
        name: string;
        mobile: string;
        email: string
    }[];
    images_listCoe?: { COEEI_Images: string }[];
    videos_list?: { COEEV_Videos: string }[];
    alumni_list?: any[];
    edit_images_list?: { coeeI_Images: string }[];
}


export interface MasterCoeInitialData {
    yearlist: { asmaY_Id: number; asmaY_Year: string }[];
    eventlist_act: { coemE_Id: number; coemE_EventName: string }[]; // Active events
    classlist: { asmcL_Id: number; asmcL_ClassName: string }[];
    stafftypelist: { hrmD_Id: number; hrmD_DepartmentName: string }[];
    mapped_eventlist: MappedEventCoe[];
}

export interface MasterEventDetails {
    selected_master_event: {
        coemE_EventDesc: string;
        coemE_SMSMessage: string;
        coemE_MailSubject: string;
        coemE_MailHeader: string;
        coemE_MailFooter: string;
        coemE_Mail_Message: string;
        coemE_MailHTMLTemplate: string;
    }[];
}
