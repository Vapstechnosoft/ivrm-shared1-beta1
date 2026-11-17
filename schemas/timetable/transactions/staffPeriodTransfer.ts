import * as z from 'zod';

export const staffPeriodTransferSchema = z.object({
    asmaY_Id: z.string().min(1, 'Academic Year is required'), //academic
    asmcL_Id: z.string().optional(), //Class
    asms_Id: z.string().optional(), //Section
    hrmE_Id: z.string().min(1, 'Staff is required'), //staff
    ismS_Id: z.string().optional() //Subject
});

export type StaffPeriodTransferValues = z.infer<typeof staffPeriodTransferSchema>;
