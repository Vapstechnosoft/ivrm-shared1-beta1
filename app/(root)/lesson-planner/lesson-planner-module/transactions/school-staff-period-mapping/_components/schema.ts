import { z } from 'zod';

export const SchoolStaffPeriodMappingSchema = z.object({
    ASMA_Id: z.coerce.number().min(1, 'Academic Year is required'),
    HRME_Id: z.coerce.number().min(1, 'Employee is required'),
    ASMCL_Id: z.coerce.number().min(1, 'Class is required'),
    ASMS_Id: z.coerce.number().min(1, 'Section is required'),
    ISMS_Id: z.coerce.number().min(1, 'Subject is required')
});

export type ISchoolStaffPeriodMappingFormValues = z.infer<typeof SchoolStaffPeriodMappingSchema>;

export const TopicMappingItemSchema = z.object({
    Selected: z.boolean().optional(),
    LPLP_LPDate: z.string(),
    LPMT_Id: z.number().nullable().optional(),
    LPLP_Id: z.number().optional(),
    UnitFileAttachment: z.string().optional(),
    UnitFileLocation: z.string().optional()
});

export const SaveMappingSchema = z.object({
    ISMS_Id: z.number(),
    ASMAY_Id: z.number(),
    ASMCL_Id: z.number(),
    ASMS_Id: z.number(),
    HRME_Id: z.number(),
    SchoolStaffPeriodMappingTempDTO: z.array(TopicMappingItemSchema)
});

export type ISaveMappingValues = z.infer<typeof SaveMappingSchema>;
