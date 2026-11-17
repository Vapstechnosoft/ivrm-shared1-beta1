import { z } from 'zod';

export const roomTariffSchema = z.object({
  hlmrtF_Id: z.any().optional(),
  asmaY_Id: z.string().min(1, 'Select Academic Year'),
  hrmrM_Id: z.string().min(1, 'Select Room'),
  hlmrtF_SORate: z.string().min(1, 'Enter Single Occupancy Rate').refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, 'Must be a positive number'),
  hlmrtF_RoomRate: z.string().min(1, 'Enter Room Rate').refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, 'Must be a positive number'),
});

export type IRoomTariffForm = z.infer<typeof roomTariffSchema>;
