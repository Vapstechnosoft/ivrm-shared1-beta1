import { z } from 'zod';

export const sportStudentParticipationReportSchema = z.object({
    type: z.enum(['House', 'CS']),
    asmaY_Id: z.coerce.number().min(1, 'Select Academic Year'),
    spccmH_Id: z.array(z.coerce.number()).optional(),
    asmcL_Id: z.coerce.number().optional(),
    asmS_Id: z.array(z.coerce.number()).optional(),
}).refine((data) => {
    if (data.type === 'House') {
        return data.spccmH_Id && data.spccmH_Id.length > 0;
    }
    return true;
}, {
    message: 'Select at least one House',
    path: ['spccmH_Id'],
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
});

export type SportStudentParticipationReportFormData = z.infer<typeof sportStudentParticipationReportSchema>;
