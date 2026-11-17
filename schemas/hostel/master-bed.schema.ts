import { z } from 'zod';

export const MasterBedSchema = z.object({
  HLMB_Id: z.number().optional(),
  HLMH_Id: z.number().min(1, 'Select Hostel'),
  HLMF_Id: z.number().min(1, 'Select Floor'),
  HRMRM_Id: z.number().min(1, 'Select Room'),
  HLMB_BedName: z.string().min(1, 'Enter Bed Name').max(50, 'Bed Name exceeds 50 characters'),
  HLMB_MattressFlg: z.boolean().default(false),
  HLMB_BedSheetFlg: z.boolean().default(false),
  HLMB_PillowFlg: z.boolean().default(false),
  HLMB_StudyTableFlg: z.boolean().default(false),
  HLMB_LampFlg: z.boolean().default(false),
});

export type MasterBedSchemaType = z.infer<typeof MasterBedSchema>;
