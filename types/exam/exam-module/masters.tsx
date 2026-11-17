// /types/exam/master-subject.ts

export interface IMasterSubject {
    ismS_Id: number; // Unique Subject ID
    mI_Id: number; // Institute ID
    ismS_SubjectName: string; // Subject Name *
    ismS_IVRSSubjectName: string; // IVRS Subject Name *
    ismS_SubjectCode: string; // Subject Code *
    ismS_SubjectNameNew?: string; // New Subject Name (optional)
    ismS_SubjectFlag?: number; // Subject Flag (optional)
    ismS_BatchAppl: number; // Batch Applicable *
    ismS_ActiveFlag?: number; // Active Flag (optional)
    ismS_OrderFlag?: number; // Order Flag (optional)
    ismS_AttendanceFlag: boolean; // Attendance Flag *
    ismS_AtExtraFeeFlg: number; // Extra Fee Flag *
    ismS_LanguageFlg: number; // Language Flag *
    ismS_TTFlag?: boolean; // Time Table Flag (optional)
    ismS_Max_Marks: number; // Maximum Marks *
    ismS_Min_Marks: number; // Minimum Marks *
    ismS_ExamFlag: number; // Exam Flag *
    ismS_PreadmFlag: number; // Pre-admission Flag *
    createdDate?: string; // Optional created date
    updatedDate?: string; // Optional updated date
}

export interface IMasterSubjectOrder {
    mI_Id: number; // Unique Subject ID
    ismS_Id: number;
    ismS_SubjectName?: string; // Subject Name
    ismS_SubjectCode?: string; // Subject Code
    ismS_OrderFlag: number;
}

