import { z } from 'zod';

export const MasterMessSchema = z.object({
  hlmM_Id: z.number().optional(),
  hlmM_Name: z.string().min(1, 'Enter Mess Name').max(100, 'Mess Name exceeds 100 characters'),
  hlmM_VegFlg: z.boolean().default(false),
  hlmM_NonVegFlg: z.boolean().default(false),
  hlmM_BFSStartTime: z.string().optional().nullable(),
  hlmM_BFSEndTime: z.string().optional().nullable(),
  hlmM_LNStartTime: z.string().optional().nullable(),
  hlmM_LNEndTime: z.string().optional().nullable(),
  hlmM_LNTSStartTime: z.string().optional().nullable(),
  hlmM_LNTSEndTime: z.string().optional().nullable(),
  hlmM_DNSStartTime: z.string().optional().nullable(),
  hlmM_DNSEndTime: z.string().optional().nullable(),
});

export type MasterMessSchemaType = z.infer<typeof MasterMessSchema>;
