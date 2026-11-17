import { z } from 'zod';

// Helper: Reusable string schema
const createStringSchema = (fieldName: string, min: number, max: number) =>
    z
        .string()
        .min(min, { message: `${fieldName} must be at least ${min} character(s)` })
        .max(max, { message: `${fieldName} must not exceed ${max} characters` })
        .nonempty({ message: `${fieldName} is required` });

// Helper: Date schema with ISO string validation
const dateSchema = (fieldName: string, allowNull = false) => {
    const baseSchema = z.string().refine(
        (value) => {
            if (!value) return allowNull;
            // ISO date string validation
            return !Number.isNaN(Date.parse(value));
        },
        {
            message: `${fieldName} must be a valid date`
        }
    );
    return allowNull ? baseSchema.nullable() : baseSchema;
};

export const PreAdmissionAcademicYearSchema = {
    addOrUpdate: z.object({
        // Optional internal id for updates
        asmaY_Id: z.number().int().optional(),

        // Form inputs for year parts (the UI collects From/To and we compute asmaY_Year)
        academicFromYear: z
            .string()
            .nonempty({ message: 'Academic From Year is required' })
            .regex(/^\d{4}$/, { message: 'From Year must be YYYY' }),
        academicToYear: z
            .string()
            .nonempty({ message: 'Academic To Year is required' })
            .regex(/^\d{4}$/, { message: 'To Year must be YYYY' }),

        // Academic Year Fields (computed on submit)
        asmaY_Year: z.string().regex(/^\d{4}-\d{4}$/, {
            message: 'Academic Year must be in format YYYY-YYYY'
        }),

        // Order field - must be a number for the API
        asmaY_Order: z
            .union([z.string(), z.number()])
            .transform((val) => (typeof val === 'string' ? Number.parseInt(val, 10) : val))
            .refine((val) => !Number.isNaN(val), {
                message: 'Order must be a valid number'
            }),

        // Academic Year Code - required with length validation
        asmaY_AcademicYearCode: createStringSchema('Academic Year Code', 1, 20),

        // Date fields with ISO string validation
        asmaY_From_Date: dateSchema('From Date', true),
        asmaY_To_Date: dateSchema('To Date', true),
        asmaY_PreAdm_F_Date: dateSchema('Pre-Admission From Date', true),
        asmaY_PreAdm_T_Date: dateSchema('Pre-Admission To Date', true),
        asmaY_Cut_Of_Date: dateSchema('Cut-off Date', true),

        // Flag fields with defaults and transformations
        asmaY_ActiveFlag: z
            .union([z.number(), z.boolean()])
            .transform((val) => (typeof val === 'boolean' ? (val ? 1 : 0) : val))
            .default(0),

        asmaY_TransportSDate: dateSchema('Transport Start Date', true).optional(),
        asmaY_TransportEDate: dateSchema('Transport End Date', true).optional(),
        asmaY_ReferenceDate: dateSchema('Reference Date', true).optional(),
        asmaY_AdvanceFeeDate: dateSchema('Advance Fee Date', true).optional(),
        asmaY_RegularFeeFDate: dateSchema('Regular Fee From Date', true).optional(),
        asmaY_RegularFeeTDate: dateSchema('Regular Fee To Date', true).optional(),
        asmaY_ArrearFeeDate: dateSchema('Arrear Fee Date', true).optional(),

        // ----- BOOLEAN/FLAG FIELDS – OPTIONAL WITH DEFAULT -----
        asmaY_ReggularFlg: z
            .union([z.boolean(), z.number()])
            .transform((val) => Boolean(val))
            .default(false)
            .optional(),

        asmaY_NewFlg: z
            .union([z.boolean(), z.number()])
            .transform((val) => Boolean(val))
            .default(false)
            .optional(),

        asmaY_NewAdmissionFlg: z
            .union([z.boolean(), z.number()])
            .transform((val) => Boolean(val))
            .default(false)
            .optional(),

        asmaY_Pre_ActiveFlag: z
            .union([z.boolean(), z.number()])
            .transform((val) => Boolean(val))
            .default(false)
            .optional()
    }),

    delete: z.object({
        asmaY_Id: z.coerce
            .number({ invalid_type_error: 'asmaY_Id must be a number' })
            .int('asmaY_Id must be an integer')
            .positive('asmaY_Id must be a positive number')
    })
};
export const transactionnumberingSchema = z.object({
    prefix_type: z.enum(['academic', 'particulars']),
    suffix_type: z.enum(['academic', 'particulars']),
    prefix_particulars: z.string().optional(),
    suffix_particulars: z.string().optional(),
    prefix_numeric_width: z.coerce.number().min(1).max(10),
    suffix_starting_from: z.coerce.number().min(1),
    prefix_with_zero: z.enum(['yes', 'no']),
    restart_frequency: z.enum(['never', 'yearly'])
});
