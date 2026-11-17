import { z } from 'zod';

export const SchoolMasterUnitSchema = z.object({
    lpmU_Id: z.number().optional(),
    lpmU_UnitName: z.string().min(1, 'Unit Name is required').max(100, 'Unit Name must be at most 100 characters'),
    lpmU_UnitDescription: z.string().max(100, 'Unit Description must be at most 100 characters').optional().nullable(),
    lpmU_TotalPeriods: z.coerce
        .number({
            invalid_type_error: 'Total No. of Periods must be a number'
        })
        .min(0, 'Total No. of Periods must be at least 0')
        .max(999, 'Total No. of Periods must be at most 999')
        .optional()
        .nullable(),
    lpmU_TotalHrs: z
        .string()
        .regex(/^[0-9]+(\.[0-9]{1,2})?$/, 'Enter valid Format [For Example 10.50]')
        .max(5, 'Total No. of Hours must be at most 5 characters')
        .optional()
        .nullable()
});

export type ISchoolMasterUnitFormValues = z.infer<typeof SchoolMasterUnitSchema>;
