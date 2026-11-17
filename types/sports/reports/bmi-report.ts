import { z } from 'zod';

// Interface for Grid Data - Matches API Response
export interface IBMIReport {
    asmcL_ClassName: string;
    asmC_SectionName: string;
    amsT_ID: number;
    amsT_Name: string;
    amsT_AdmNo: string;
    amaY_RollNo: string;
    amsT_DOB: string;
    spccshW_Age: string;
    spccshW_HeighT: number;
    spccshW_WeighT: number;
    spccshW_BMi: number;
    spccshW_BMiRemark: string;
}

// Interface for Initial Load Data
export interface IBMIReportLoadData {
    academicYear: {
        asmaY_Id: number;
        mI_Id: number;
        asmaY_Year: string;
        asmaY_ActiveFlag: number;
    }[];
    houseList: {
        spccmH_Id: number;
        spccmH_HouseName: string;
    }[];
}

// Interface for Class Data
export interface IBMIReportClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

// Interface for Section Data
export interface IBMIReportSection {
    asmS_Id: number;
    asmC_SectionName: string;
}

// Interface for Form Request
export interface IBMIReportRequest {
    mI_Id?: number; // Optional as it might be handled by token
    ASMAY_Id: number;
    ASMCL_Id: number;
    selectedSectionlist: { asmS_Id: number }[];
}

// Zod Schema for Validation
export const bmiReportSchema = z.object({
    ASMAY_Id: z.coerce.number().min(1, 'Academic Year is required'),
    ASMCL_Id: z.coerce.number().min(1, 'Class is required'),
    selectedSectionlist: z.array(z.object({ asmS_Id: z.number() })).min(1, 'At least one section is required'),
});

export type BMIReportFormSchema = z.infer<typeof bmiReportSchema>;
