import { z } from 'zod';
import { createExamCustomStringSchema, createStringSchema, deleteIdSchema } from '../../validationSchemas';

export const loginSchema = z.object({
    email: z.string({ message: 'Email is required' }),
    password: createStringSchema('Password', 6, 50)
});

export const masterSubjectSchema = {
    addOrUpdate: z.object({
        ismS_Id: z.number().int({ message: 'Subject Id is required' }).optional(),
        mI_Id: z.number().int().optional(),
        ismS_IVRSSubjectName: createExamCustomStringSchema('IVRS Subject Name', 1, 100),
        ismS_SubjectCode: createStringSchema('Subject Code', 1, 50),
        ismS_SubjectNameNew: createExamCustomStringSchema('Subject Type / New Name', 1, 50),
        ismS_SubjectName: createExamCustomStringSchema('Subject Name', 1, 50),
        ismS_PreadmFlag: z.number().int({ message: 'Pre-Admission Flag is required' }),
        ismS_AttendanceFlag: z.boolean({ required_error: 'Attendance Flag is required' }),
        ismS_BatchAppl: z.number().int({ message: 'Batch Applicable Flag is required' }),
        ismS_ExamFlag: z.number().int({ message: 'Exam Flag is required' }),
        ismS_LanguageFlg: z.number().int({ message: 'Language Flag is required' }),
        ismS_AtExtraFeeFlg: z.number().int({ message: 'Extra Fee Flag is required' }),
        ismS_ActiveFlag: z.number().int({ message: 'Active Flag is required' }),
        ismS_TTFlag: z.number().int({ message: 'Time Table Flag is required' })
    }),

    delete: z.object({
        ismS_Id: deleteIdSchema('ismS_Id')
    })
};

export const masterExamSchema = {
    addOrUpdate: z.object({
        emE_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        emE_ExamName: createExamCustomStringSchema('Exam Name', 1, 100),
        emE_ExamCode: z.string().min(1, { message: 'Exam Code is required' }),
        emE_ExamDescription: createExamCustomStringSchema('Exam Description', 1, 100),
        emE_IVRSExamName: z.string().min(1, { message: 'IVRS Exam Name is required' }),
        emE_FinalExamFlag: z.boolean({
            required_error: 'Final Exam flag is required'
        }),
        emE_SujectwiseMarksPublishFlg: z.boolean({
            required_error: 'Subject wise marks publish flag is required'
        })
    }),
    delete: z.object({
        emE_Id: deleteIdSchema('emE_Id')
    })
};

export const masterExamPaperSchema = {
    addOrUpdate: z.object({
        empatY_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        user_id: z.number().optional(),
        empatY_PaperTypeName: createExamCustomStringSchema('Paper Type Name', 1, 100),
        empatY_Color: createExamCustomStringSchema('Color', 1, 50),
        empatY_PaperTypeDescription: createExamCustomStringSchema('Paper Type Description', 1, 200)
    }),

    delete: z.object({
        empatY_Id: deleteIdSchema('empatY_Id')
    })
};

export const masterSubExamSchema = {
    addOrUpdate: z.object({
        emsE_Id: z.number().int({ message: 'Sub Exam Id is required' }).optional(),
        mI_Id: z.number().int().optional(),
        emsE_SubExamName: createExamCustomStringSchema('Sub Exam Name', 1, 100),
        emsE_SubExamCode: createExamCustomStringSchema('Sub Exam Code', 1, 50)
    }),

    delete: z.object({
        emsE_Id: deleteIdSchema('emsE_Id')
    })
};
export const masterSubSubjectSchema = {
    addOrUpdate: z.object({
        emsS_Id: z.number().int().optional(), // optional for new entries
        mI_Id: z.number().int().optional(),
        emsS_SubSubjectName: createExamCustomStringSchema('Sub Subject Name', 1, 100),
        emsS_SubSubjectCode: createExamCustomStringSchema('Sub Subject Code', 1, 50),
        emsS_Order: z.number().int().optional(), // backend can handle default
        emsS_ActiveFlag: z.boolean().optional() // not edited, will pass existing value
    }),

    // Delete Sub Subject
    delete: z.object({
        emsS_Id: deleteIdSchema('emsS_Id')
    })
};

