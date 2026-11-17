import { z } from 'zod';

export interface IAcademicYear {
    asmaY_Id: number;
    asmaY_Year: string;
}

export interface IClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface ISection {
    asmS_Id: number;
    asmC_SectionName: string;
}

export interface IStudentBMIEntry {
    AMST_Id: number;
    studentName: string;
    AMST_AdmNo: string;
    SPCCSHW_Weight: number | string;
    SPCCSHW_Height: number | string;
    SPCCSHW_BMI: number | string;
    SPCCSHW_BMIRemark: string;
    selected?: boolean;
}

export interface IBMISectionResponse {
    success: boolean;
    message?: string;
    data: ISection[];
    sectionList?: ISection[]; // For fallback or if API returns it at root
}

export interface IBMIClassResponse {
    success: boolean;
    message?: string;
    data: {
        classlist: IClass[];
    };
    classlist?: IClass[]; // For fallback or if API returns it at root
}

export interface IBMIStudentResponse {
    success: boolean;
    message?: string;
    data: Array<{
        spccshW_Id: number;
        amsT_Id: number;
        studentName: string;
        amsT_AdmNo: string;
        spccmhW_ActiveFlag: boolean;
        // other fields if needed from API
    }>;
}

export interface IBMICalculation {
    SPCCSHW_Id: number;
    ASMAY_Id: number;
    ASMCL_Id: number;
    ASMS_Id: number;
    SPCCSHW_AsOnDate: string | Date;
    student?: IStudentBMIEntry[];
    asondate?: string;
    // For grid display - supporting both browser-standard camelCase and API PascalCase
    asmaY_Year?: string;
    ASMAY_Year?: string;
    asmcL_ClassName?: string;
    ASMCL_ClassName?: string;
    asmC_SectionName?: string;
    ASMC_SectionName?: string;
    studentName?: string;
    amsT_AdmNo?: string;
    AMST_AdmNo?: string;
    spccshW_Weight?: number;
    SPCCSHW_Weight?: number;
    spccshW_Height?: number;
    SPCCSHW_Height?: number;
    spccshW_BMI?: number;
    SPCCSHW_BMI?: number;
    spccshW_BMIRemark?: string;
    SPCCSHW_BMIRemark?: string;
    spccshW_Id?: number;
    spccmhW_ActiveFlag?: boolean;
    SPCCMHW_ActiveFlag?: boolean;
}

export const bmiCalculationSchema = z.object({
    ASMAY_Id: z.coerce.number().min(1, 'Academic Year is required'),
    ASMCL_Id: z.coerce.number().min(1, 'Class is required'),
    ASMS_Id: z.coerce.number().min(1, 'Section is required'),
    SPCCSHW_AsOnDate: z.union([z.string(), z.date()]).refine(val => !!val, 'Date is required'),
    student: z.array(z.object({
        AMST_Id: z.number(),
        studentName: z.string().optional(),
        AMST_AdmNo: z.string().optional(),
        SPCCSHW_Weight: z.coerce.number().min(0, 'Weight must be positive'),
        SPCCSHW_Height: z.coerce.number().min(0, 'Height must be positive'),
        SPCCSHW_BMI: z.coerce.number(),
        SPCCSHW_BMIRemark: z.string(),
        selected: z.boolean().optional()
    })).optional()
});
