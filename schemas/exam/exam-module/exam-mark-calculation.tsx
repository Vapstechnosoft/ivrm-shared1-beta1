import { z } from 'zod';

export const examMarksCalculationSchemaSchema = {
    addOrUpdate: z.object({
        emE_ID: z.number().optional(),
        mI_Id: z.number().optional(),

        asmaY_Id: z.number({ required_error: 'Academic Year is required' }).min(1, { message: 'Please select Academic Year' }),

        asmcL_Id: z.number({ required_error: 'Class  is required' }).min(1, { message: 'Please select Class ' }),

        asmS_Id: z.number({ required_error: 'Section is required' }).min(1, { message: 'Please select  Section' }),

        emE_Id: z.number({ required_error: 'Exam Name is required' }).min(1, { message: 'Please select a Exam Name' })
    })
};
