import * as z from 'zod';

export const staffReplacementInTheirTimeTableSchema = z.object({
    hrmE_Id: z.string().min(1, 'Staff is required') //staff
    // hrmE_Id: z.string().min(1, "Please select a staff member"),
});

export type StaffReplacementInTheirTimetableValues = z.infer<typeof staffReplacementInTheirTimeTableSchema>;
