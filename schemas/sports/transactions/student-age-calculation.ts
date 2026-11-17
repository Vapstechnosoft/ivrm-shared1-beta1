import { z } from 'zod';

export const studentAgeCalculationSchema = z.object({
    ASMAY_Id: z.coerce.number().min(1, 'Select Academic Year'),
    ASMCL_Id: z.coerce.number().min(1, 'Select Class'),
    ASMS_Id: z.coerce.number().min(1, 'Select Section'),
    student: z.array(z.coerce.number()).min(1, 'Select at least one Student'),
    Till_Date: z.date({
        required_error: "Age Till Date is required",
    }),
});

export type StudentAgeCalculationFormData = z.infer<typeof studentAgeCalculationSchema>;

export interface StudentAgeRecord {
    id: number;
    asmaY_Year: string;
    studentName: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    age_Years: number;
    age_Months: number;
    age_Days: number;
}
