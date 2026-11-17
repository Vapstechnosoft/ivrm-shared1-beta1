import { z } from 'zod';

export const yearEndReportSchema = z.object({
    Type: z.enum(['AY', 'CS']),
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    selectedClasslist: z.array(z.object({
        asmcL_Id: z.number(),
    })).optional(),
    selectedSectionlist: z.array(z.object({
        asmS_Id: z.number(),
    })).optional(),
}).refine((data) => {
    if (data.Type === 'CS') {
        return data.selectedClasslist && data.selectedClasslist.length > 0;
    }
    return true;
}, {
    message: 'At least one class must be selected',
    path: ['selectedClasslist'],
}).refine((data) => {
    if (data.Type === 'CS') {
        return data.selectedSectionlist && data.selectedSectionlist.length > 0;
    }
    return true;
}, {
    message: 'At least one section must be selected',
    path: ['selectedSectionlist'],
});

export type YearEndReportFormSchema = z.infer<typeof yearEndReportSchema>;

export interface IYearEndReport {
    id: number;
    asmaY_Year: string;
    houseName: string;
    studentName: string;
    admNo: string;
    className: string;
    sectionName: string;
    spccmE_EventName: string;
    spccmeV_EventVenue: string;
    spccmscC_SportsCCName: string;
    spccE_StartDate: string;
    points: number;
    spccestR_Rank: string;
}
