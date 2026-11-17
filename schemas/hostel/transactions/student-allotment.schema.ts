import { z } from 'zod';

// Schema for Student Allotment Transaction
export const studentAllotmentSchema = z.object({
  HLHSALT_Id: z.number().optional().default(0),
  ASMAY_Id: z.number().min(1, 'Academic Year is required'),
  HLHSALT_AllotmentDate: z.date({ required_error: 'Allotment Date is required' }),
  HLMH_Id: z.number().min(1, 'Hostel is required'),
  AMST_Id: z.number().min(1, 'Student is required'),
  ASMCL_Id: z.number().optional(), // Readonly, fetched
  ASMS_Id: z.number().optional(),  // Readonly, fetched
  HLMRCA_Id: z.number().optional(), // Readonly, fetched
  HRMRM_Id: z.number().min(1, 'Room Number is required'),
  HLHSALT_NoOfBeds: z.number().optional(), // Readonly, fetched
  HLHSALT_AllotRemarks: z.string().optional(),
  
  // Mess & Room Flags (Readonly/Display)
  HLHSREQC_VegMessFlg: z.boolean().optional(),
  HLHSREQC_NonVegMessFlg: z.boolean().optional(),
  HLHSREQC_ACRoomFlg: z.boolean().optional(),
  HLHSREQC_SingleRoomFlg: z.boolean().optional(),

  // Vacate Fields (Optional, validation might be dynamic or handled in a different state)
  HLHSALT_VacateFlg: z.boolean().optional(),
  HLHSALT_VacatedDate: z.date().optional().nullable(),
  HLHSALT_VacateRemarks: z.string().optional().nullable(),
});

export type StudentAllotmentSchema = z.infer<typeof studentAllotmentSchema>;
