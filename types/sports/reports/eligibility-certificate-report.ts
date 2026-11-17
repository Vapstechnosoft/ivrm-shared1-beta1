import { z } from 'zod';

export interface IEligibilityCertificateReportDetail {
    amsT_Id: number;
    adm_no: string;
    studentname: string;
    classname: string;
    sectionname: string;
    gender: string;
    dob: string | Date;
    fatherName: string;
    motherName: string;
    Selected?: boolean;
}

export interface IEligibilityCertificateReport {
    optionflag: 'SCHOOL' | 'COLLEGE';
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    spccmE_Id: number;
    amsT_Date: Date;
    spccsH_Age: string;
    studentList?: IEligibilityCertificateReportDetail[];
}

export const eligibilityCertificateReportSchema = z.object({
    optionflag: z.enum(['SCHOOL', 'COLLEGE']),
    asmaY_Id: z.coerce.number().min(1, 'Academic Year is required'),
    asmcL_Id: z.coerce.number().min(1, 'Class is required'),
    asmS_Id: z.coerce.number().min(1, 'Section is required'),
    spccmE_Id: z.coerce.number().min(1, 'Event Name is required'),
    amsT_Date: z.date({
        required_error: 'Date is required',
        invalid_type_error: 'Invalid date'
    }),
    spccsH_Age: z.string().optional(),
    studentList: z.array(z.object({
        amsT_Id: z.number(),
        adm_no: z.string(),
        studentname: z.string(),
        classname: z.string(),
        sectionname: z.string(),
        gender: z.string(),
        dob: z.union([z.string(), z.date()]),
        fatherName: z.string(),
        motherName: z.string(),
        Selected: z.boolean().optional()
    })).optional()
});
