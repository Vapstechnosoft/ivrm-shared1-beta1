import * as z from 'zod';

export const staffReplacementInUnallocatedPeriodSchema = z.object({
    hrmE_Id: z.string().min(1, 'Staff is required') //staff
});

export type StaffReplacementInUnallocatedPeriodValues = z.infer<typeof staffReplacementInUnallocatedPeriodSchema>;
