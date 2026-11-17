import { z } from 'zod';

export const RoomCategorySchema = z.object({
  hlmrcA_Id: z.number().optional().default(0),
  HLMH_Id: z.coerce.number().min(1, 'Hostel Name is required'),
  FMG_Id: z.coerce.number().min(1, 'Fee Group is required'),
  HLMRCA_RoomCategory: z.string()
    .min(1, 'Room Category Name is required')
    .regex(/^[a-zA-Z\s]+$/, 'Room Category must contain only alphabets'),
  HLMRCA_SORate: z.coerce.number().min(1, 'Single Bed Occupancy Rate is required'),
  HLMRCA_RoomRate: z.coerce.number().optional().default(0),
  HLMRCA_MaxCapacity: z.coerce.number().min(1, 'Max Capacity is required'),
  HLMRCA_Description: z.string().min(1, 'Description is required'),
  hlmrcA_ACFlg: z.boolean().default(false),
  hlmrcA_SharingFlg: z.boolean().default(false),
  hlmrcA_ActiveFlag: z.boolean().default(true),
}).superRefine((data, ctx) => {
  if (data.hlmrcA_SharingFlg && (!data.HLMRCA_RoomRate || data.HLMRCA_RoomRate <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Multiple Bed Occupancy Rate is required when Sharing is enabled',
      path: ['HLMRCA_RoomRate'],
    });
  }
});

export type RoomCategorySchemaType = z.infer<typeof RoomCategorySchema>;
