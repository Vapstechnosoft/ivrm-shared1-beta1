import * as z from 'zod';

// Define the form schema and types
export const EmployeeOfferLaterSchema = z.object({
    groupType: z.string().min(1, 'Group Type is required'),
    department: z.string().min(1, 'Department is required'),
    designation: z.string().min(1, 'Designation is required'),
    month: z.string().optional(),
    year: z.string().optional(),
    employee: z.string().min(1, 'Employee is required'),
    mockLetter: z.string().min(1, 'Letter type is required')
});

export type EmployeeOfferLaterFields = z.infer<typeof EmployeeOfferLaterSchema>;
