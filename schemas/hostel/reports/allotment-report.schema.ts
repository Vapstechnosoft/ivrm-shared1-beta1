import { z } from 'zod';

// Schema for Allotment Report
export const allotmentReportSchema = z.object({
  type: z.enum(['Student', 'Staff', 'Guest'], { required_error: 'Type is required' }),
  ASMAY_Id: z.number().min(1, 'Academic Year is required'),
  HLMH_Id: z.number().min(1, 'Hostel is required'),
  frmdate: z.date({ required_error: 'From Date is required' }),
  todate: z.date({ required_error: 'To Date is required' }),
});

export type AllotmentReportSchema = z.infer<typeof allotmentReportSchema>;