export interface IMasterExam {
    emE_Id: number;
    mI_Id?: number;
    emE_ExamName: string;
    emE_IVRSExamName: string;
    emE_ExamDescription: string;
    emE_ExamCode: string;
    emE_ExamOrder: number;
    emE_FinalExamFlag: number;
    emE_SujectwiseMarksPublishFlg: number;
    emE_ActiveFlag: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IMasterExamOrder {
    mI_Id?: number;
    emE_Id: number;
    emE_ExamName: string;
    emE_ExamCode: string;
    emE_ExamOrder: number;
}

export interface IMasterExamPaper {
    empatY_Id: number;
    mI_Id?: number;
    empatY_PaperTypeName: string;
    empatY_Color: string;
    empatY_PaperTypeDescription: string;
    empatY_ActiveFlag: boolean;
    empatY_CreatedDate?: string;
    empatY_CreatedBy?: string;
}

export interface IMasterSubExam {
    emsE_Id: number;
    emsE_SubExamName: string;
    emsE_SubExamCode: string;
    emsE_SubExamOrder: number;
    emsE_ActiveFlag: boolean;
}
export interface IMasterSubSubject {
    emsS_Id: number; // Unique Sub Subject ID
    mI_Id: number; // Master ID
    emsS_SubSubjectName: string; // Sub Subject Name
    emsS_SubSubjectCode: string; // Sub Subject Code
    emsS_Order: number; // Display Order
    emsS_ActiveFlag: boolean; // Active Status
}

export interface IGradeDetails {
    emgD_Id?: number | string;
    emgD_Name: string;
    emgD_From: number | string;
    emgD_To: number | string;
    emgD_Remarks: string;
    emgD_GradePoints: number | string;
}

export interface IMasterGrade {
    emgR_Id: number;
    mI_Id: number;
    emgR_GradeName: string;
    emgR_MarksPerFlag: string;
    emgR_ActiveFlag: boolean;
    grade_list: IGradeDetails[];
}

export interface IMasterSubjectGroup {
    mI_Id?: number;
    emG_Id: number;
    ismS_SubjectCode: number;
    emG_GroupName: string;
    emG_TotSubjects: number;
    emG_MaxAplSubjects: number;
    emG_MinAplSubjects: number;
    emG_BestOff: number;
    emG_ElectiveFlg: number;
    emG_ActiveFlag: boolean;
    createdDate?: string;
    updatedDate?: string;
}
export interface IMasterSubjectGroupDetails {
    ismS_SubjectGroup: any;
    ismS_Id?: number;
    ismS_SubjectName: string;
    ismS_SubjectCode: string;
    ismS_OrderFlag: number;
}

export interface IMasterCategory {
    emcA_Id: number;
    mI_Id: number;
    emcA_CategoryName: string;
    emcA_CCECheckingFlg: boolean;
    emcA_ActiveFlag: boolean;
    createdDate?: string;
    updatedDate?: string;
}

// Category Class Mapping

export interface ICategoryMapping {
    emcA_Id: number;
    mI_Id: number;
    emcA_CategoryName: string;
    emcA_CCECheckingFlg: boolean;
    emcA_ActiveFlag: boolean;
    ecaC_Id: number;
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    ecaC_ActiveFlag: boolean;
    asmaY_Year: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    asmaY_Order: number;
}

export interface IMasterExamCategoryMapping {
    ex_Id: number;
    ex_AcademicYear: string;
    ex_CategoryName: string;
    ex_ClassName: string;
    ex_Sections: ISection[];
    ex_IsActiveFlag: boolean;
}

export interface IAcademicYear {
    mI_Id?: number;
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface ICategory {
    emcA_Id: number;
    emcA_CategoryName: string;
    eyC_Id: number;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassCode?: string;
    asmcL_ClassName: string;
    asmcL_Order?: number;
    asmcL_MinAgeYear?: number;
    asmcL_MinAgeMonth?: number;
    asmcL_MinAgeDays?: number;
    asmcL_MaxAgeYear?: number;
    asmcL_MaxAgeMonth?: number;
    asmcL_MaxAgeDays?: number;
    asmcL_MaxCapacity?: number;
}

export interface ISection {
    mI_Id?: number;
    asmS_Id: number;
    asmC_SectionName: string;
    asmC_SectionCode?: string;
    ecaC_Id: number;
    ecaC_ActiveFlag: boolean;
}

export interface ICategoryClassMappingDetails {
    mI_Id: number;
    asmS_Id: number;
    ecaC_Id: number;
    asmcL_ClassName: string;
    asmC_SectionCode: string;
    asmC_SectionName: string;
    asmC_MaxCapacity: number;
    asmC_Order: number;
    ecaC_ActiveFlag: boolean;
}
export interface ICoScholasticActivity {
    ecacT_Id: number;
    mI_Id: number;
    ecacT_SkillName: string;
    ecacT_SkillCode: string;
    ecacT_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}
export interface ICoScholasticArea {
    ecactA_Id: number;
    mI_Id: number;
    ecactA_SkillArea?: string;
    ecactA_SkillOrder: number;
    ecactA_ActiveFlag: boolean;
    createdDate: string;
    updatedDate: string;
}
export interface IMasterLifeSkillMapping {
    ecsaM_Id: number;
    ecsA_Id: number;
    ecS_Id: number;
    mI_Id: number;
    asmaY_Id: number;
    ecsaM_IndicatorDescription: string;
    emgR_Id: number;
    ecsaM_ActiveFlag: boolean;
    ecsA_SkillArea: string;
    ecS_SkillName: string;
    emgR_NAME: string;
    asmaY_Year: string;
    asmaY_Order: number;
}

export interface ILifeSkill {
    ecS_Id: number;
    mI_Id: number;
    ecS_SkillName: string;
    ecS_SkillCode: string;
    ecS_ActiveFlag: boolean;
}

export interface ILifeSkillArea {
    ecsA_Id: number;
    mI_Id: number;
    ecsA_SkillArea: string;
    ecsA_SkillOrder: number;
    ecsA_ActiveFlag: boolean;
}
