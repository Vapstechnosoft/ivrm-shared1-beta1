import { z } from 'zod';

// Interfaces for API Responses

export interface IStudentEligibleReportLoadData {
    yearlist: {
        asmaY_Id: number;
        asmaY_Year: string;
    }[];
}

export interface IStudentEligibleReportClass {
    asmcL_Id: number;
    asmcL_ClassName: string;
}

export interface IStudentEligibleReportSection {
    asmS_Id: number;
    asmC_SectionName: string;
}

export interface IStudentEligibleReportStudent {
    amsT_Id: number;
    studentname: string;
    Selected?: boolean; // For UI selection
}

export interface IStudentEligibleReportDetail {
    amsT_Id: number;
    studentname: string;
    classname: string;
    sectionname: string;
    spccE_StartDate: string; // Used for DOB in columns? No, API response shows this as date, but columns mapped it to DOB. Let's check. Response has amsT_DOB as 0001-01-01, but spccE_StartDate has value. Prompt columns used spccE_StartDate.
    adm_no: string;
    amsT_MotherName: string;
    amsT_FatherName: string;
    address: string;
    pasR_Age: number;
}

// Request Interfaces
export interface IStudentEligibleReportRequest {
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    studentList?: { amsT_Id: number }[];
}

// Zod Schema
export const studentEligibleReportSchema = z.object({
    asmaY_Id: z.coerce.number().min(1, 'Academic Year is required'),
    asmcL_Id: z.coerce.number().min(1, 'Class is required'),
    asmS_Id: z.coerce.number().min(1, 'Section is required'),
    studentList: z.array(z.object({
        amsT_Id: z.number(),
        studentname: z.string(),
        Selected: z.boolean().optional()
    })).optional()
});

export type IStudentEligibleReport = z.infer<typeof studentEligibleReportSchema>;
