import { z } from 'zod';

export const vacateRoomSchema = z.object({
  type: z.enum(['student', 'staff', 'guest']),
  AMST_Id: z.number().optional().nullable(),
  HRME_Id: z.number().optional().nullable(),
  HLHGSTALT_Id: z.number().optional().nullable(),
  
  HLHSALT_VacatedDate: z.date().optional().nullable(), // For Student/Staff/Guest based on type
  HLHSALT_VacateRemarks: z.string().optional().nullable(),

  // Display only fields (not for submission but for form context)
  HLMH_Name: z.string().optional(),
  HRMRM_RoomNo: z.string().optional(),
  JoiningDate: z.date().optional().nullable(),
}).refine((data) => {
    if (data.type === 'student' && !data.AMST_Id) return false;
    if (data.type === 'staff' && !data.HRME_Id) return false;
    if (data.type === 'guest' && !data.HLHGSTALT_Id) return false;
    return true;
}, {
    message: "Person selection is required",
    path: ["AMST_Id"] // Generic path
});

export type VacateRoomSchema = z.infer<typeof vacateRoomSchema>;
