import { z } from 'zod';

export const masterRoomCategorySchema = z.object({
    hlmrcA_Id: z.number().optional(),
    hlmH_Id: z.string().min(1, 'Hostel is required'),
    fmG_Id: z.string().min(1, 'Fee Group is required'),
    hlmrcA_RoomCategory: z.string().min(1, 'Room Category Name is required'),
    hlmrcA_Description: z.string().optional(),
    hlmrcA_MaxCapacity: z.string().min(1, 'Max Capacity is required'),
    hlmrcA_RoomRate: z.string().min(1, 'Room Rate is required'),
    hlmrcA_SORate: z.string().optional(),
    hlmrcA_ACFlg: z.boolean().default(false),
    hlmrcA_SharingFlg: z.boolean().default(false),
    hlmrcA_ActiveFlag: z.boolean().optional()
});

export type IMasterRoomCategoryForm = z.infer<typeof masterRoomCategorySchema>;
