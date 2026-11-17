export interface ISchoolSubjectTopicMapping {
    lpmT_Id: number;
    lpmmT_Id: number;
    lpmU_Id: number;
    ismS_Id: number;
    asmS_Id: number;
    asmcL_Id: number;
    asmaY_Id: number;
    lpmT_TopicName: string;
    lpmT_LessonPlan: string;
    lpmT_TotalHrs: number;
    lpmT_TotalPeriods: number;
    lpmT_TeacherGuide: string | null;
    lpmT_StudentGuide: string | null;
    lpmT_MaterialNeeded: string | null;
    lpmT_References: string | null;
    lpmT_Homework: string | null;
    lpmT_ActiveFlag: boolean;
    lpmT_TopicOrder: number;

    // Additional fields for display
    asmaY_Year?: string;
    asmcL_ClassName?: string;
    asmC_SectionName?: string;
    ismS_SubjectName?: string;
    lpmU_UnitName?: string;
    lpmmT_TopicName?: string;
}

export interface IUploadFile {
    lpmtR_Id?: number;
    lpmT_Id?: number;
    lpmtR_Resources: string;
    lpmtR_FileName: string;
    lpmtR_ResourceType?: string; // 'Teacher Guide', 'Student Guide', 'Materials Needed', 'References'
}

export interface ISchoolSubjectTopicMappingResponse {
    success: boolean;
    message: string;
    getdetails: ISchoolSubjectTopicMapping[];
    editDetails?: ISchoolSubjectTopicMapping;
    geteditdetials?: ISchoolSubjectTopicMapping[];
    uploadfiles?: IUploadFile[];
    getyear?: any[];
    getclass?: any[];
    getsubject?: any[];
    unitdetails?: any[];
    topicdetails?: any[];
    getsubjectlist?: any[];
    gettopicdetailsorder?: ISchoolSubjectTopicMapping[]; // Topic details for ordering/display
    data?: any;
}

export interface IOrderData {
    lpmT_Id: number;
    lpmT_TopicOrder: number;
    lpmT_TopicName: string;
}
