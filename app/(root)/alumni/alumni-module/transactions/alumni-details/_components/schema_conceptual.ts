// ... (keep existing imports)

import { z } from 'zod';
import { qualificationSchema, readmittedSchema } from './schema';

// Existing schema becomes the "Create" schema (strict)
export const alumnusMembershipSchema = z.object({
    // ... (existing strict rules)
});

// New simplified schema for updates
export const alumnusMembershipUpdateSchema = z.object({
    ALMST_Id: z.number().optional(),
    AMST_ID: z.number().optional(),
    // Allow empty or existing values for mandatory fields during update
    ALMST_FirstName: z.string().optional(),
    ALMST_NickName: z.string().optional(),
    ALMST_AdmNo: z.string().optional(),
    ALMST_DOB: z.date().optional(),
    ALMST_MobileNo: z.string().optional(), // Removed regex for updates
    ALMST_FatherName: z.string().optional(),
    ALMST_emailId: z.string().optional(),
    ALMST_BloodGroup: z.string().optional(),
    ALMST_PerCountry: z.string().optional(),
    ALMST_PerState: z.string().optional(),
    ALMST_PerDistrict: z.string().optional(),
    ALMST_ConCity: z.string().optional(),
    ALMST_ConArea: z.string().optional(),
    ALMST_ConPincode: z.string().optional(),

    // Copy other optional fields...
    ALMST_MiddleName: z.string().optional(),
    ALMST_LastName: z.string().optional(),
    ALMST_PhoneNo: z.string().optional(),
    ALMST_Marital_Status: z.string().default('0'),
    ALMST_SpouseName: z.string().optional(),
    ALMST_SpouseContactNo: z.string().optional(),
    ALMST_SpouseEmailId: z.string().optional(),
    ALMST_SpouseQulaification: z.string().optional(),
    ALMST_SpouseProfession: z.string().optional(),
    ALMST_WeddingAnniversaryDate: z.date().optional(),
    ASMAY_Id_Join: z.string().optional(),
    ASMAY_Id_Left: z.string().optional(),
    ASMCL_Id_Join: z.string().optional(),
    ASMCL_Id_Left: z.string().optional(),
    ALMST_MembershipId: z.string().optional(),
    ALMST_AmountPaid: z.union([z.string(), z.number()]).optional(),
    ALMST_MembershipCategory: z.string().optional(),
    ALMST_ConStreet: z.string().optional(),
    ALMST_FullAddess: z.string().optional(),
    ALSPR_CompanyName: z.string().optional(),
    ALSPR_Designation: z.string().optional(),
    ALSPR_WorkingSince: z.string().optional(),
    ALSPR_CompanyAddress: z.string().optional(),
    ALSPR_EmailId: z.string().optional(),
    ALSPR_OtherDetails: z.string().optional(),
    ALSAC_Achievement: z.string().optional(),
    ALSAC_Remarks: z.string().optional(),
    qualification_array: z.array(qualificationSchema).optional(),
    ReadmittedStudentDTO: z.array(readmittedSchema).optional(),
    ALMSTRADM_Id: z.number().optional(),
    Readmitted_student: z.boolean().default(false)
});
