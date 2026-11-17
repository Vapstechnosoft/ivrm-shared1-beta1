import { z } from 'zod';

export const masterPageSchema = z.object({
    ivrmP_Id: z.number().optional(),
    ivrmmP_PageName: z.string().min(1, 'Page Name is required').max(100, 'Page Name matches limit').regex(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces allowed'),
    ivrmP_PageDisplayName: z.string().min(1, 'Display Name is required').max(100, 'Display Name matches limit').regex(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces allowed'),
    ivrmP_PageDesc: z.string().min(1, 'Page Description is required').max(100, 'Page Description matches limit').regex(/^[a-zA-Z.\s]+$/, 'Only alphabets, dots and spaces allowed'),
    ivrmP_MandatoryFlag: z.union([z.boolean(), z.number(), z.null()])
        .transform((val) => {
            if (val === null) return 0;
            if (typeof val === 'boolean') return val ? 1 : 0;
            return val;
        }).optional()
});

export type MasterPageSchema = z.infer<typeof masterPageSchema>;
