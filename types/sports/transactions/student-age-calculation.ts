import { StudentAgeCalculationFormData, StudentAgeRecord } from '@/schemas/sports/transactions/student-age-calculation';

export interface StudentAgeCalculationInitialData {
    academicYear: AcademicYear[];
    classList: ClassList[];
    sectionList?: SectionList[];
    eventsStudentRecordList?: any[];
}

export interface SectionList {
    asmS_Id: number;
    mI_Id: number;
    asmC_SectionName: string;
    asmC_SectionOrder: number;
    asmC_ActiveFlag: boolean;
}

export interface AcademicYear {
    asmaY_Id: number;
    mI_Id: number;
    asmaY_Year: string;
    asmaY_From_Date: string;
    asmaY_To_Date: string;
    asmaY_PreAdm_F_Date: string;
    asmaY_PreAdm_T_Date: string;
    asmaY_Order: number;
    asmaY_ActiveFlag: number;
    asmaY_Cut_Of_Date: string;
    asmaY_Pre_ActiveFlag: number;
    is_Active: boolean;
    asmaY_ReggularFlg: boolean;
    asmaY_NewFlg: boolean;
    asmaY_NewAdmissionFlg: boolean;
    asmaY_CreatedBy: number;
    asmaY_UpdatedBy: number;
    asmaY_AcademicYearCode: string;
    asmaY_RegularFeeFDate: string;
    asmaY_RegularFeeTDate: string;
    createdDate: string;
    updatedDate: string;
    asmaY_ReferenceDate?: string;
    asmaY_TransportSDate?: string;
    asmaY_TransportEDate?: string;
    asmaY_AdvanceFeeDate?: string;
    asmaY_ArrearFeeDate?: string;
}

export interface ClassList {
    asmcL_Id: number;
    mI_Id: number;
    asmcL_ClassName: string;
    asmcL_MinAgeYear: number;
    asmcL_MinAgeMonth: number;
    asmcL_MinAgeDays: number;
    asmcL_MaxAgeYear: number;
    asmcL_MaxAgeMonth: number;
    asmcL_MaxAgeDays: number;
    asmcL_Order: number;
    asmcL_ClassCode: string;
    asmcL_ActiveFlag: boolean;
    asmcL_MaxCapacity: number;
    asmcL_PreadmFlag: number;
    createdDate: string;
    updatedDate: string;
    asmcL_StreamFlg?: boolean;
}
