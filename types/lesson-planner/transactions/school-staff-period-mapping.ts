export interface ISchoolStaffPeriodMapping {
    lplP_Id: number;
    lpmT_Id: number;
    lplP_LPDate: string;
    lplP_ClassTakenFlg: number;
    // Attachment fields
    unitFileAttachment?: string;
    unitFileLocation?: string;
    estmanssH_AnswerSheet?: string;
    estmanssH_FileLocation?: string;
}

export interface IEmployee {
    hrmE_Id: number;
    employeename: string;
    hrmE_EmployeeCode: string;
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
}

export interface IDateItem {
    alldates: string;
    Selected?: boolean;
    lpmT_Id?: number | string;
    lplP_Id?: number;
    lplP_ClassTakenFlg?: number;
    estmanssH_AnswerSheet?: string;
    estmanssH_FileLocation?: string;
}

export interface ITopic {
    lpmT_Id: number | string;
    lpmT_TopicName: string;
}

export interface ISchoolStaffPeriodMappingDataResponse {
    masteryear: IMasterYear[];
    employeedetails: IEmployee[];
    masterclass?: IMasterClass[];
    mastersection?: ISection[];
    mastersubjects?: IMasterSubject[];
    getalldates?: IDateItem[];
    gettopicdetails?: ITopic[];
    getsavedetails?: ISchoolStaffPeriodMapping[];
    returnval?: boolean;
}

export interface ISchoolStaffPeriodMappingResponse {
    success: boolean;
    message: string;
    data?: ISchoolStaffPeriodMappingDataResponse | null;
}

// Reuse some types from Topic module if possible, otherwise redefine
export interface IMasterYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface IMasterClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface IMasterSubject {
    ismS_Id: number;
    ismS_SubjectName: string;
}
