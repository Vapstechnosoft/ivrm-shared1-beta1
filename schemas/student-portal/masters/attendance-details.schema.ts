import { z } from 'zod';

export const attendanceDetailsSchema = z.object({
    asmaY_Id: z.string().min(1, { message: 'Select the Academic Year' })
});

export type AttendanceDetailsSchema = z.infer<typeof attendanceDetailsSchema>;

export const studentFeedBackSchema = {
    addOrUpdate: z.object({
        asgfE_Id: z.number().nonnegative().optional(), // optional when creating new record
        asgfE_FeedBack: z.string({ message: 'Feedback is required' }).min(2).max(100)
    })
};
