import { z } from 'zod';
import {
    createAllAllowedOptional,
    createAllAllowedRequired,
    createAlphaNumericWithCommaTrailingSpaceOptional,
    createAlphanumericSchema,
    createAlphanumericSchemaPanCard,
    createEmailSchema,
    createNumberOnlyStringSchema,
    createOptionalAlphaNumericAllowBothSchema,
    createOptionalAlphaNumericSchema,
    createOptionalNumberOnlyPrecentageSchema,
    createOptionalNumberOnlyStringSchema,
    createOptionalStringSchema,
    createOptionalStringWithLettersSchema,
    createStringOnlyOptionalSchema,
    createStringOnlyOptionalallowComma,
    createStringOnlySchema,
    deleteIdSchema
} from '../validationSchemas';

// Other Information schema (nested object for admission form)
const OtherInformationSchema = z.object({
    religion: createOptionalStringWithLettersSchema('Religion', 2, 50).optional(),
    motherTongue: createOptionalStringWithLettersSchema('Mother Tongue', 2, 50).optional(),
    nationality: createOptionalStringWithLettersSchema('Nationality', 2, 50).optional(),
    socialCategory: z.enum(['General', 'OBC', 'SC', 'ST', 'Other']).or(z.literal('')).optional(),
    isMinority: z.boolean().optional(),
    identificationMark: createOptionalStringSchema('Identification Mark', 0, 100).optional(),
    additionalInfo: createOptionalStringSchema('Additional Info', 0, 500).optional()
});

// Health & Medical Details schema (nested object for admission form)
const HealthMedicalDetailsSchema = z
    .object({
        bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).or(z.literal('')).optional(),
        heightCm: createOptionalNumberOnlyStringSchema('Height (cm)', 1, 3).optional(),
        weightKg: createOptionalNumberOnlyStringSchema('Weight (kg)', 1, 3).optional(),
        isAllergic: z.boolean().optional(),
        allergies: createOptionalStringSchema('Allergies', 0, 255).optional(),
        chronicIllness: createOptionalStringSchema('Chronic Illness', 0, 255).optional(),
        immunization: createOptionalStringSchema('Immunization', 0, 255).optional(),
        disability: z.enum(['None', 'Visual', 'Hearing', 'Physical', 'Mental', 'Other']).or(z.literal('')).optional(),
        disabilityDetails: createOptionalStringSchema('Disability Details', 0, 500).optional()
    })
    .refine(
        (data) => {
            if (data.isAllergic) {
                return !!data.allergies && data.allergies !== '';
            }
            return true;
        },
        {
            message: 'Allergies must be provided when "isAllergic" is true',
            path: ['allergies']
        }
    );

