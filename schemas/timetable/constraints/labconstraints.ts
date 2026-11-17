import { z } from 'zod';

export const labConstraintsSchema = z.object({
    TTLAB_Id: z.number().optional(),
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    TTMC_Id: z.number().min(1, 'Category is required'),
    ASMCL_Id: z.number().min(1, 'Class is required'),
    ASMS_Id: z.number().min(1, 'Section is required'),
    TTLAB_LABLibId: z.number().min(1, 'Lab is required')
});

export type LabConstraintsSchema = z.infer<typeof labConstraintsSchema>;
