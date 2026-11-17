import { z } from 'zod';

/**
 * HRMS Transaction Schemas
 */

// Employee Loan Schemas
export const employeeLoanFormSchema = z.object({
    employeeId: z.number().min(1, 'Employee is required'),
    loanTypeId: z.number().min(1, 'Loan Type is required'),
    amount: z
        .number()
        .min(0.01, 'Loan Amount must be greater than 0')
        .refine((val) => {
            const str = val.toString();
            const parts = str.split('.');
            return parts[0].length <= 8 && (parts[1]?.length || 0) <= 2;
        }, 'Loan Amount must be in decimal format (10,2)'),
    installments: z
        .number()
        .int('Loan Installments must be a whole number')
        .min(1, 'Loan Installments must be at least 1')
        .max(9999, 'Loan Installments must not exceed 9999'),
    startDate: z.string().min(1, 'Applied Date is required'),
    modeOfPayment: z.string().min(1, 'Mode Of Payment is required'),
    referenceNo: z
        .string()
        .max(20, 'Reference No. must not exceed 20 characters')
        .regex(/^\d*$/, 'Reference No. must contain only numbers')
        .optional()
        .or(z.literal('')),
    loanInterest: z
        .number()
        .min(0, 'Loan Interest is required')
        .refine((val) => {
            const str = val.toString();
            const parts = str.split('.');
            return parts[0].length <= 3 && (parts[1]?.length || 0) <= 2;
        }, 'Loan Interest must be in decimal format (5,2)'),
    loanEMI: z
        .number()
        .min(0.01, 'Loan EMI is required')
        .refine((val) => {
            const str = val.toString();
            const parts = str.split('.');
            return parts[0].length <= 8 && (parts[1]?.length || 0) <= 2;
        }, 'Loan EMI must be in decimal format (10,2)')
});

export const employeeLoanSchema = z.object({
    HREL_Id: z.number().optional(),
    MI_Id: z.number(),
    HRME_Id: z.number().min(1, 'Employee is required'),
    HRMLN_Id: z.number().min(1, 'Loan Type is required'),
    HREL_AppliedDate: z.string().min(1, 'Applied Date is required'),
    HREL_ModeOfPayment: z.string().min(1, 'Mode Of Payment is required'),
    HREL_ReferenceNo: z
        .string()
        .max(20, 'Reference No. must not exceed 20 characters')
        .regex(/^\d*$/, 'Reference No. must contain only numbers')
        .optional()
        .or(z.literal('')),
    HREL_LoanAmount: z
        .number()
        .min(0.01, 'Loan Amount must be greater than 0')
        .refine((val) => {
            const str = val.toString();
            const parts = str.split('.');
            return parts[0].length <= 8 && (parts[1]?.length || 0) <= 2;
        }, 'Loan Amount must be in decimal format (10,2)'),
    HREL_LoanInterest: z
        .number()
        .min(0, 'Loan Interest must be greater than or equal to 0')
        .refine((val) => {
            const str = val.toString();
            const parts = str.split('.');
            return parts[0].length <= 3 && (parts[1]?.length || 0) <= 2;
        }, 'Loan Interest must be in decimal format (5,2)'),
    HREL_LoanInsallments: z
        .number()
        .int('Loan Installments must be a whole number')
        .min(1, 'Loan Installments must be at least 1')
        .max(9999, 'Loan Installments must not exceed 9999'),
    HREL_LaonEMI: z
        .number()
        .min(0.01, 'Loan EMI must be greater than 0')
        .refine((val) => {
            const str = val.toString();
            const parts = str.split('.');
            return parts[0].length <= 8 && (parts[1]?.length || 0) <= 2;
        }, 'Loan EMI must be in decimal format (10,2)'),
    HREL_ActiveFlag: z.boolean().default(true),
    LogInUserId: z.number().optional()
});

// Salary Advance Schemas
export const salaryAdvanceFormSchema = z.object({
    employeeId: z.string().min(1, 'Employee is required'),
    entryDate: z.string().min(1, 'Entry Date is required'),
    advanceYear: z.string().min(1, 'Advanced Year is required'),
    advanceMonth: z.string().min(1, 'Advanced Month is required'),
    appliedAmount: z
        .number()
        .min(0.01, 'Advanced Amount must be greater than 0')
        .refine((val) => {
            const str = val.toString();
            const parts = str.split('.');
            return parts[0].length <= 8 && (parts[1]?.length || 0) <= 2;
        }, 'Advanced Amount must be in decimal format (10,2)'),
    modeOfPayment: z.string().min(1, 'Mode of Payment is required'),
    referenceNo: z
        .string()
        .max(255, 'Reference No must not exceed 255 characters')
        .regex(/^[A-Za-z0-9]*$/, 'Reference No must be alphanumeric')
        .optional()
        .or(z.literal('')),
    remarks: z.string().max(255, 'Remarks must not exceed 255 characters').optional().or(z.literal(''))
});

