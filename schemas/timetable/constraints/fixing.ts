import { z } from 'zod';

// Common sub-schema for Class-Section logic

// 2. Day Staff Sub-list: Class, Section, Subject, NOP
const fixingDayStaffListSchema = z.object({
    ASMCL_Id: z.number().min(1, 'Class is required'),
    ASMS_Id: z.number().min(1, 'Section is required'),
    ISMS_Id: z.number().min(1, 'Subject is required'),
    NOP: z.number().min(1, 'No of Periods is required'),
    // UI Display
    clsDisplay: z.string().optional(),
    sectDisplay: z.string().optional(),
    subDisplay: z.string().optional()
});

// 3. Day Subject Sub-list: Class, Section, Staff, NOP
const fixingDaySubjectListSchema = z.object({
    ASMCL_Id: z.number().min(1, 'Class is required'),
    ASMS_Id: z.number().min(1, 'Section is required'),
    HRME_Id: z.number().min(1, 'Staff is required'),
    NOP: z.number().min(1, 'No of Periods is required'),
    // UI Display
    clsDisplay: z.string().optional(),
    sectDisplay: z.string().optional(),
    staffDisplay: z.string().optional()
});

// 4. Period Staff Sub-list: Class, Section, Subject, NOD
const fixingPeriodStaffListSchema = z.object({
    ASMCL_Id: z.number().min(1, 'Class is required'),
    ASMS_Id: z.number().min(1, 'Section is required'),
    ISMS_Id: z.number().min(1, 'Subject is required'),
    NOD: z.number().min(1, 'No of Days is required'),
    // UI Display
    clsDisplay: z.string().optional(),
    sectDisplay: z.string().optional(),
    subDisplay: z.string().optional()
});

// 5. Period Subject Sub-list: Class, Section, Staff, NOD
const fixingPeriodSubjectListSchema = z.object({
    ASMCL_Id: z.number().min(1, 'Class is required'),
    ASMS_Id: z.number().min(1, 'Section is required'),
    HRME_Id: z.number().min(1, 'Staff is required'),
    NOD: z.number().min(1, 'No of Days is required'),
    // UI Display
    clsDisplay: z.string().optional(),
    sectDisplay: z.string().optional(),
    staffDisplay: z.string().optional()
});

// 1. Day Period Schema
export const fixingDayPeriodSchema = z.object({
    TTFDP_Id: z.number().optional(),
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    TTMC_Id: z.number().min(1, 'Category is required'),
    ASMCL_Id: z.number().min(1, 'Class is required'),
    ASMS_Id: z.number().min(1, 'Section is required'),
    HRME_Id: z.number().min(1, 'Staff is required'),
    ISMS_Id: z.number().min(1, 'Subject is required'),
    TTMD_Id: z.number().min(1, 'Day is required'),
    TTMP_Id: z.number().min(1, 'Period is required')
});
export type FixingDayPeriodSchema = z.infer<typeof fixingDayPeriodSchema>;

// 2. Day Staff Schema
export const fixingDayStaffSchema = z.object({
    TTFDS_Id: z.number().optional(),
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    TTMD_Id: z.number().min(1, 'Day is required'),
    HRME_Id: z.number().min(1, 'Staff is required'),
    TTFDS_SUbSelcFlag: z.boolean().default(false), // true if Class-Section Wise
    TempararyArrayList: z.array(fixingDayStaffListSchema).optional()
});
export type FixingDayStaffSchema = z.infer<typeof fixingDayStaffSchema>;

// 3. Day Subject Schema
export const fixingDaySubjectSchema = z.object({
    TTFDSU_Id: z.number().optional(),
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    TTMD_Id: z.number().min(1, 'Day is required'),
    ISMS_Id: z.number().min(1, 'Subject is required'),
    TTFDSU_SUbSelcFlag: z.boolean().default(false),
    TempararyArrayList: z.array(fixingDaySubjectListSchema).optional()
});
export type FixingDaySubjectSchema = z.infer<typeof fixingDaySubjectSchema>;

// 4. Period Staff Schema
export const fixingPeriodStaffSchema = z.object({
    TTFPS_Id: z.number().optional(),
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    TTMP_Id: z.number().min(1, 'Period is required'),
    HRME_Id: z.number().min(1, 'Staff is required'),
    TTFPS_SUbSelcFlag: z.boolean().default(false),
    TempararyArrayList: z.array(fixingPeriodStaffListSchema).optional()
});
export type FixingPeriodStaffSchema = z.infer<typeof fixingPeriodStaffSchema>;

// 5. Period Subject Schema
export const fixingPeriodSubjectSchema = z.object({
    TTFPSU_Id: z.number().optional(),
    ASMAY_Id: z.number().min(1, 'Academic Year is required'),
    TTMP_Id: z.number().min(1, 'Period is required'),
    ISMS_Id: z.number().min(1, 'Subject is required'),
    TTFPSU_SUbSelcFlag: z.boolean().default(false),
    TempararyArrayList: z.array(fixingPeriodSubjectListSchema).optional()
});
export type FixingPeriodSubjectSchema = z.infer<typeof fixingPeriodSubjectSchema>;
