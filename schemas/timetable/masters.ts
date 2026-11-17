import { number, z } from 'zod';
import { createOptionalNumberOnlyStringSchema, createStringOnlySchema, deleteIdSchema } from '../validationSchemas';

export const masterDaySchema = {
    addOrUpdate: z.object({
        ttmD_Id: z.number().optional(),
        ttmD_DayName: createStringOnlySchema('Day Name', 1, 100),
        ttmD_DayCode: createStringOnlySchema('Day Code', 1, 100)
    }),
    delete: z.object({
        ttmD_Id: deleteIdSchema('ttmD_Id')
    })
};

export const masterDayClasswiseSchema = {
    addOrUpdate: z.object({
        asmay_id: number().min(1, 'Please select Academic Year'),
        ttmC_Id: number().min(1, 'Please select Category'),
        calssids: z.array(z.string()).nonempty('Please select at least one Class'),
        dayids: z.array(z.string()).nonempty('Please select at least one Day')
    }),
    delete: z.object({
        ttmdC_Id: deleteIdSchema('ttmdC_Id')
    })
};

export const masterBuildingSchema = {
    addOrUpdate: z.object({
        ttmB_Id: z.number().optional(),
        ttmB_BuildingName: createStringOnlySchema('Building Name', 1, 100)
    }),
    delete: z.object({
        ttmB_Id: deleteIdSchema('ttmB_Id')
    })
};

export const staffabbreviationsSchema = {
    addOrUpdate: z.object({
        TTMSAB_Id: z.number().optional(),
        HRME_Id: number().min(1, 'Please select an Staff'),
        // ttmB_BuildingName: createStringOnlySchema('Building Name', 1, 100),
        TTMSAB_Abbreviation: createStringOnlySchema('Abbreviation', 1, 100),
        TTMSAB_PerDayMaxDeputation: createOptionalNumberOnlyStringSchema('Per Day Max Deputation', 1, 100),
        TTMSAB_PerWeekMaxDeputation: createOptionalNumberOnlyStringSchema('Per Week Max Deputation', 1, 100),
        TTMSAB_PerMonthMaxDeputation: createOptionalNumberOnlyStringSchema('Per Month Max Deputation', 1, 100),
        TTMSAB_PerYearMaxDeputation: createOptionalNumberOnlyStringSchema('Per Month Max Deputation', 1, 100)
    }),
    delete: z.object({
        TTMSAB_Id: deleteIdSchema('TTMSAB_Id')
    })
};

export const subjectabbreviationsSchema = {
    addOrUpdate: z.object({
        ismS_Id: number().min(1, 'Please select an Subject'),
        ttmsuaB_Abbreviation: createStringOnlySchema('Abbreviation', 1, 100)
    }),
    delete: z.object({
        ttmsuaB_Id: deleteIdSchema('ttmsuaB_Id')
    })
};

export const masterTimeTableCategorySchema = {
    addOrUpdate: z.object({
        ttmC_Id: z.number().optional(),
        ttmC_CategoryName: createStringOnlySchema('Category Name', 1, 100)
    }),
    delete: z.object({
        ttmC_Id: deleteIdSchema('ttmC_Id')
    })
};

export const categoryClassMappingSchema = {
    addOrUpdate: z.object({
        asmay_id: z.number().int({ message: 'Academic Year is required' }),
        ttmC_Id: z.number().int({ message: 'Category is required' }),
        calssids: z.array(z.string()).nonempty('Please select at least one Class')
    })
    // ,
    // delete: z.object({
    //     ttmB_Id: deleteIdSchema('ttmB_Id')
    // })
};

export const breakTimeSettingsSchema = {
    addOrUpdate: z.object({
        asmay_id: number().min(1, 'Please select Academic Year'),
        ttmC_Id: number().min(1, 'Please select Category'),
        calssids: z.array(z.string()).nonempty('Please select at least one Class'),
        dayids: z.array(z.string()).nonempty('Please select at least one Day'),
        ttmB_BreakName: z.string().min(3, 'Break Name must be at least 3 characters'),
        ttmB_BreakStartTime: z.date({ required_error: 'Start Time is required' }),
        ttmB_BreakEndTime: z.date({ required_error: 'End Time is required' }),
        ttmB_AfterPeriod: z.number().min(1, 'After Period is required'),
        arraybeforeperiodsList: z.array(z.number()).optional(),
        arrayafterperiodsList: z.array(z.number()).optional()
    })
};

export const masterPeriodSchema = {
    save: z.object({
        periodname: number().min(1, 'Please select Academic Year'),
        periodorder: number().min(1, 'Please enter Period Order'),
        categoryids: z.array(z.string()).nonempty('Please select at least one Category'),
        noOfPeriods: z.number().min(1, 'Enter at least 1 period').max(20, 'Max 20 periods allowed'),
        half: z.string().optional()
    })
};

export const periodAllocationmasterPeriod = {
    save: z.object({
        //   periodname: number().min(1, 'Please select Academic Year'),
        periodorder: number().optional(),
        // categoryids: z.array(z.string()).nonempty('Please select at least one Category'),
        noOfPeriods: z.number().optional()
        // half: z.string().optional()
    }),
    delete: z.object({
        ttmP_Id: deleteIdSchema('ttmP_Id')
    })
};

export const masterPeriodClassSchema = {
    save: z.object({
        // asmaY_Id: z.number().min(1, 'Academic Year is required'),
        // ttmC_Id: z.number().min(1, 'Category is required'),
        // classIds: z
        //     .array(
        //         z.object({
        //             asmcL_Id: z.number(),
        //             asmcL_ClassName: z.string()
        //         })
        //     )
        //     .min(1, 'Select at least one Class'),
        asmay_id: number().min(1, 'Please select Academic Year'),
        ttmC_Id: number().min(1, 'Please select Category'),
        calssids: z.array(z.string()).nonempty('Please select at least one Class'),
        noOfPeriods: z.coerce.number().min(1, 'Enter at least 1 period')
    }),
    delete: z.object({
        ttmpC_Id: deleteIdSchema('ttmpC_Id')
    })
};

export const periodDistributionSchema = {
    save: z.object({
        asmaY_Id: z.number().min(1, 'Academic Year is required'),
        nop1: z.coerce.number().min(1, 'Enter No. Of Periods'),
        ttfpD_StaffConsecutive: z.coerce.number().min(1, 'Enter Staff Consecutive'),
        hrmE_Id: z.number().min(1, 'Staff Name is required'),
        ttmC_Id: z.number().min(1, 'Category is required').optional().or(z.literal(0)),
        asmcL_Id: z.number().min(1, 'Class is required').optional().or(z.literal(0)),
        asmS_Id: z.number().min(1, 'Section is required').optional().or(z.literal(0)),
        ismS_Id: z.number().min(1, 'Subject is required').optional().or(z.literal(0)),
        nop2: z.coerce.number().optional().or(z.literal(0))
    })
};

export const periodTimeSettingSchema = {
    save: z.object({
        ttmdpT_Id: z.number().optional(),
        asmaY_Id: z.number().min(1, 'Academic Year is required'),
        ttmC_Id: z.number().min(1, 'Category is required'),
        ttmP_Id: z.number().min(1, 'Period is required'),
        dayIds: z
            .array(
                z.object({
                    ttmD_Id: z.number(),
                    ttmD_DayName: z.string().optional()
                })
            )
            .min(1, 'Select at least one day'),
        startTime: z.date({ required_error: 'Start Time is required' }),
        endTime: z.date({ required_error: 'End Time is required' })
    })
};