export const gradeDetailsSchema = z
    .object({
        emgD_Id: z.number().default(0),
        emgR_Id: z.number().default(0),
        emgD_Name: createExamCustomStringSchema('Grade Name', 1, 100),

        emgD_From: z
            .preprocess(
                (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
                z.union([
                    z.number().min(0, { message: 'From must be at least 0' }).max(100, { message: 'From cannot exceed 100' }),
                    z.null()
                ])
            )
            .default(null),

        emgD_To: z
            .preprocess(
                (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
                z.union([z.number().min(0, { message: 'To must be at least 0' }).max(100, { message: 'To cannot exceed 100' }), z.null()])
            )
            .default(null),

        emgD_GradePoints: z
            .preprocess(
                (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
                z.union([
                    z.number().min(0, { message: 'Grade points must be at least 0' }).max(10, { message: 'Grade points cannot exceed 10' }),
                    z.null()
                ])
            )
            .default(null),

        emgD_Remarks: z.string().optional(),
        emgD_ActiveFlag: z.boolean().default(true)
    })

    // 🔥 YOUR ORIGINAL LOGIC — untouched as requested.
    .superRefine((data, ctx) => {
        const from = data.emgD_From;
        const to = data.emgD_To;

        if (from !== null && to !== null) {
            if (from > to) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "'From' value cannot be greater than 'To' value",
                    path: ['emgD_From']
                });
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "'To' value cannot be less than 'From' value",
                    path: ['emgD_To']
                });
            }
        }
    });

// Master Grade Schema
export const masterGradeSchema = {
    addOrUpdate: z.object({
        emgR_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        emgR_GradeName: createExamCustomStringSchema('Grade Name', 1, 100),
        emgR_MarksPerFlag: z.enum(['m', 'p'], { required_error: 'Marks/Percentage flag is required' }),
        emgR_ActiveFlag: z.boolean().default(true),
        grade_list: z.array(gradeDetailsSchema).min(1, { message: 'At least one grade detail is required' })
    }),

    delete: z.object({
        emgR_Id: z.number({ required_error: 'Grade Id is required' })
    })
};

// Individual subject schema based on IMasterSubjectGroupDetails
export const subjectGroupDetailSchema = z.object({
    ismS_Id: z.number().optional(),
    ismS_SubjectName: z.string().max(100, { message: 'Subject Name cannot exceed 100 characters' }).optional(), // ✅ now optional
    ismS_SubjectCode: z.string().max(20, { message: 'Subject Code cannot exceed 20 characters' }).optional(), // ✅ now optional
    selected: z.boolean().optional()
});

export const masterSubjectGroupSchema = {
    addOrUpdate: z
        .object({
            emG_Id: z.number().optional(),
            mI_Id: z.number().optional(),

            emG_GroupName: createExamCustomStringSchema('Subject Group Name', 1, 100),

            emG_TotSubjects: z.number({ required_error: 'Total Subjects is required' }).min(1, 'Total Subjects must be at least 1'),

            emG_MaxAplSubjects: z
                .number({ required_error: 'Max Applicable Subjects is required' })
                .min(1, 'Max Applicable Subjects must be at least 1'),

            emG_MinAplSubjects: z
                .number({ required_error: 'Min Applicable Subjects is required' })
                .min(1, 'Min Applicable Subjects must be at least 1'),

            emG_BestOff: z.number({ required_error: 'Best Off Subjects is required' }).min(0, 'Best Off Subjects must be 0 or greater'),

            subject_list: z.array(subjectGroupDetailSchema).optional()
        })

        .superRefine((data, ctx) => {
            const { emG_TotSubjects, emG_MaxAplSubjects, emG_MinAplSubjects, emG_BestOff } = data;

            if (emG_MaxAplSubjects > emG_TotSubjects) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Max Applicable Subjects must be <= Total Subjects (${emG_TotSubjects})`,
                    path: ['emG_MaxAplSubjects']
                });
            }

            if (emG_MinAplSubjects > emG_MaxAplSubjects) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Min Applicable Subjects must be <= Max Applicable Subjects (${emG_MaxAplSubjects})`,
                    path: ['emG_MinAplSubjects']
                });
            }

            if (emG_BestOff > emG_MaxAplSubjects) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Best Off cannot exceed Max Applicable Subjects (${emG_MaxAplSubjects})`,
                    path: ['emG_BestOff']
                });
            }

            if (emG_BestOff < emG_MinAplSubjects) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Best Off must be >= Min Applicable Subjects (${emG_MinAplSubjects})`,
                    path: ['emG_BestOff']
                });
            }
        }),

    delete: z.object({
        emG_Id: z.number({ required_error: 'Exam Group Id is required' })
    })
};

export const masterCategorySchema = {
    addOrUpdate: z.object({
        emcA_Id: z.number().optional(), // For update case
        mI_Id: z.number().optional(), // Optional, defaults can be set in form if needed

        emcA_CategoryName: createExamCustomStringSchema('Category Name', 1, 100),

        emcA_CCECheckingFlg: z.boolean({
            required_error: 'CCE Checking Flag is required'
        }),

        emcA_ActiveFlag: z
            .boolean({
                required_error: 'Active Flag is required'
            })
            .optional()
    }),

    delete: z.object({
        emcA_Id: z.number({ required_error: 'Category Id is required' })
    })
};

