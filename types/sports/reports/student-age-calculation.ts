import { z } from 'zod';

export interface IStudentAgeReport {
    AMST_Id: number;
    AMST_FirstName?: string;
    AMST_MiddleName?: string;
    AMST_LastName?: string;
    AMST_Name: string; // From backend: AMST_Name
    AMST_AdmNo: string;
    ASMCL_ClassName: string;
    ASMC_SectionName: string;
    SPCCMH_HouseName?: string;
    AMST_DOB: string | Date;
    Years: number;
    Months: number; // Age Months
    Monthsd: number; // Months
    Days: number;
    SPCCMCL_CompitionLevel?: string; // Competition Category
}

export interface IReportRequest {
    type: 'House' | 'CS'; // 'CS' for Class/Section
    asmaY_Id: number;
    asmcL_Id?: number;
    spccmcC_Id?: number;
    selectedhouselist?: { spccmH_Id: number }[];
    selectedSectionlist?: { asmS_Id: number }[];
}

export interface IStudentAgeCalculationDropdowns {
    yearlist: {
        asmaY_Id: number;
        asmaY_Year: string;
    }[];
    categoryList?: {
        spccmcC_Id: number;
        spccmcC_CompitionCategory: string;
    }[];
    classList?: {
        asmcL_Id: number;
        asmcL_ClassName: string;
    }[];
    houseList?: {
        spccmH_Id: number;
        spccmH_HouseName: string;
    }[];
    sectionList?: {
        asmS_Id: number;
        asmC_SectionName: string;
    }[];
}


export const StudentAgeReportSchema = z.object({
    type: z.enum(['House', 'CS']),
    asmaY_Id: z.coerce.number().min(1, 'Academic Year is required'),
    spccmcC_Id: z.coerce.number().optional(),
    asmcL_Id: z.number().optional(),
    selectedhouselist: z.array(z.object({ spccmH_Id: z.number() })).optional(),
    selectedSectionlist: z.array(z.object({ asmS_Id: z.number() })).optional(),
}).refine(data => {
    if (data.type === 'CS') {
        return !!data.asmcL_Id;
    }
    return true;
}, {
    message: "Class is required for Class/Section report",
    path: ["asmcL_Id"]
}).refine(data => {
    if (data.type === 'CS') {
        return data.selectedSectionlist && data.selectedSectionlist.length > 0;
    }
    return true;
}, {
    message: "At least one section must be selected",
    path: ["selectedSectionlist"]
}).refine(data => {
    return data.selectedhouselist && data.selectedhouselist.length > 0;
}, {
    message: "At least one house must be selected",
    path: ["selectedhouselist"]
});

export type StudentAgeReportFormSchema = z.infer<typeof StudentAgeReportSchema>;