export const studentAdmissionFormSchema = {
    // Reuse the same schema for add
    add: z
        .object({
            // Student Details
            amsT_FirstName: createStringOnlySchema('First Name', 1, 100),
            amsT_MiddleName: createStringOnlySchema('Middle Name', 1, 100),
            amsT_LastName: createStringOnlySchema('Last Name', 1, 100),
            amsT_RegistrationNo: createAllAllowedRequired('Registration Number', 1, 50),
            asmcL_Id: z.number().int({ message: 'Class is required' }),
            amsT_AdmissionNo: createAllAllowedRequired('Admission No', 1, 50),
            caste_Id: z.coerce.number().int({ message: 'Caste is required' }),
            pasR_Student_Pic_Path: createOptionalStringSchema('Student Photo Path', 1, 500).optional(),
            pasR_Section_Id: z.number().int({ message: 'Section is required' }),
            amsT_DOB_Words: createStringOnlyOptionalSchema('Date Of Birth In Words', 1, 1000).optional(),
            pasR_Age: z.number().int({ message: 'Age is required' }),
            imC_Id: createStringOnlySchema('Caste', 1, 100),
            amsT_SubCasteIMC_Id: createStringOnlyOptionalSchema('Sub Caste', 1, 100).optional(),

            amsT_BirthCertNO: createOptionalAlphaNumericSchema('Birth Certificate Number', 1, 50),
            amsT_CasteCertiNo: createOptionalAlphaNumericSchema('Caste Certificate Number', 1, 50),
            amsT_BiometricId: createOptionalAlphaNumericSchema('Biometric Id', 1, 50),
            amsT_RFCardNo: createOptionalAlphaNumericSchema('RF Card Number', 1, 50),
            amsT_BloodGroup: createOptionalStringSchema('Blood Group', 1, 50),
            studentCategoryId: z.number().int({ message: 'Student Category is required' }),
            amsT_DOB: z.date({ message: 'Date Of Birth is required' }),

            //ecs flag
            amsT_ECSFlag: z.number().int({ message: 'ECS Flag is required' }),

            asecS_AccountNo: createNumberOnlyStringSchema('Bank Account Number', 1, 50).optional(),
            asecS_BankName: createStringOnlySchema('Bank Name', 1, 100).optional(),
            asecS_AccountHolderName: createStringOnlySchema('Account Holder Name', 1, 100).optional(),
            asecS_AccountType: createStringOnlySchema('Account Type', 1, 50).optional(),
            asecS_MICRNo: createNumberOnlyStringSchema('MICR Code', 1, 20).optional(),

            //normal bank details
            amsT_BankAccountNo: createOptionalNumberOnlyStringSchema('Bank Account Number', 1, 50).optional(),
            amsT_BankName: createStringOnlySchema('Bank Name', 1, 100).optional(),
            amsT_BankIFSCCode: createAlphanumericSchema('IFSC Code', 1, 20).optional(),
            amsT_BankBranch: createStringOnlySchema('Branch Name', 1, 100).optional(),

            asecS_Branch: createStringOnlySchema('Branch Name', 1, 100).optional(),
            amsT_MediumOfInstruction: createStringOnlyOptionalSchema('Medium Of Instruction', 1, 50).optional(),

            // EMIS flag

            isEmisBpl: z.number().int(),
            amsT_BPLCardNo: createOptionalAlphaNumericSchema('EMIS Card No', 1, 50).optional(),

            amsT_Tpin: createOptionalAlphaNumericSchema('Student TPIN', 1, 50),
            amsT_GPSTrackingId: createAllAllowedOptional('GPS Tracing Id', 1, 50),
            amsT_MOInstruction: createStringOnlyOptionalSchema('Medium Of Instruction', 1, 50),

            // NATIONALITY - STRING
            amsT_FatherNationality: z.number().int().optional(),

            amsT_MobileNo: z.string().refine((val) => !val.startsWith('0'), {
                message: 'Mobile number cannot start with 0'
            }),

            amsT_BirthPlace: createStringOnlyOptionalSchema('Student Birth Place', 1, 100),
            asmS_Id: z.preprocess(
                (val) => (val === undefined || val === null || val === '' ? 0 : Number(val)),
                z.number().int().min(1, { message: 'Section is required' })
            ),
            religion_Id: z.preprocess(
                (val) => (val === undefined || val === null || val === '' ? 0 : Number(val)),
                z.number().int().min(1, { message: 'Religion is required' })
            ),
            amsT_StudentCategory_Id: z.preprocess(
                (val) => (val === undefined || val === null || val === '' ? 0 : Number(val)),
                z.number().int().min(1, { message: 'Caste Category is required' })
            ),

            amsT_ReligionId: z.preprocess(
                (val) => (val === undefined || val === null || val === '' ? 0 : Number(val)),
                z.number().int().min(1, { message: 'Religion is required' })
            ),
            amsT_Date: z.date({ message: 'Date Of Admission is required' }),
            amsT_Sex: z.string().min(1, { message: 'Gender is required' }),
            amsT_StudentCountry: z.string().min(1, { message: 'Country is required' }),
            amsT_StudentState: z.coerce.number().int().optional(),

            pasR_DOB: z.date({ message: 'Date Of Birth is required' }).refine(() => true),

            feeConcessionType: z.coerce.number().int().min(1, { message: 'Fee Concession Type is required' }),
            // Student email (required)
            amsT_emailId: createEmailSchema('Student Email', 1, 50),
            // Support multiple student emails (array). Each item may be empty or a valid email.
            adm_M_Student_EmailIdDTO: z
                .array(
                    z.object({
                        amsT_emailId: z.union([createEmailSchema('Student Email', 1, 50), z.literal('')])
                    })
                )
                .optional(),
            // Support multiple student mobile numbers stored by the UI
            mobileNos: z
                .array(
                    z.object({
                        amsT_MobileNo: z.string().optional(),
                        amstsmS_CountryCode: z.string().optional()
                    })
                )
                .optional(),
            amsT_MotherTongue: createStringOnlyOptionalSchema('Student Mother Tongue', 1, 100),

            // Other Details
            amsT_AadharNo: z
                .string()
                .refine((val) => val === '' || val.length === 12, {
                    message: 'Aadhar No must be exactly 12 digits'
                })
                .optional(),
            amsT_LanguageSpoken: createStringOnlyOptionalallowComma('Student Language Speaking At Home', 1, 100),

            reference_ids: z.array(z.string()).optional(),

            // Other Information (nested object)
            otherInformation: OtherInformationSchema.optional(),

            // Health & Medical Details (nested object)
            healthMedicalDetails: HealthMedicalDetailsSchema.optional(),

            // Residential Address
            amsT_ConStreet: createStringOnlySchema('Street', 1, 100),
            amsT_ConArea: createStringOnlySchema('Area', 1, 100),
            amsT_ConCountry: z.string().min(1, { message: 'Country is required' }),
            amsT_ConState: z.coerce.number().int().min(1, { message: 'State is required' }),
            amsT_ConDistrict: z.coerce.number().int().optional(),
            amsT_ConCity: createStringOnlySchema('City', 1, 100),
            amsT_ConPincode: z
                .union([z.string(), z.number()])
                .refine((val) => val !== undefined && val !== null && val !== '', { message: 'Pincode is required' })
                .transform((val) => String(val)),

            // Permanent Address
            amsT_PerStreet: createStringOnlyOptionalSchema('Street', 1, 100),
            amsT_PerArea: createStringOnlyOptionalSchema('Area', 1, 100),
            amsT_PerCountry: z.string().optional(),
            amsT_PerState: z.coerce.number().int().optional(),
            amsT_PerDistrict: z.coerce.number().int().optional(),
            amsT_PerCity: createStringOnlyOptionalSchema('City', 1, 100),
            amsT_PerPincode: z
                .union([z.string(), z.number()])
                .optional()
                .transform((val) => val ? String(val) : ''),

            //step=3

            // Father Details
            fatherAliveFlag: z.boolean(),
            fatherName: createStringOnlySchema('Father Name', 1, 100).optional(),
            fatherSurname: createStringOnlyOptionalSchema('Father Surname', 1, 100),
            fatherAadharNo: z
                .string()
                .optional()
                // Allow undefined or empty string (user cleared the field) OR a 12-digit Aadhar
                .refine((val) => val === undefined || val === '' || /^[0-9]{12}$/.test(val), {
                    message: 'Aadhar No must be exactly 12 digits'
                }),

            FatherEducation: createStringOnlyOptionalSchema('Father Education', 1, 100),
            // pasR_FatherOccupation: createOptionalStringSchema('Father Occupation', 1, 100),
            fatherPAN: createAlphanumericSchemaPanCard('Father PAN Number', true),
            fatherDesignation: createStringOnlyOptionalSchema('Father Designation', 1, 100),
            fatherMobileNumbers: z
                .string()
                .refine((val) => !val.startsWith('0'), {
                    message: 'Mobile number cannot start with 0'
                })
                .optional(),
            fatherMaritalStatus: z.string().optional(),

            fatherEmailIds: createEmailSchema('Student Email', 1, 50).optional(),
            fatherHomePhone: createOptionalNumberOnlyStringSchema('Father Home Phone No', 1, 15),

            fatherNationality: z.string().optional(),

            fatherPresentAddress: z.object({
                address: createOptionalStringSchema('Father Address', 1, 200),

                state: z.number().int().optional(),

                city: createOptionalAlphaNumericSchema('City', 1, 100),

                pincode: z
                    .union([z.string(), z.number()])
                    .optional()
                    .transform((val) => (val === undefined || val === null || val === '' ? undefined : String(val))),

                po: createOptionalStringSchema('PO', 1, 100),

                country: z.string().optional(),

                ps: createOptionalStringSchema('PS', 1, 100).optional()
            }),

            fatherPermanentAddress: z.object({
                address: createOptionalStringSchema('Permanent Address', 1, 200),

                state: z.number().int().optional(),

                city: createOptionalAlphaNumericSchema('Permanent City', 1, 100),

                pincode: z
                    .union([z.string(), z.number()])
                    .optional()
                    .transform((val) => (val === undefined || val === null || val === '' ? undefined : String(val))),

                po: createOptionalStringSchema('Permanent PO', 1, 100),

                ps: createOptionalStringSchema('Permanent PS', 1, 100),

                country: z.string().optional()
            }),
            fatherOfficeAddress: createOptionalStringSchema('Father Office Address', 1, 100),

            fatherCasteCertificateNo: createOptionalAlphaNumericSchema('Father Caste Certificate No', 1, 100),
            fatherOccupation: createStringOnlyOptionalSchema('Father Occupation', 1, 100),
            amsT_FatherPassingYear: z.preprocess(
                (val) => (val === undefined || val === null || val === '' ? undefined : Number(val)),
                z.number().int({ message: 'Father Passing Year must be a valid year' }).optional()
            ),
            fatherAnnualIncome: z.number().optional(),
            fatherReligionId: z.number().int().optional(),
            fatherCasteId: z.number().int().optional(),
            fatherSubCaste: createStringOnlyOptionalSchema('Father Sub Caste', 1, 100).optional(),
            fatherOfficePhone: z.string().min(1, 'Father Office Phone No').max(15).optional(),

            // New camelCase mother fields (aliases / API-friendly keys)
            motherAliveFlag: z.boolean().optional(),
            MotherAliveFlag: z.boolean().optional(),
            motherName: createStringOnlySchema('Mother Name', 1, 100).optional(),
            motherSurname: createStringOnlyOptionalSchema('Mother Surname', 1, 100),
            motherAadharNo: z
                .string()
                .optional()
                .refine((val) => val === undefined || val === '' || /^[0-9]{12}$/.test(val), {
                    message: 'Aadhar No must be exactly 12 digits'
                }),
            motherMaritalStatus: z.string().optional(),

            motherMobileNumbers: z
                .string()
                .refine((val) => !val.startsWith('0'), {
                    message: 'Mobile number cannot start with 0'
                })
                .optional(),
            motherEmailIds: createEmailSchema('Mother Email', 1, 50).optional(),
            motherHomePhone: createOptionalNumberOnlyStringSchema('Mother Home Phone', 1, 15).optional(),
            motherNationality: z.string().optional(),

            motherQualification: createStringOnlyOptionalSchema('Mother Qualification', 1, 100).optional(),
            motherPassingYear: z.preprocess(
                (val) => (val === undefined || val === null || val === '' ? undefined : Number(val)),
                z.number().int({ message: 'Mother Passing Year must be a valid year' }).optional()
            ),
            motherPresentAddress: z
                .object({
                    address: createOptionalStringSchema('Address', 1, 200),
                    country: z.string().optional(),
                    city: createOptionalAlphaNumericSchema('City', 1, 100),
                    state: z.number().int().optional(),
                    po: createOptionalStringSchema('PO', 1, 100),
                    pincode: z
                        .union([z.string(), z.number()])
                        .optional()
                        .transform((val) => (val === undefined || val === null || val === '' ? undefined : String(val))),
                    ps: createOptionalStringSchema('PS', 1, 100)
                })
                .optional(),
            motherPermanentAddress: z
                .object({
                    address: createOptionalStringSchema('Address', 1, 200),
                    country: z.string().optional(),
                    city: createOptionalAlphaNumericSchema('City', 1, 100),
                    state: z.number().int().optional(),
                    po: createOptionalStringSchema('PO', 1, 100),
                    pincode: z
                        .union([z.string(), z.number()])
                        .optional()
                        .transform((val) => (val === undefined || val === null || val === '' ? undefined : String(val))),
                    ps: createOptionalStringSchema('PS', 1, 100)
                })
                .optional(),
            motherOfficeAddress: createOptionalStringSchema('Mother Office Address', 1, 200).optional(),

            motherOfficePhone: z
                .string()
                .refine((val) => !val.startsWith('0'), {
                    message: 'Mobile number cannot start with 0'
                })
                .optional(),
            motherOccupation: createStringOnlyOptionalSchema('Mother Occupation', 1, 100).optional(),
            motherDesignation: createStringOnlyOptionalSchema('Mother Designation', 1, 100).optional(),
            motherReligionId: z.number().int().optional(),
            motherCasteId: z.number().int().optional(),
            motherSubCaste: createStringOnlyOptionalSchema('Mother Sub Caste', 1, 100).optional(),
            motherAnnualIncome: z.number().optional(),
            amsT_MotherPermanentState: z.number().int().optional(),
            motherCasteCertificateNo: createOptionalAlphaNumericSchema('Mother Caste Certificate No', 1, 100).optional(),
            motherPAN: createAlphanumericSchemaPanCard('Mother PAN Number', true).optional(),
            motherSelfEmployedFlg: z.boolean().optional(),

            //Step=4

            activities: z.array(z.string()).optional(),
            sourceDetails: z.array(z.string()).optional(),
            achievements: createOptionalStringSchema('Achievements', 1, 250),
            // Siblings Details (array, like add schema)
            siblings: z
                .array(
                    z.object({
                        name: createOptionalAlphaNumericSchema('Sibling Name', 1, 150),
                        classId: z.number().min(0, 'Select a class').optional(),
                        relation: createOptionalAlphaNumericSchema('Relation', 1, 100)
                    })
                )
                .optional(),

            // Guardians Details (array)
            guardian: z
                .array(
                    z.object({
                        guardianName: createOptionalAlphaNumericSchema('Guardian Name', 1, 150),

                        guardianPhone: z
                            .string()
                            .optional()
                            .nullable()
                            .refine((v) => !v || (v.length >= 7 && v.length <= 20), 'Invalid phone number')
                            .refine((v) => !v || /^[0-9+\- ]+$/.test(v), 'Invalid phone format'),

                        guardianEmail: createEmailSchema('Guardian Email', 1, 150, true),
                        guardianAddress: createOptionalStringWithLettersSchema('Guardian Address', 1, 200)
                    })
                )
                .optional(),

            // Previous School Details (array, like siblingsDetails)
            previousSchools: z
                .array(
                    z.object({
                        schoolName: createOptionalAlphaNumericSchema('Previous School Name', 1, 150),

                        schoolTypeId: z.number({ required_error: 'School Type is required' }).min(1, 'School Type is required').optional(),
                        classId: z.number({ required_error: 'Class is required' }).min(1, 'Class is required').optional(),
                        percentage: createOptionalNumberOnlyPrecentageSchema('Percentage', 1, 10),
                        grade: createOptionalNumberOnlyStringSchema('Grade', 1, 10),
                        passedYear: z.number({ required_error: 'Passed Year is required' }).min(1900, 'Invalid year').optional(),
                        countryId: z.number({ required_error: 'Country is required' }).min(1, 'Country is required').optional(),
                        stateId: z.number({ required_error: 'State is required' }).min(1, 'State is required').optional(),
                        address: createOptionalStringWithLettersSchema('School Address', 1, 200),
                        leftReason: createStringOnlyOptionalSchema('Reason for Leaving', 1, 150),
                        medium: createStringOnlyOptionalSchema('Previous School Medium', 1, 100),
                        tcNumber: createOptionalAlphaNumericAllowBothSchema('TC Number', 1, 50),
                        tcDate: z.preprocess(
                            (val) =>
                                val && (typeof val === 'string' || typeof val === 'number' || val instanceof Date) ? new Date(val) : null,
                            z.date().nullable().optional()
                        )
                    })
                )
                .optional(),
            // Place of Birth Details

            amsT_PlaceOfBirthCountry: z.number().min(1, 'Select a country').optional(),
            amsT_PlaceOfBirthState: z.number().min(1, 'Select a state').optional(),
            amsT_Distirct: createStringOnlyOptionalSchema('District', 1, 100).optional(),
            amsT_Taluk: createStringOnlyOptionalSchema('Taluk', 1, 100).optional(),
            amsT_Town: createStringOnlyOptionalSchema('Town', 1, 100).optional(),
            amsT_Village: createStringOnlyOptionalSchema('Village', 1, 100).optional(),

            // Siblings count fields validated as numeric-only strings (optional)
            amsT_NoOfSiblings: createOptionalNumberOnlyStringSchema('No of Siblings', 1, 2),
            amsT_NoOfSiblingsSchool: createOptionalNumberOnlyStringSchema('No of Siblings in School', 1, 2),
            amsT_NoOfDependencies: createOptionalNumberOnlyStringSchema('No of Siblings in Other School', 1, 2),

            amsT_Noofbrothers: createOptionalNumberOnlyStringSchema('No of Brothers', 1, 2),
            amsT_NoOfElderBrothers: createOptionalNumberOnlyStringSchema('No of Elder Brothers', 1, 2),
            amsT_NoOfYoungerBrothers: createOptionalNumberOnlyStringSchema('No of Younger Brothers', 1, 2),

            amsT_Noofsisters: createOptionalNumberOnlyStringSchema('No of Sisters', 1, 2),
            amsT_NoOfElderSisters: createOptionalNumberOnlyStringSchema('No of Elder Sisters', 1, 2),
            amsT_NoOfYoungerSisters: createOptionalNumberOnlyStringSchema('No of Younger Sisters', 1, 2),

            //Other Details
            pasA_AdmittingReason: createOptionalStringSchema('Admitting Reason', 1, 250),
            pasA_WillingToContributeRemarks: createOptionalStringSchema('Willing to Contribute Remarks', 1, 250),
            pasA_WillingToContributeFlg: z.number().int({ message: 'Willing to Contribute Flag' }),

            //health
            amsT_Studentillness: createStringOnlyOptionalSchema('Student Illness', 1, 100).optional(),
            amsT_MedicalComplaints: createStringOnlyOptionalSchema('Medical Complaints', 1, 255).optional(),
            amsT_AdmissionReason: createStringOnlyOptionalSchema('Admission Reason', 1, 255).optional(),
            amsT_OtherResidential_Addr: createOptionalStringSchema('Other Residential Address', 1, 255).optional(),
            amsT_SchoolDISECode: createOptionalStringSchema('School DISE Code', 1, 50).optional(),
            amsT_FirstLanguage: createStringOnlyOptionalSchema('First Language', 1, 100).optional(),
            amsT_SecondLanguage: createStringOnlyOptionalSchema('Second Language', 1, 100).optional(),
            amsT_Thirdlanguage: createStringOnlyOptionalSchema('Third Language', 1, 100).optional(),
            amsT_Illnessdetails: createOptionalStringSchema('Illness Details', 1, 500).optional(),
            amsT_OtherInformations: createOptionalStringSchema('Other Informations', 1, 500).optional(),
            amsT_ExtraActivity: createStringOnlyOptionalSchema('Extra Activity', 1, 100).optional(),
            amsT_Stayingwith: createStringOnlyOptionalSchema('Staying With', 1, 100).optional(),
            amsT_OtherPermanentAddr: createOptionalStringSchema('Other Permanent Address', 1, 255).optional(),
            amsT_Domicile: createStringOnlyOptionalSchema('Domicile', 1, 100).optional(),

            amsT_TransferrableJobFlg: z.boolean().optional(),
            fatherSelfEmployedFlg: z.boolean().optional(),
            amsT_Tcflag: z.boolean().optional(),
            amsT_VaccinatedFlg: z.boolean().optional(),
            // Final flags for hostel and transport requirement
            hostelRequired: z.boolean().optional().default(false),
            transportRequired: z.boolean().optional().default(false)

            // Final
        })
        .refine(
            (data) => {
                if (data.isEmisBpl === 1) {
                    const val = data.amsT_BPLCardNo;
                    return typeof val === 'string' && val.trim() !== '';
                }
                return true;
            },
            {
                message: 'EMIS / BPL / STS No. is required when EMIS is selected',
                path: ['amsT_EMIS_BPL_STS_No']
            }
        )
        .refine(
            (data) => {
                if (data.fatherAliveFlag) {
                    return data.fatherName && data.fatherName.trim() !== '';
                }
                return true;
            },
            {
                message: 'Father Name is required when father is alive',
                path: ['fatherName']
            }
        )

        .refine(
            (data) => {
                if (data.fatherAliveFlag) {
                    return (
                        data.fatherMaritalStatus !== null &&
                        data.fatherMaritalStatus !== undefined &&
                        String(data.fatherMaritalStatus).trim() !== ''
                    );
                }
                return true;
            },
            {
                message: 'Father Marital Status is required when father is alive',
                path: ['fatherMaritalStatus']
            }
        )

        .refine(
            (data) => {
                if (data.fatherAliveFlag) {
                    return (
                        data.fatherNationality !== null &&
                        data.fatherNationality !== undefined &&
                        String(data.fatherNationality).trim() !== ''
                    );
                }
                return true;
            },
            {
                message: 'Father Country is required when father is alive',
                path: ['fatherNationality']
            }
        )

        .refine(
            (data) => {
                if (data.fatherAliveFlag) {
                    return (
                        data.fatherReligionId !== null && data.fatherReligionId !== undefined && String(data.fatherReligionId).trim() !== ''
                    );
                }
                return true;
            },
            {
                message: 'Father Religion is required when father is alive',
                path: ['fatherReligionId']
            }
        )

        .refine(
            (data) => {
                if (data.fatherAliveFlag) {
                    return data.fatherCasteId !== null && data.fatherCasteId !== undefined && String(data.fatherCasteId).trim() !== '';
                }
                return true;
            },
            {
                message: 'Father Caste is required when father is alive',
                path: ['fatherCasteId']
            }
        )

        .refine(
            (data) => {
                if (data.fatherAliveFlag) {
                    return data.fatherSubCaste && String(data.fatherSubCaste).trim() !== '';
                }
                return true;
            },
            {
                message: 'Father Sub Caste is required when father is alive',
                path: ['fatherSubCaste']
            }
        )

        .refine(
            (data) => {
                const alive = Boolean(data.motherAliveFlag || data.MotherAliveFlag);
                if (alive) {
                    return data.motherName && data.motherName.trim() !== '';
                }
                return true;
            },
            {
                message: 'Mother Name is required when mother is alive',
                path: ['motherName']
            }
        )
        .refine(
            (data) => {
                const alive = Boolean(data.motherAliveFlag || data.MotherAliveFlag);
                if (alive) {
                    return data.motherNationality !== null && data.motherNationality !== undefined && String(data.motherNationality) !== '';
                }
                return true;
            },
            {
                message: 'Mother Country is required when mother is alive',
                path: ['motherNationality']
            }
        )
        .refine(
            (data) => {
                const alive = Boolean(data.motherAliveFlag || data.MotherAliveFlag);
                if (alive) {
                    return (
                        data.motherMaritalStatus !== null &&
                        data.motherMaritalStatus !== undefined &&
                        String(data.motherMaritalStatus).trim() !== ''
                    );
                }
                return true;
            },
            {
                message: 'Mother Marital Status is required when mother is alive',
                path: ['motherMaritalStatus']
            }
        )
        .refine(
            (data) => {
                const alive = Boolean(data.motherAliveFlag || data.MotherAliveFlag);
                if (alive) {
                    return (
                        data.motherReligionId !== null && data.motherReligionId !== undefined && String(data.motherReligionId).trim() !== ''
                    );
                }
                return true;
            },
            {
                message: 'Mother Religion is required when mother is alive',
                path: ['motherReligionId']
            }
        )

        .refine(
            (data) => {
                const alive = Boolean(data.motherAliveFlag || data.MotherAliveFlag);
                if (alive) {
                    return data.motherCasteId !== null && data.motherCasteId !== undefined && String(data.motherCasteId).trim() !== '';
                }
                return true;
            },
            {
                message: 'Mother Caste is required when mother is alive',
                path: ['motherCasteId']
            }
        )

        .refine(
            (data) => {
                const alive = Boolean(data.motherAliveFlag || data.MotherAliveFlag);
                if (alive) {
                    return data.motherSubCaste && String(data.motherSubCaste).trim() !== '';
                }
                return true;
            },
            {
                message: 'Mother Sub Caste is required when mother is alive',
                path: ['motherSubCaste']
            }
        ),

    delete: z.object({
        pasr_id: deleteIdSchema('pasr_id')
    })
};
