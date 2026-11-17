import { z } from 'zod';

export const masterFloorSchema = z.object({
    hlmF_Id: z.number().optional(),
    hrmF_FloorName: z.string().min(1, 'Floor Name is required'),
    hrmF_FloorDesc: z.string().optional(),
    hlmH_Id: z.string().min(1, 'Hostel is required'),
    // Facility selection: array of objects with facility ID and active flag
    selected_facilities: z.array(z.object({
        hlmftY_Id: z.number(),
        hlmfF_ActiveFlg: z.boolean().default(true)
    })).optional(),
    
    // For UI handling of multi-select (array of string IDs)
    selectedFacilityIds: z.array(z.string()).optional()
});

export type IMasterFloorForm = z.infer<typeof masterFloorSchema>;