export const categoryClassMappingSchema = {
    addOrUpdate: z.object({
        emcA_Id: z.number().min(1, { message: 'Category is required' }),
        mI_Id: z.number().optional(),
        ecaC_Id: z.number().optional().default(0),
        asmaY_Id: z.number().min(1, { message: 'Academic Year is required' }),
        asmcL_Id: z.number().optional().default(0),

        section_list: z
            .array(
                z.object({
                    asmS_Id: z.number().min(1, { message: 'Section is required' })
                })
            )
            .optional()
    })
};
export const coScholasticActivitySchema = {
    addOrUpdate: z.object({
        ecacT_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        ecacT_SkillName: createExamCustomStringSchema('Co-Scholastic Activity Name', 1, 100),
        ecacT_SkillCode: createExamCustomStringSchema('Co-Scholastic Activity Code', 1, 100)
    }),
    delete: z.object({
        ecacT_Id: deleteIdSchema('ecacT_Id')
    })
};
export const coScholasticAreaSchema = {
    addOrUpdate: z.object({
        ecactA_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        ecactA_SkillArea: createExamCustomStringSchema('Co-Scholastic Area Name', 1, 100),
        ecactA_SkillOrder: z.coerce.number().min(1, { message: 'Co-Scholastic Area Order is required' })
    }),
    delete: z.object({
        ecactA_Id: deleteIdSchema('ecactA_Id')
    })
};

export const masterLifeSkillSchema = {
    addOrUpdate: z.object({
        ecS_Id: z.number().int({ message: 'Life Skill ID is required' }).optional(),
        mI_Id: z.number().int().optional(),
        ecS_SkillName: createExamCustomStringSchema('Life Skill Name', 1, 100),
        ecS_SkillCode: createExamCustomStringSchema('Life Skill Code', 1, 50),
        ecS_ActiveFlag: z.boolean({ required_error: 'Active Flag is required' }).default(true)
    }),

    delete: z.object({
        ecS_Id: deleteIdSchema('ecS_Id')
    })
};

export const lifeSkillAreaSchema = {
    addOrUpdate: z.object({
        ecS_Id: z.number().default(0),
        mI_Id: z.number().optional(),
        ecS_SkillName: createExamCustomStringSchema('Life Skill Area Name', 1, 100),
        ecS_SkillCode: createExamCustomStringSchema('Life Skill Area Code', 1, 50),

        subexamDTO: z
            .array(
                z.object({
                    ecsA_Id: z.number().default(0),
                    ecsA_SkillOrder: z
                        .number({ invalid_type_error: 'Skill Order must be a number' })
                        .min(1, { message: 'Skill Order is required' }),
                    ecsA_SkillArea: createExamCustomStringSchema('Life Skill Area Name', 1, 100)
                })
            )
            .min(1, { message: 'At least one skill area is required' }),

        mappingDTO: z.array(
            z.object({
                ecsaM_Id: z.number().default(0),
                asmaY_Id: z.number().default(0),
                mI_Id: z.number().optional(),
                ecS_Id: z.number().default(0),
                ecsA_Id: z.number().default(0),
                ecsaM_IndicatorDescription: z.string().optional().default(''),
                emgR_Id: z.number().default(0),
                ecsaM_ActiveFlag: z.boolean().default(true)
            })
        )
    }),
    delete: z.object({
        ecsA_Id: deleteIdSchema('ecsA_Id')
    })
};

export const lifeSkillAreaMappingSchema = {
    addOrUpdate: z.object({
        ecS_Id: z.number().default(0),
        mI_Id: z.number().optional(),
        ecS_SkillName: createExamCustomStringSchema('Skill Name', 1, 100),
        ecS_SkillCode: createStringSchema('Skill Code', 1, 50),

        subexamDTO: z
            .array(
                z.object({
                    ecsA_Id: z.number().default(0),
                    ecsA_SkillOrder: z
                        .number({
                            required_error: 'Skill Area Order is required',
                            invalid_type_error: 'Skill Area Order must be a number'
                        })
                        .int()
                        .min(1, { message: 'Skill Area Order must be at least 1' }),
                    ecsA_SkillArea: createExamCustomStringSchema('Skill Area Name', 1, 100)
                })
            )
            .min(1, { message: 'At least one Skill Area entry is required' }),

        mappingDTO: z
            .array(
                z.object({
                    ecsaM_Id: z.number().default(0),
                    asmaY_Id: z.number({ required_error: 'Academic Year is required' }).int({ message: 'Academic Year must be integer' }),
                    mI_Id: z.number().optional(),
                    ecS_Id: z.number({ required_error: 'Life Skill ID is required' }).int(),
                    ecsA_Id: z.number({ required_error: 'Skill Area ID is required' }).int(),
                    ecsaM_IndicatorDescription: createExamCustomStringSchema('Indicator Description', 1, 300),
                    emgR_Id: z.number({ required_error: 'Grade ID is required' }).int(),
                    ecsaM_ActiveFlag: z.boolean().default(true)
                })
            )
            .min(1, { message: 'At least one mapping record is required' })
    }),

    delete: z.object({
        ecsaM_Id: deleteIdSchema('ecsaM_Id')
    })
};
