import { createStringOnlySchema, createStringSchema } from '@/schemas/validationSchemas';
import { z } from 'zod';

export const institutionMasterSchema = {
    addOrUpdate: z.object({
        mI_Id: z.number().optional(),

        // Basic Info
        mO_Id: z.coerce.number().min(1, 'Select Trust'),
        mO_Name: z.string().optional(),
        mI_OrganisationType: z.string().min(1, 'Select Institution Type'),
        mI_Address1: createStringSchema('Address1', 6, 40),
        mI_Address3: createStringSchema('Address3', 6, 40),
        ivrmmS_Id: z.number({ required_error: 'Select State' }).min(1, 'Select State'),
        mI_Pincode: z.string().min(6, 'Pincode must be 6 digits').max(6, 'Pincode must be 6 digits').regex(/^\d+$/, 'Only numbers allowed'),

        // Arrays (Strictly matching user snippet: no flags, just number/email)
        mobiles: z.array(z.object({
            mimN_MobileNo: z.string().length(10, '10 digits').regex(/^\d+$/, 'Numbers only')
        })),
        emails: z.array(z.object({
            miE_EmailId: z.string().email('Invalid Email')
        })),
        phones: z.array(z.object({
            mipN_PhoneNo: z.string().length(10, '10 digits').regex(/^\d+$/, 'Numbers only')
        })),
        emails1: z.array(z.object({
            mI_SMSAlertToemailids: z.string().email('Invalid Email')
        })).optional(),

        // Configuration
        mI_FontColor: z.string().optional(),
        mI_FormColor: z.string().optional(),
        mI_WeekStartDay: z.string().optional(),
        mI_DateFormat: z.string().optional(),
        mI_FranchiseFlag: z.boolean().optional(),
        mI_BackgroundImage: z.any().optional(), // File

        // Registration / Details
        mI_AboutInstitute: z.string().max(1100, 'Max 1100 chars').optional(),
        mI_TAN: z.string().max(10, 'Max 10 chars').optional(),
        mI_PAN: z.string().max(10, 'Max 10 chars').optional(),
        mI_80GRegNo: z.string().optional(),
        mI_CreditType: z.string().min(1, 'Credential Type Required'),

        // Right Column / Additional Fields
        mI_Name: createStringOnlySchema('Institution Name', 1, 60),
        mI_Affiliation: z.string().min(1, 'Select Affiliation'),
        mI_Address2: createStringSchema('Address2', 6, 40),
        ivrmmC_Id: z.number({ required_error: 'Select Country' }).min(1, 'Select Country'),
        ivrmmcT_Name: createStringOnlySchema('City', 3, 50),
        mI_FaxNo: z.string().optional(),

        mI_FontSize: z.string().optional(),
        mI_SchoolCollegeFlag: z.string().optional(),
        mI_NAAC_InstitutionTypeFlg: z.string().min(1, 'Select NAAC Type'),
        mI_NAAC_SubInstitutionTypeFlg: z.string().min(1, 'Select NAAC Sub-Type'),

        mI_DateSeparator: z.string().optional(),
        mI_GradingSystem: z.string().optional(),
        mI_Subdomain: createStringOnlySchema('Sub Domain Name', 1, 50),
        mI_Logo: z.any().optional(), // File
        mI_ContactDetails: z.string().max(200, 'Max 200 chars').optional(),
        mI_SMSCountAlert: z.string().regex(/^\d*$/, 'Numbers only').optional(),
        mI_EntityId: z.string().min(1, 'Entity Id Required'),

        // VC
        vcDetails: z.array(z.object({
            mvidcoN_Id: z.number(),
            checkedvalue: z.boolean().optional(),
            mvidconinT_HostedURL: z.string().optional()
        })).optional(),
        mI_VCStudentFlag: z.string().optional(),
        mI_VCOthersFlag: z.string().optional(),

        // MS Teams
        mI_MSTeamsClientId: z.string().optional().or(z.literal('')),
        mI_MSTeamsTenentId: z.string().optional(),
        mI_MSTemasClinetSecretCode: z.string().optional(),
        mI_MSTeamsAppAccessTockenURL: z.string().optional(),
        mI_MSTeamsAdminUsername: z.string().optional(),
        mI_MSTeamsUserAceessTockenURL: z.string().optional(),
        mI_MSTeamsMeetingScheduleURL: z.string().optional(),
        mI_MSTeamsGrantType: z.string().optional(),
        mI_MSTeamsScope: z.string().optional(),
        mI_MSTeamsAdminPassword: z.string().optional()
    })
};
