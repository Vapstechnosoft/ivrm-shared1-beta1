import { createStringOnlySchema, createStringSchema } from '@/schemas/validationSchemas';
import { z } from 'zod';

const phoneSchema = z.object({
    mopN_PhoneNo: z.string().min(10, 'Phone number must be 10 digits').max(10, 'Phone number must be 10 digits').regex(/^\d+$/, 'Only numbers allowed'),
    moP_Flag: z.string().min(1, 'Select Phone type')
});

const mobileSchema = z.object({
    momN_MobileNo: z.string().min(10, 'Mobile number must be valid').regex(/^\d+$/, 'Only numbers allowed'), // Assuming 10 for now as ccodelength is dynamic in angular
    moM_Flag: z.string().min(1, 'Select Mobile type')
});

const emailSchema = z.object({
    moE_EmailId: z.string().email('Invalid email address'),
    moE_Flag: z.string().min(1, 'Select Email type')
});

export const trustMasterSchema = {
    addOrUpdate: z.object({
        mO_Id: z.number().optional(),
        mO_Name: createStringOnlySchema('Trust Name', 1, 150),
        mO_OrganisationType: z.string().min(1, 'Select Trust Type'),
        mO_Address1: createStringSchema('Address1', 6, 40),
        mO_Address2: createStringSchema('Address2', 6, 40),
        mO_Address3: createStringSchema('Address3', 6, 40),
        mO_Landmark: createStringSchema('Landmark', 3, 40).optional(),
        ivrmmC_Id: z.number({ required_error: 'Select Country' }).min(1, 'Select Country'),
        ivrmmS_Id: z.number({ required_error: 'Select State' }).min(1, 'Select State'),
        ivrmmcT_Name: createStringOnlySchema('City', 1, 40),
        mO_Pincode: z.string().min(6, 'Pincode must be 6 digits').max(6, 'Pincode must be 6 digits').regex(/^\d+$/, 'Only numbers allowed'), // Keeping as string for regex validation, API might expect number
        mO_Website: z.string().optional(),
        mO_FaxNo: z.string().optional(), // Angular had pattern check but not specified
        mT_Domain_name: z.string().min(1, 'Enter Domain Name'),
        mT_Currency: z.string().min(1, 'Select Currency').optional(),

        // Dynamic arrays
        phones: z.array(phoneSchema).optional(), // Optional initially? Angular shows required.
        mobiles: z.array(mobileSchema).optional(),
        emails: z.array(emailSchema).optional(),
        mO_AboutInstitute: z.string().optional(),
        mO_ContactDetails: z.string().optional(),
        mO_Logo: z.string().optional()
    }),
    delete: z.object({
        mO_Id: z.coerce.number().min(1, 'ID is required')
    })
};
