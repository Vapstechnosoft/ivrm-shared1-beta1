
export interface IInteractionRoleConfig {
    ivrmgC_EnableSTIntFlg?: boolean;
    ivrmgC_EnableCTIntFlg?: boolean;
    ivrmgC_EnableHODIntFlg?: boolean;
    ivrmgC_EnablePrincipalIntFlg?: boolean;
    ivrmgC_EnableASIntFlg?: boolean;
    ivrmgC_EnableSTSUBTIntFlg?: boolean; // STforStudent
    ivrmgC_EnableSTCTIntFlg?: boolean;    // CTforStudent
    ivrmgC_EnableSTHODIntFlg?: boolean;   // HODforStudent
    ivrmgC_EnableSTPrincipalIntFlg?: boolean; // PRPLforStudent
    ivrmgC_EnableSTASIntFlg?: boolean;    // ASforStudent
    ivrmgC_EnableSTECIntFlg?: boolean;    // ExCoforStudent
    ivrmgC_EnableStaffwiseIntFlg?: boolean; // STFtoSTF
    ivrmgC_EnableCTSTIntFlg?: boolean;    // CLTtoSTU
    ivrmgC_EnableHODSTIntFlg?: boolean;   // HODtoSTU
    ivrmgC_EnablePrincipalSTIntFlg?: boolean; // PRItoSTU
    ivrmgC_EnableASSTIntFlg?: boolean;    // ACStoSTU
    ivrmgC_EnableECSTIntFlg?: boolean;    // ECtoSTU
    ivrmgC_EnableSUBTSTUIntFlg?: boolean; // SUBTtoSTU
    ivrmgC_GMRDTOALLFlg?: boolean;        // Groupview
}

export interface IMessage {
    ISMINT_Id: number;
    ISTINT_Id: number;
    ISMINT_InteractionId: string;
    ISMINT_Subject: string;
    ISMINT_Interaction: string;
    ISMINT_GroupOrIndFlg: 'Group' | 'Individual';
    ISMINT_ComposedByFlg: string;
    Sender: string;
    Receiver: string;
    ISMINT_DateTime: string;
    ISTINT_DateTime: string;
    ISTINT_Attachment?: string;
    ISMINT_Attachment?: string;
    ISMINT_ComposedById: number;
    ISTINT_ReadFlg: string | null | number;
    filetype2?: string;
}

export interface IRecipient {
    AMST_Id?: number;
    AMST_Id_chk?: boolean;
    AMST_AdmNo?: string;
    studentName?: string;
    EmpName?: string;
    HRME_Id?: number;
    HRME_Id_chk?: boolean;
    HRME_EmployeeCode?: string;
    ISMS_SubjectName?: string;
    tck?: boolean;
    stuck?: boolean;
    Selected?: boolean;
}

export interface IFeedbackOption {
    fmoP_Id: number;
    fmoP_FeedbackOptions: string;
    fmoP_OptionsValue: string;
    fmtY_Id: number;
    fmqE_Id: number;
}

export interface IFeedbackQuestion {
    fmqE_Id: number;
    fmtY_Id: number;
    fmqE_FeedbackQuestions: string;
    fmtY_FeedbackTypeName: string;
    feedbackoptiondata: IFeedbackOption[];
    name?: number; // Selected fmoP_Id
    fsttR_FeedBack?: string;
}

export interface IInteractionsInitialData {
    roletype: Array<{ ivrmrT_Role: string }>;
    rolename: string;
    configflag: IInteractionRoleConfig[];
    getinboxmsg: IMessage[];
    getinboxmsg_readflg: Array<{ ISMINT_Id: number, ISTINT_ReadFlg: number }>;
    userhrmE_Id: number;
    blockstudent?: Array<{ IBINTSTD_BlockedFlg: boolean }>;
}

export interface ISaveInteractionRequest {
    roleflg: string;
    userflag: string;
    HRME_Id?: number;
    ISTINT_ToId?: number;
    ISMINT_ComposedByFlg: string;
    ISMINT_GroupOrIndFlg: 'Group' | 'Individual';
    ISMINT_Subject: string;
    ISMINT_Interaction: string;
    ISMINT_Id?: number;
    images_paths?: string[];
    arrayStudent?: any[];
    student_Id?: number;
    arrayTeachers?: any[];
    employee_Id?: number;
}

export interface ISaveReplyRequest {
    ISMINT_Id: number;
    ISTINT_Interaction: string;
    images_paths?: string[];
    roleflg: string;
}
