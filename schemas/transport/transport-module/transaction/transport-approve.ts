import { z } from 'zod';

export const transportApproveSchema = {
    search: z.object({
        asmaY_Id: z.number().min(1, 'Academic Year is required'),
        asmcL_Id: z.number().min(0, 'Class is required'), // 0 for All
        trmR_Id: z.number().min(0, 'Route is required'), // 0 for All
        newreg: z.enum(['New', 'Regular', 'Both'], {
            errorMap: () => ({ message: 'Select New/Regular/Both' })
        })
    })
};
