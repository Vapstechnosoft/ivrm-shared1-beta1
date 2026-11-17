import { z } from 'zod';

export const dayPeriodSchema = z.object({
    TTRDP_Id: z.number().optional(),
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    TTMC_Id: z.number().min(1, 'Category is required'),
    ASMCL_Id: z.number().min(1, 'Class is required'),
    ASMS_Id: z.number().min(1, 'Section is required'),
    HRME_Id: z.number().min(1, 'Staff is required'),
    ISMS_Id: z.number().min(1, 'Subject is required'),
    TTMD_Id: z.number().min(1, 'Day is required'),
    TTMP_Id: z.number().min(1, 'Period is required'),
    TTRDP_SUbSelcFlag: z.boolean().optional(),
    combinationlist: z
        .array(
            z.object({
                ASMCL_Id: z.number(),
                ASMS_Id: z.number(),
                HRME_Id: z.number(),
                ISMS_Id: z.number(),
                TTRDPCC_Periods: z.number().min(1, 'Period count is required') // Mapped from NOP
            })
        )
        .optional()
});

export const dayStaffSchema = z.object({
    TTRDS_Id: z.number().optional(),
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    TTMD_Id: z.number().min(1, 'Day is required'),
    HRME_Id: z.number().min(1, 'Staff is required'),
    TTRDS_SUbSelcFlag: z.boolean().optional(),
    combinationlist: z
        .array(
            z.object({
                ASMCL_Id: z.number(),
                ASMS_Id: z.number(),
                ISMS_Id: z.number(),
                TTRDSCC_Periods: z.number().min(1, 'Period count is required') // Mapped from NOP
            })
        )
        .optional()
});

export const daySubjectSchema = z.object({
    TTRDSU_Id: z.number().optional(),
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    TTMD_Id: z.number().min(1, 'Day is required'),
    ISMS_Id: z.number().min(1, 'Subject is required'),
    TTRDSU_SUbSelcFlag: z.boolean().optional(),
    combinationlist: z
        .array(
            z.object({
                ASMCL_Id: z.number(),
                ASMS_Id: z.number(),
                HRME_Id: z.number(),
                TTRDSUCC_Periods: z.number().min(1, 'Period count is required') // Mapped from NOP
            })
        )
        .optional()
});

export const periodStaffSchema = z.object({
    TTRPS_Id: z.number().optional(),
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    TTMP_Id: z.number().min(1, 'Period is required'),
    HRME_Id: z.number().min(1, 'Staff is required'),
    TTRPS_SUbSelcFlag: z.boolean().optional(),
    combinationlist: z
        .array(
            z.object({
                ASMCL_Id: z.number(),
                ASMS_Id: z.number(),
                ISMS_Id: z.number(),
                TTRPSCC_Days: z.number().min(1, 'Day count is required') // Mapped from NOP/NOD
            })
        )
        .optional()
});

export const periodSubjectSchema = z.object({
    TTRPSU_Id: z.number().optional(),
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    TTMP_Id: z.number().min(1, 'Period is required'),
    ISMS_Id: z.number().min(1, 'Subject is required'),
    TTRPSU_SUbSelcFlag: z.boolean().optional(),
    combinationlist: z
        .array(
            z.object({
                ASMCL_Id: z.number(),
                ASMS_Id: z.number(),
                HRME_Id: z.number(),
                TTRPSUCC_Days: z.number().min(1, 'Day count is required') // Mapped from NOP/NOD
            })
        )
        .optional()
});

// Temp schemas for appending to grid
export const tempDayStaffSchema = z.object({
    ASMCL_Id: z.number().min(1, 'Class is required'),
    ASMS_Id: z.number().min(1, 'Section is required'),
    ISMS_Id: z.number().min(1, 'Subject is required'),
    NOP: z.string().min(1, 'Period count is required') // Input as string then converted
});
// ... other temp schemas as needed ...
