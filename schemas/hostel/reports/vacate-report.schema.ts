import { z } from 'zod';

export const vacateReportSchema = z.object({
  type: z.enum(['student', 'staff', 'guest']),
  type2: z.enum(['all', 'Hostel', 'individual']),
  ASMAY_Id: z.number().optional().nullable(),
  Fromdate: z.date({ required_error: 'Start Date is required' }),
  ToDate: z.date({ required_error: 'End Date is required' }),
  SelectedHostellist: z.array(z.object({ HLMH_Id: z.number() })).optional(),
  SelectedStudentlist: z.array(z.object({ AMST_Id: z.number() })).optional(),
  Selectedstafflist: z.array(z.object({ HRME_Id: z.number() })).optional(),
  Selectedguestlist: z.array(z.object({ HLHGSTALT_Id: z.number() })).optional(),
}).refine((data) => {
    if (data.type === 'student' && !data.ASMAY_Id) return false;
    return true;
}, {
    message: "Academic Year is required for Student report",
    path: ["ASMAY_Id"]
});

export type VacateReportSchema = z.infer<typeof vacateReportSchema>;
