
import { z } from 'zod';

export const onlineLeaveSchema = z.object({
    reason: z.string().min(1, 'Enter Reason for Leave').max(120),
    contact: z.string()
        .min(10, 'Enter Minimum 10 characters')
        .max(10, 'Field cannot take more than 10 characters')
        .regex(/^[6-9]{1}[0-9]{9}$/, 'Enter valid Mobile NO'),
    reportingDate: z.date({
        required_error: 'Select Date of Reporting Back',
    }),
    supportingDocument: z.string().min(1, 'Please upload the file'),
});

export type OnlineLeaveValues = z.infer<typeof onlineLeaveSchema>;

export const leaveGridItemSchema = z.object({
    hrelS_Id: z.number(),
    fromDate: z.date(),
    toDate: z.date(),
    totalDays: z.number(),
    isHalfDay: z.boolean().optional(),
});

export type LeaveGridItem = z.infer<typeof leaveGridItemSchema>;
