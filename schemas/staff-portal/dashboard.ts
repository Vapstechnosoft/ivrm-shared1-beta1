import { z } from 'zod';

export const noticeFilterSchema = z.object({
    ASMAY_Id: z.number({
        required_error: 'Academic Year is required',
    }),
});

export const bookFilterSchema = z.object({
    LMB_Id: z.number({
        required_error: 'Book Title is required',
    }),
});

export type INoticeFilterSchema = z.infer<typeof noticeFilterSchema>;
export type IBookFilterSchema = z.infer<typeof bookFilterSchema>;