export const salaryAdvanceSchema = z.object({
    HRESA_Id: z.number().optional(),
    MI_Id: z.number(),
    HRME_Id: z.number().min(1, 'Employee is required'),
    HRESA_EntryDate: z.string().min(1, 'Entry Date is required'),
    HRESA_AdvYear: z.number().min(1, 'Advanced Year is required'),
    HRESA_AdvMonth: z.string().min(1, 'Advanced Month is required'),
    HRESA_AppliedAmount: z
        .number()
        .min(0.01, 'Advanced Amount must be greater than 0')
        .refine((val) => {
            const str = val.toString();
            const parts = str.split('.');
            return parts[0].length <= 8 && (parts[1]?.length || 0) <= 2;
        }, 'Advanced Amount must be in decimal format (10,2)'),
    HRESA_ModeOfPayment: z.string().min(1, 'Mode of Payment is required'),
    HRESA_ReferenceNo: z
        .string()
        .max(255, 'Reference No must not exceed 255 characters')
        .regex(/^[A-Za-z0-9]*$/, 'Reference No must be alphanumeric')
        .optional()
        .or(z.literal('')),
    HRESA_Remarks: z.string().max(255, 'Remarks must not exceed 255 characters').optional().or(z.literal('')),
    HRESA_ActiveFlag: z.boolean().default(true),
    LogInUserId: z.number().optional()
});

// Salary Approval Schema
export const salaryApprovalSchema = z.object({
    HRES_Year: z.string().optional(),
    HRES_Month: z.string().optional(),
    groupTypeIdList: z.array(z.number()).optional(),
    hrmD_IdList: z.array(z.number()).optional(),
    hrmdeS_IdList: z.array(z.number()).optional()
});

// Mass Updation Schemas
export const massUpdationFormSchema = z
    .object({
        groupType: z.array(z.string()).min(1, 'Group Type is required'),
        department: z.array(z.string()).min(1, 'Department is required'),
        designation: z.array(z.string()).min(1, 'Designation is required'),
        selectedHead: z.string().min(1, 'Head is required'),
        updateType: z.enum(['Percentage', 'Amount'], {
            required_error: 'Please select Amount or Percentage'
        }),
        updateValue: z.number().min(0, 'Value must be greater than or equal to 0'),
        effectiveDate: z.string().optional(),
        earningDeduction: z.enum(['Earning', 'Deduction'], {
            required_error: 'Please select Earning or Deduction'
        }),
        addRemove: z.enum(['Add', 'Remove'], {
            required_error: 'Please select an Action'
        })
    })
    .refine(
        (data) => {
            if (data.updateType === 'Percentage') {
                const str = data.updateValue.toString();
                const parts = str.split('.');
                return parts[0].length <= 3 && (parts[1]?.length || 0) <= 2;
            }
            return true;
        },
        {
            message: 'Percentage must be in decimal format (5,2)',
            path: ['updateValue']
        }
    );

export const massUpdationSchema = {
    search: z.object({
        groupType: z.array(z.string()).min(1, 'Group Type is required'),
        department: z.array(z.string()).min(1, 'Department is required'),
        designation: z.array(z.string()).min(1, 'Designation is required')
    }),
    update: z
        .object({
            MI_Id: z.number(),
            employeeIdList: z.array(z.number()).min(1, 'Please select at least one employee'),
            earningDeduction: z.enum(['Earning', 'Deduction'], {
                required_error: 'Please select Earning or Deduction'
            }),
            updateType: z.enum(['Amount', 'Percentage'], {
                required_error: 'Please select Amount or Percentage'
            }),
            selectedHead: z.string().min(1, 'Head is required'),
            updateValue: z.number().min(0, 'Value must be greater than or equal to 0'),
            addRemove: z.enum(['Add', 'Remove'], {
                required_error: 'Please select an Action'
            }),
            LogInUserId: z.number().optional()
        })
        .refine(
            (data) => {
                if (data.updateType === 'Percentage') {
                    const str = data.updateValue.toString();
                    const parts = str.split('.');
                    return parts[0].length <= 3 && (parts[1]?.length || 0) <= 2;
                }
                return true;
            },
            {
                message: 'Percentage must be in decimal format (5,2)',
                path: ['updateValue']
            }
        )
};

