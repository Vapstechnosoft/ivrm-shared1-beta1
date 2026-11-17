import { z } from 'zod';

export const masterChangeClassSchema = {
    add: z.object({
        asmaY_Id: z.number().int().min(1, { message: 'Academic Year is required' }),
        oldClass: z.string().min(1, { message: 'Old Class is required' }),
        section: z.string().min(1, { message: 'Section is required' }),
        newClass: z.string().min(1, { message: 'New Class is required' }),
        studentId: z.string().min(1, { message: 'Student is required' }),
        remarks: z.string().min(1, { message: 'Remarks is required' }),
        feeStructure: z.array(
            z.object({
                id: z.number(),
                className: z.string(),
                feeCategory: z.string()
            })
        )
    })
};

export const masterUpdateRollNumberSchema = z.object({
    asmaY_Id: z.number().int().min(1, { message: 'Academic Year is required' }),
    asmcL_Id: z.number().int().min(1, { message: 'Class is required' }),
    asmS_Id: z.number().int().min(1, { message: 'Section is required' }),
    students: z
        .array(
            z.object({
                asysT_Id: z.number(),
                amsT_Id: z.number(),
                student_name: z.string(),
                new_roll_no: z.number().int().min(1, { message: 'Roll number is required' })
            })
        )
        .min(1, { message: 'At least one student is required' })
});

export const masterDeleteStudentSectionSchema = z.object({
    asmaY_Id: z.number().int().min(1, { message: 'Academic Year is required' }),
    classCategory: z.string().min(1, { message: 'Class is required' }),
    section: z.string().min(1, { message: 'Section is required' }),
    students: z
        .array(
            z.object({
                asysT_Id: z.number(),
                amsT_Id: z.number(),
                student_name: z.string()
            })
        )
        .min(1, { message: 'Please select at least one student' })
        .optional()
        .default([])
});

export const masterNewSectionSchema = z.object({
    leftAcademicYear: z.number().int().min(1, { message: 'Academic Year is required' }),
    leftClassAdmitted: z.string().min(1, { message: 'Class Admitted is required' }),
    rightAcademicYear: z.number().int().min(1, { message: 'Academic Year is required' }),
    rightClass: z.string().min(1, { message: 'Class is required' }),
    rightSection: z.string().min(1, { message: 'Section is required' })
});

export const masterChangeSectionSchema = z.object({
    leftAcademicYear: z.number().min(1, 'Academic year is required'),
    leftClassAdmitted: z.string().min(1, 'Class is required'),
    leftSection: z.string().min(1, 'Section is required'),
    rightAcademicYear: z.number().min(1, 'Academic year is required'),
    rightClass: z.string().min(1, 'Class is required'),
    rightSection: z.string().min(1, 'Section is required')
});

export const masterYearLossSectionSchema = z.object({
    leftAcademicYear: z.number().min(1, 'Academic year is required'),
    leftClassAdmitted: z.string().min(1, 'Class is required'),
    leftSection: z.string().min(1, 'Section is required'),
    rightAcademicYear: z.number().min(1, 'Academic year is required'),
    rightClass: z.string().min(1, 'Class is required'),
    rightSection: z.string().min(1, 'Section is required')
});

export const masterPromotionSectionSchema = z.object({
    leftAcademicYear: z.number().min(1, 'Academic year is required'),
    noOfYears: z.number().min(1, 'No of years is required').max(9, 'Cannot exceed 9 years'),
    leftClassAdmitted: z.string().min(1, 'Class is required'),
    leftSection: z.string().min(1, 'Section is required'),
    rightAcademicYear: z.number().min(1, 'Academic year is required'),
    rightClass: z.string().min(1, 'Class is required'),
    rightSection: z.string().min(1, 'Section is required')
});
