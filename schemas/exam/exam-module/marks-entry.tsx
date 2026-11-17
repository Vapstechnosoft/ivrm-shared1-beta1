// schemas/exam/exam-module/student-marks-publish.ts
import { z } from 'zod';

export const studentMarksPublishSchema = {
    // Search form validation
    search: z
        .object({
            // Radio type (Exam or Promotion)
            radiotype: z.enum(['Exam', 'Promotion'], {
                required_error: 'Please select Exam or Promotion type',
                invalid_type_error: 'Type must be either EXAM or PROMOTION'
            }),

            // Academic Year (always required)
            asmaY_Id: z
                .number({
                    required_error: 'Academic Year is required'
                })
                .min(1, { message: 'Please select Academic Year' }),

            // Class (always required)
            asmcL_Id: z
                .number({
                    required_error: 'Class is required'
                })
                .min(1, { message: 'Please select Class' }),

            // Section (always required)
            asmS_Id: z
                .number({
                    required_error: 'Section is required'
                })
                .min(1, { message: 'Please select Section' }),

            // Exam (required only when radiotype is EXAM)
            emE_Id: z.number().optional(),

            // Fee exclusion checkbox
            feeinstallmentcheckbox: z.boolean().default(false),

            // Fee Term (required when checkbox is checked)
            FMT_Id: z.number().optional(),

            // Fee Groups (array of selected group IDs)
            feeGroupIds: z.array(z.number()).default([]),

            // Communication flags
            SMSFLAG: z.boolean().default(false),
            EMAILFLAG: z.boolean().default(false),
            NOTIFYFLAG: z.boolean().default(false)
        })
        .superRefine((data, ctx) => {
            // Validation 1: Exam Name is required only when radiotype is EXAM
            if (data.radiotype === 'Exam' && (!data.emE_Id || data.emE_Id <= 0)) {
                ctx.addIssue({
                    path: ['emE_Id'],
                    code: z.ZodIssueCode.custom,
                    message: 'Exam Name is required for Exam Wise'
                });
            }

            // Validation 2: If fee installment checkbox is checked, validate fee term and fee groups
            if (data.feeinstallmentcheckbox) {
                // Fee Term is required when checkbox is checked
                if (!data.FMT_Id || data.FMT_Id <= 0) {
                    ctx.addIssue({
                        path: ['FMT_Id'],
                        code: z.ZodIssueCode.custom,
                        message: 'Fee Term is required when excluding fee defaulters'
                    });
                }

                // At least one fee group must be selected when checkbox is checked
                if (!data.feeGroupIds || data.feeGroupIds.length === 0) {
                    ctx.addIssue({
                        path: ['feeGroupIds'],
                        code: z.ZodIssueCode.custom,
                        message: 'At least one Fee Group must be selected'
                    });
                }
            }

            // Validation 3: Marks calculation must be done (this is handled in the component)
            // This validation would be based on API response, not in schema
        }),

    // Update status validation
    update: z.object({
        // Selected students array (must have at least one)
        selectedstudents: z
            .array(
                z.object({
                    AMST_Id: z.number({ required_error: 'Student ID is required' }),
                    ESTMP_Id: z.number().optional(),
                    AMST_FirstName: z.string({ required_error: 'Student name is required' }),
                    ESTMP_PublishToStudentFlg: z.boolean().default(false)
                })
            )
            .min(1, { message: 'Select at least one student' }),

        // Communication flags
        SMSFLAG: z.boolean(),
        EMAILFLAG: z.boolean(),
        NOTIFYFLAG: z.boolean(),

        // Required identifiers
        ASMAY_Id: z.number({ required_error: 'Academic Year ID is required' }),
        ASMCL_Id: z.number({ required_error: 'Class ID is required' }),
        ASMS_Id: z.number({ required_error: 'Section ID is required' }),
        EME_Id: z.number({ required_error: 'Exam ID is required' }),
        radiotype: z.enum(['EXAM', 'PROMOTION']),

        // Optional fields
        EME_ExamName: z.string().optional(),
        ISMS_SubjectName: z.string().optional()
    }),

    // Student details validation (for individual student selection)
    student: z.object({
        amsT_Id: z.number({ required_error: 'Student ID is required' }),
        amsT_FirstName: z.string({ required_error: 'Student name is required' }),
        amsT_AdmNo: z.string({ required_error: 'Admission number is required' }),
        amaY_Rollno: z.number({ required_error: 'Roll number is required' }),
        obtainedmarks: z.number().default(0),
        totalmaxmarks: z.number().default(0),
        percentage: z.number().default(0),
        estmP_PublishToStudentFlg: z.union([
            z.boolean(),
            z.number().refine((val) => val === 0 || val === 1, {
                message: 'Publish flag must be 0 or 1'
            })
        ]),
        estmP_Id: z.number().optional(),
        checkedvalue: z.boolean().default(false)
    })
};

// Type definitions for form fields
export type StudentMarksPublishSearchForm = z.infer<typeof studentMarksPublishSchema.search>;
export type StudentMarksPublishUpdateForm = z.infer<typeof studentMarksPublishSchema.update>;
export type StudentMarksPublishStudent = z.infer<typeof studentMarksPublishSchema.student>;

// Additional validation helper functions
export const studentMarksPublishValidators = {
    // Check if search form is valid for submission
    isSearchValid: (data: StudentMarksPublishSearchForm): { valid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // Check basic required fields
        if (!data.asmaY_Id || data.asmaY_Id <= 0) errors.push('Academic Year is required');
        if (!data.asmcL_Id || data.asmcL_Id <= 0) errors.push('Class is required');
        if (!data.asmS_Id || data.asmS_Id <= 0) errors.push('Section is required');

        // Check exam requirement for EXAM type
        if (data.radiotype === 'Exam' && (!data.emE_Id || data.emE_Id <= 0)) {
            errors.push('Exam Name is required for Exam Wise');
        }

        // Check fee requirements if checkbox is checked
        if (data.feeinstallmentcheckbox) {
            if (!data.FMT_Id || data.FMT_Id <= 0) {
                errors.push('Fee Term is required when excluding fee defaulters');
            }
            if (!data.feeGroupIds || data.feeGroupIds.length === 0) {
                errors.push('At least one Fee Group must be selected');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    },

    // Validate if marks are calculated (API-based validation)
    isMarksCalculated: async (params: {
        ASMS_Id: number;
        ASMCL_Id: number;
        ASMAY_Id: number;
        radiotype: 'EXAM' | 'PROMOTION';
    }): Promise<boolean> => {
        try {
            // This would call an API endpoint
            const response = await fetch('/api/exam/check-marks-calculation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });

            const data = await response.json();

            if (params.radiotype === 'EXAM') {
                return data.exmstdlist && data.exmstdlist.length > 0;
            } else {
                return data.editlist && data.editlist.length > 0;
            }
        } catch (error) {
            console.error('Error checking marks calculation:', error);
            return false;
        }
    },

    // Validate student selection for update
    validateStudentSelection: (students: StudentMarksPublishStudent[]): { valid: boolean; selectedCount: number } => {
        const selectedStudents = students.filter((s) => s.checkedvalue);
        return {
            valid: selectedStudents.length > 0,
            selectedCount: selectedStudents.length
        };
    }
};