// Salary Calculation Schema
export const salaryCalculationSchema = {
    search: z.object({
        HRES_Year: z.string().optional(),
        HRES_Month: z.string().optional(),
        groupTypeIdList: z.array(z.number()).optional(),
        hrmD_IdList: z.array(z.number()).optional(),
        hrmdeS_IdList: z.array(z.number()).optional()
    }),
    generate: z.object({
        MI_Id: z.number(),
        HRES_Year: z.string().optional(),
        HRES_Month: z.string().optional(),
        employeeIdList: z.array(z.number()).min(1, 'Please select at least one employee'),
        LogInUserId: z.number().optional()
    })
};

// Salary Increment Schema
export const salaryIncrementSchema = z
    .object({
        HRESI_Id: z.number().optional(),
        MI_Id: z.number(),
        HRME_Id: z.number().min(1, 'Employee is required'),
        HRESI_EffectiveDate: z.date({
            required_error: 'Increment Date is required'
        }),
        HRMED_Id: z.number().min(1, 'Head is required'),
        HRESI_IncrementType: z.enum(['Percentage', 'Amount']).optional(),
        HRESI_IncrementAmount: z.number().min(0, 'Amount cannot be negative').optional(),
        HRESI_IncrementPercentage: z
            .number()
            .min(0, 'Percentage cannot be negative')
            .max(100, 'Percentage cannot exceed 100')
            .refine((val) => {
                const str = val.toString();
                const parts = str.split('.');
                return parts[0].length <= 3 && (parts[1]?.length || 0) <= 2;
            }, 'Percentage must be in decimal format (5,2)')
            .optional(),
        HRESI_Remarks: z.string().max(256, 'Remarks must not exceed 256 characters').optional().or(z.literal('')),
        HRESI_ActiveFlg: z.boolean().default(true),
        LogInUserId: z.number().optional()
    })
    .refine(
        (data) => {
            // If increment type is Percentage, percentage must be provided
            if (data.HRESI_IncrementType === 'Percentage' && (!data.HRESI_IncrementPercentage || data.HRESI_IncrementPercentage <= 0)) {
                return false;
            }
            // If increment type is Amount, amount must be provided
            if (data.HRESI_IncrementType === 'Amount' && (!data.HRESI_IncrementAmount || data.HRESI_IncrementAmount <= 0)) {
                return false;
            }
            return true;
        },
        {
            message: 'Please provide a valid value based on the selected Increment Type',
            path: ['HRESI_IncrementType']
        }
    );

// Salary Updation Schema
export const salaryUpdationSchema = {
    search: z.object({
        HRES_Year: z.string().optional(),
        HRES_Month: z.string().optional(),
        groupTypeIdList: z.array(z.number()).optional(),
        hrmD_IdList: z.array(z.number()).optional(),
        hrmdeS_IdList: z.array(z.number()).optional(),
        HRMED_Id: z.number().optional(),
        earningDeduction: z.enum(['Earning', 'Deduction']).optional(),
        amountType: z.enum(['Amount', 'Percentage']).optional()
    }),
    addOrUpdate: z
        .object({
            HRESU_Id: z.number().optional(),
            MI_Id: z.number(),
            HRME_Id: z.number().min(1, 'Please select an employee'),
            HRESU_OldSalary: z.number().min(0, 'Old salary cannot be negative'),
            HRESU_NewSalary: z.number().min(1, 'New salary must be greater than 0'),
            HRESU_EffectiveDate: z.date({
                required_error: 'Effective date is required'
            }),
            HRESU_Remarks: z.string().optional(),
            HRESU_ActiveFlg: z.boolean().default(true),
            LogInUserId: z.number().optional()
        })
        .refine((data) => data.HRESU_NewSalary !== data.HRESU_OldSalary, {
            message: 'New salary must be different from old salary',
            path: ['HRESU_NewSalary']
        })
};

// Export schemas as objects
export const hrmsTransactionSchemas = {
    employeeLoan: {
        form: employeeLoanFormSchema,
        addOrUpdate: employeeLoanSchema
    },
    salaryAdvance: {
        form: salaryAdvanceFormSchema,
        addOrUpdate: salaryAdvanceSchema
    },
    salaryApproval: {
        search: salaryApprovalSchema
    },
    massUpdation: {
        form: massUpdationFormSchema,
        search: massUpdationSchema.search,
        update: massUpdationSchema.update
    },
    salaryCalculation: {
        search: salaryCalculationSchema.search,
        generate: salaryCalculationSchema.generate
    },
    salaryIncrement: {
        addOrUpdate: salaryIncrementSchema
    },
    salaryUpdation: {
        search: salaryUpdationSchema.search,
        addOrUpdate: salaryUpdationSchema.addOrUpdate
    }
};
