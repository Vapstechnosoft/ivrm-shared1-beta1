import { z } from 'zod';

export const staffAllotmentSchema = z.object({
  HLHSTALT_Id: z.number().optional(),
  HLMH_Id: z.number().min(1, 'Hostel is required'),
  HRME_Id: z.number().min(1, 'Staff is required'),
  HLHSTALT_AllotmentDate: z.date({
    required_error: 'Allotment Date is required',
  }),
  HRMD_Id: z.number().optional(), // Auto-fetched
  HRMDES_Id: z.number().optional(), // Auto-fetched
  HLMRCA_Id: z.number().min(1, 'Room Category is required'),
  HRMRM_Id: z.number().min(1, 'Room is required'),
  HLHSTALT_NoOfBeds: z.number().optional(),
  HLHSTALT_AllotRemarks: z.string().optional(),
  // Extra fields for display or logic
  HLHSTREQC_VegMessFlg: z.boolean().optional(),
  HLHSTREQC_NonVegMessFlg: z.boolean().optional(),
  HLHSTREQC_ACRoomFlg: z.boolean().optional(),
  HLHSTREQC_SingleRoomFlg: z.boolean().optional(),
  
  // Vacate fields (optional for now, might be separate transaction)
  HLHSTALT_VacateFlg: z.boolean().optional(),
  HLHSTALT_VacatedDate: z.date().optional().nullable(),
  HLHSTALT_VacateRemarks: z.string().optional().nullable(),
});

export type StaffAllotmentSchema = z.infer<typeof staffAllotmentSchema>;
