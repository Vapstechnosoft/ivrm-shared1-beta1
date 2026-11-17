import { z } from 'zod';

// PF Form 10 and Form 5 Report Schema
export const PFForm5FormReportSchema = z.object({
    month: z.string().min(1, { message: 'Month is required' }),
    year: z.string().min(1, { message: 'Year is required' })
});

export type PFForm5FormFields = z.infer<typeof PFForm5FormReportSchema>;

// PF Challan Report Schema
export const PFChallenSchema = z.object({
    month: z.string().min(1, { message: 'Month is required' }),
    year: z.string().min(1, { message: 'Year is required' })
});

export type PFChallenFields = z.infer<typeof PFChallenSchema>;

// PF Form 3A Report Schema
export const PFForm3aSchema = z.object({
    year: z.string().min(1, { message: 'Year is required' }),
    employee: z.string().min(1, { message: 'Employee is required' })
});

export type PFForm3aFields = z.infer<typeof PFForm3aSchema>;

// Employee Details / Retirement Report Schema
export const EmployeeDetailSchema = z.object({
    groupType: z.array(z.string()).optional().default([]),
    department: z.array(z.string()).optional().default([]),
    designation: z.array(z.string()).optional().default([]),
    fromdate: z.string().optional(),
    todate: z.string().optional(),
    status: z.string().optional().default('all'),
    formated: z.string().optional().default('format1'),
    mockLetter: z.string().optional().default('1'),
    typeOrEmployee: z.string().optional().default('type'),
    type: z.string().optional(),
    employee: z.string().optional(),
    selectedHeaders: z.array(z.string()).optional().default([])
});

export type EmployeeDetailFields = z.infer<typeof EmployeeDetailSchema>;

// Salary Certificate Report Schema
export const SalaryCertificateSchema = z.object({
    groupType: z.array(z.string()).optional().default([]),
    department: z.array(z.string()).optional().default([]),
    designation: z.array(z.string()).optional().default([]),
    month: z.string().min(1, { message: 'Month is required' }),
    year: z.string().min(1, { message: 'Year is required' }),
    employee: z.string().min(1, { message: 'Employee is required' })
});

export type SalaryCertificateFields = z.infer<typeof SalaryCertificateSchema>;
export type FormFields = z.infer<typeof SalaryCertificateSchema>;
