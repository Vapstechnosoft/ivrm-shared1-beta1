export interface IMasterSchoolTopic {
    lpmmT_Id: number;
    lpmmT_TopicName: string;
    lpmmT_TopicDescription: string;
    lpmmT_TotalPeriods: number;
    lpmmT_TotalHrs: number;
    lpmmT_Order: number;
    lpmmT_ActiveFlag: boolean;
    ismS_Id: number;
    lpmU_Id: number;
    asmaY_Id: number;
    asmcL_Id: number;

    // Display properties (joined fields)
    asmaY_Year?: string;
    asmcL_ClassName?: string;
    ismS_SubjectName?: string;
    lpmU_UnitName?: string;
}

export interface IMasterSchoolTopicDataResponse {
    getdetails: IMasterSchoolTopic[];
    getunitlist: IMasterUnit[];
    getyear: IMasterYear[];
    // For specific dropdown fetching
    getclass?: IMasterClass[];
    getsubject?: IMasterSubject[];
    getsubjecttopicdetails?: IMasterSchoolTopic[]; // For ordering

    // For edit
    editdetail?: IMasterSchoolTopic[];

    returnval?: boolean;
    already_cnt?: boolean;
}

export interface IMasterSchoolTopicResponse {
    success: boolean;
    message: string;
    data: IMasterSchoolTopicDataResponse;
    total?: number;
    page?: number;
    page_size?: number;
    mI_Id?: number;
    userId?: number;
}

export interface IMasterYear {
    asmaY_Id: number;
    asmaY_Year: string;
    asmaY_ActiveFlag?: number;
}

export interface IMasterClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
    asmcL_ActiveFlag?: boolean;
}

export interface IMasterSubject {
    ismS_Id: number;
    ismS_SubjectName: string;
    ismS_SubjectCode: string;
    ismS_ActiveFlag?: number;
    // UI helper
    Selected?: boolean;
}

export interface IMasterUnit {
    lpmU_Id: number;
    lpmU_UnitName: string;
    lpmU_ActiveFlg?: boolean;
}

export interface IMasterSchoolTopicOrder {
    lpmmT_Id: number;
    lpmmT_Order: number;
}
