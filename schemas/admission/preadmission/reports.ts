import { deleteIdSchema } from '@/schemas/validationSchemas';
import { z } from 'zod';

export const masterStudentCountReportSchema = {
    addOrUpdate: z.object({
        type: z.number().default(1),
        report_type: z
            .enum(['Registered List', 'Registered Count', 'Payment Report'], {
                message: 'Report type is required'
            })
            .optional(),
        from_date: z.string().optional(),
        to_date: z.string().optional(),
        asmaY_Id: z.number().int({ message: 'Academic Year ID is required' }).optional(),
        asmcL_Id: z.number().int().default(0)
    }),
    delete: z.object({
        asmay_id: deleteIdSchema('asmay_id')
    })
};

export const studentSearchSchema = z.object({
    status: z.enum(['all', 'studying', 'left'], {
        required_error: 'Please select student status'
    }),
    criteria: z
        .array(
            z.object({
                field: z.string().min(1, 'Field is required'),
                operator: z.string().min(1, 'Operator is required'),
                value: z.string().min(1, 'Value is required'),
                condition: z.string().optional()
            })
        )
        .min(1, 'At least one search criteria is required')
        .refine(
            (criteria) => {
                for (let i = 0; i < criteria.length - 1; i++) {
                    if (!criteria[i].condition || criteria[i].condition === '') {
                        return false;
                    }
                }
                return true;
            },
            {
                message: 'All criteria except the last one must have a condition (AND/OR)'
            }
        )
});

export type StudentSearchFormData = z.infer<typeof studentSearchSchema>;

export const admissionReportSchema = z.object({
    academicYear: z.coerce.number().min(1, 'Academic year is required'),
    status: z.number().min(0, 'Status is required'),
    selectedClasses: z.array(z.number()).min(1, 'Please select at least one class'),
    selectedFields: z.array(z.string()).min(1, 'Please select at least one field')
});

export const TotalStrengthSchema = z
    .object({
        reportType: z.enum(['All', 'Individual']),
        status: z.string().min(1, 'Status is required'),
        withTc: z.boolean().optional().default(false),
        withDeactive: z.boolean().optional().default(false),
        academicYear: z.number().min(1, 'Academic year is required'),
        class: z.string().optional(),
        section: z.string().optional()
    })
    .refine(
        (data) => {
            if (data.reportType === 'Individual') {
                return !!data.class && !!data.section;
            }
            return true;
        },
        {
            message: 'Class and Section are required for Individual report',
            path: ['class']
        }
    );
export const studyCertificateReportSchema = z.object({
    selectionMode: z.enum(['all', 'individual']),
    studentStatus: z.enum(['studying', 'left', 'deactive']),
    certificateType: z.enum(['character', 'study']),
    addressType: z.enum(['permanent', 'communication']),
    asmaY_Id: z.number().min(1, 'Academic year required'),
    asmcL_Id: z.number().optional(),
    asmS_Id: z.number().optional(),
    studentId: z.number().optional(),
    qrCode: z.string().optional(),
    from_date: z.string().min(1, 'From date required')
});
export const classwiseStudentDetailsSchema = z.object({
    asmaY_Id: z.number().min(1, 'Academic year is required'),
    classes: z.array(z.number()).min(1, 'Classes is required'),
    class_section: z.array(z.number()).min(1, 'Please select at least one section'),
    selectedFields: z.array(z.string()).min(1, 'Please select at least one column'),
    fmcC_Id: z.number().optional(),
    flag: z.string().optional()
});

export const StudentTcDetailsSchema = z.object({
    ASMAY_Id: z.number().min(1, 'Academic year is required'),
    AllOrInd: z.number().min(1, 'Please select All or Individual'),
    ASMCL_Id: z.number().optional(),
    ASMC_Id: z.number().optional(),
    TempararyArrayheadList: z.array(z.object({
        columnID: z.string(),
        columnName: z.string().optional()
    })).min(1, 'Please select at least one column'),
    PermOrTemp: z.number().optional(),
    AMC_Id: z.number().optional()
});
