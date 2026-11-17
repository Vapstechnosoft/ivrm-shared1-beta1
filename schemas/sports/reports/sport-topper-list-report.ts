import { z } from 'zod';

export const sportTopperListReportSchema = z.object({
    type: z.enum(['House', 'CS']),
    asmaY_Id: z.coerce.number().min(1, 'Select Academic Year'),

    // For Type 'CS'
    asmcL_Id: z.coerce.number().optional(),
    asmS_Id: z.array(z.coerce.number()).optional(),

    // For Type 'House'
    spccmH_Id: z.array(z.coerce.number()).optional(),

    // Common
    spccmE_Id: z.array(z.coerce.number()).min(1, 'Select at least one Event'),
    spccmscC_Id: z.array(z.coerce.number()).optional(), // Sports Name appears optional in logic but visible
}).refine((data) => {
    if (data.type === 'CS') {
        return !!data.asmcL_Id;
    }
    return true;
}, {
    message: 'Select Class',
    path: ['asmcL_Id'],
}).refine((data) => {
    if (data.type === 'CS') {
        return data.asmS_Id && data.asmS_Id.length > 0;
    }
    return true;
}, {
    message: 'Select at least one Section',
    path: ['asmS_Id'],
}).refine((data) => {
    if (data.type === 'House') {
        return data.spccmH_Id && data.spccmH_Id.length > 0;
    }
    return true;
}, {
    message: 'Select at least one House',
    path: ['spccmH_Id'],
});

export type SportTopperListReportFormData = z.infer<typeof sportTopperListReportSchema>;

export interface SportTopperListReportData {
    id: number;
    spccmH_HouseName: string;
    spccestR_Points: number;
    spccestR_Rank: string;
    amsT_Name: string;
    amsT_AdmNo: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    spccmE_EventName: string;
    spccmeV_EventVenue: string;
    spccmscc_SportsCCName: string;
    spccE_StartDate: string;
}
