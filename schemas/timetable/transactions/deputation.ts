import * as z from 'zod';

export const DeputationSchema = z.object({
    asmaY_Id: z.string().min(1, 'Academic Year is required'),
    ttmD_Date: z.date({ required_error: 'Date is required' }),
    absent_Staff_Flag: z.boolean().default(false),
    hrE_Id: z.string().min(1, 'Staff Name is required'),
    ttmD_Day: z.string().optional(),
    ttmD_Remarks: z.string().optional(),
    sms_Flag: z.boolean().default(false),
    email_Flag: z.boolean().default(false),
    notification_Flag: z.boolean().default(false)
});
