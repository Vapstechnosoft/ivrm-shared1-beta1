import { z } from 'zod';
import { createStringOnlySchema } from '../validationSchemas';

/**
 * HRMS Employee Register Zod Schemas
 * Extracted from inline schemas in employee-register-form.tsx
 * Following the pattern from preadmission module
 */

// Helper functions for validation (exported for use in form component)
export const validateMobileNumber = (mobile: string) => {
    const cleaned = mobile.replace(/\D/g, ''); // Remove non-digits
    return cleaned.length === 10;
};

export const validateAadharNumber = (aadhar: string) => {
    const cleaned = aadhar.replace(/\D/g, ''); // Remove non-digits
    return cleaned.length === 12;
};

export const validatePANNumber = (pan: string) => {
    // PAN format: 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
};

export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePincode = (pincode: string) => {
    const cleaned = pincode.replace(/\D/g, ''); // Remove non-digits
    return cleaned.length >= 5 && cleaned.length <= 10;
};

// Qualification details schema
export const qualificationDetailSchema = z
    .object({
        hrmeQ_Id: z.number().optional(), // ID for updates
        qualification: z.string().min(1, 'Qualification is required').max(50, 'Qualification must not exceed 50 characters'),
        course: z.string().min(1, 'Course is required'),
        college: z.string().min(1, 'College is required').max(100, 'College must not exceed 100 characters'),
        university: z.string().min(1, 'University is required').max(100, 'University must not exceed 100 characters'),
        yearOfPassing: z
            .string()
            .min(1, 'Year of Passing is required')
            .refine((val) => {
                const year = Number.parseInt(val);
                return !Number.isNaN(year) && year >= 1900 && year <= new Date().getFullYear();
            }, 'Year of Passing must be a valid year'),
        qualificationCountry: z.string().min(1, 'Country is required'),
        qualificationState: z.string().min(1, 'State is required'),
        registrationNo: z.string().min(1, 'Registration No is required').max(50, 'Registration No must not exceed 50 characters'),
        result: z.string().min(1, 'Result is required').max(20, 'Result must not exceed 20 characters'),
        cgpaOrPercentage: z.string().min(1, 'CGPA or Percentage type is required'),
        cgpa: z.string().optional(),
        percentage: z.string().optional(),
        areaOfSpecialisation: z.string().min(1, 'Area Of Specialization is required'),
        phdFlag: z.boolean().optional(),
        medicalCouncil: z.string().max(50, 'Medical Council must not exceed 50 characters').optional(),
        thesisTitle: z.string().max(255, 'Thesis Title must not exceed 255 characters').optional(),
        registrationYear: z
            .string()
            .optional()
            .refine((val) => {
                if (!val) return true;
                const year = Number.parseInt(val);
                return !Number.isNaN(year) && year >= 1900 && year <= new Date().getFullYear();
            }, 'Registration Year must be a valid year'),
        guideName: z.string().max(100, 'Guide Name must not exceed 100 characters').optional(),
        qualifiedDate: z.string().optional()
    })
    .superRefine((data, ctx) => {
        // Validate CGPA or Percentage based on selected type
        if (data.cgpaOrPercentage === 'CGPA') {
            if (!data.cgpa) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'CGPA is required',
                    path: ['cgpa']
                });
                return;
            }
            // Check if it's a valid number format (allow 1 decimal place if needed, or just range check)
            // The InputText prevents invalid characters, but we double-check here
            const num = Number.parseFloat(data.cgpa);
            if (Number.isNaN(num) || num < 0 || num > 10) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'CGPA must be between 0-10',
                    path: ['cgpa']
                });
            }
        } else if (data.cgpaOrPercentage === 'Percentage') {
            if (!data.percentage) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Percentage is required',
                    path: ['percentage'] // Dynamic path!
                });
                return;
            }
            const num = Number.parseFloat(data.percentage);
            if (Number.isNaN(num) || num < 0 || num > 100) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Percentage must be between 0-100',
                    path: ['percentage']
                });
            }
        }
    });

// Experience details schema
export const experienceDetailSchema = z
    .object({
        hrmeE_Id: z.number().optional(), // ID for updates
        organisationName: z.string().max(255, 'Organisation Name must not exceed 255 characters').optional(),
        organisationAddress: z.string().max(500, 'Organisation Address must not exceed 500 characters').optional(),
        department: z.string().max(100, 'Department must not exceed 100 characters').optional(),
        designation: z.string().max(100, 'Designation must not exceed 100 characters').optional(),
        joinDate: z.string().optional(),
        exitDate: z.string().optional(),
        noOfYears: z.string().optional(),
        noOfMonths: z.string().optional(),
        annualSalary: z.string().optional(),
        reasonForLeaving: z.string().max(500, 'Reason For Leaving must not exceed 500 characters').optional()
    })
    .refine(
        (data) => {
            if (data.joinDate && data.exitDate) {
                return new Date(data.exitDate) >= new Date(data.joinDate);
            }
            return true;
        },
        {
            message: 'Exit Date must be on or after Join Date',
            path: ['exitDate']
        }
    );

// Document schema
export const documentSchema = z.object({
    documentName: z.string().min(1, 'Name of Document is required').max(255, 'Name of Document must not exceed 255 characters'),
    documentDescription: z.string().min(1, 'Document Description is required').max(400, 'Document Description must not exceed 400 characters'),
    document: z.any(),
    // Optional fields for existing documents (used during updates)
    documentImageName: z.string().optional(),
    fileName: z.string().optional(),
    imageName: z.string().optional()
}).superRefine((data, ctx) => {
    const file = data.document;

    // If there's an existing document (documentImageName, fileName, or imageName), allow it
    if (data.documentImageName || data.fileName || data.imageName) {
        return;
    }

    // Handle null/undefined - only fail if no existing document
    if (!file) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'upload document is mandatory (JPEG, DOC, DOCX, or PDF, max 2MB)',
            path: ['document']
        });
        return;
    }

    // Handle FileList - extract first file
    let actualFile: File | null = null;
    if (file instanceof FileList) {
        actualFile = file[0] || null;
    } else if (file instanceof File) {
        actualFile = file;
    } else if (Array.isArray(file) && file.length > 0 && file[0] instanceof File) {
        // Handle array of files (sometimes React Hook Form returns arrays)
        actualFile = file[0];
    } else if (typeof file === 'string' && file.length > 0) {
        // For edit mode, document might be a string (existing file path/base64)
        return;
    }

    if (!actualFile) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'upload document is mandatory (JPEG, DOC, DOCX, or PDF, max 2MB)',
            path: ['document']
        });
        return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = [
        'image/jpeg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf'
    ];

    if (actualFile.size > maxSize || !allowedTypes.includes(actualFile.type)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'upload document is mandatory (JPEG, DOC, DOCX, or PDF, max 2MB)',
            path: ['document']
        });
    }
});

// Payroll Item Schema (for earnings, deductions, arrears)
export const payrollItemSchema = z.object({
    hreeD_Id: z.number().default(0),
    hrmeD_Id: z.string().min(1, 'Head Required'),
    hreeD_Amount: z.preprocess((val) => Number(val) || 0, z.number().min(0, 'Amount must be positive')),
    hreeD_Percentage: z.string().optional().default('0'),
    hreeD_ActiveFlag: z.boolean().default(true)
});

// Base employee register object schema (without refinements)
const baseEmployeeRegisterSchema = z.object({
    // Employee tab fields
    firstName: createStringOnlySchema('Name of the Employee', 1, 50),
    middleName: z.string().max(50, 'Middle Name must not exceed 50 characters').optional(),
    lastName: z.string().max(50, 'Last Name must not exceed 50 characters').optional(),
    employeeCode: z.string().min(1, 'Employee Code Required').max(20, 'Employee Code must not exceed 20 characters'),
    typeOfEmployment: z.string().min(1, 'Type of Employment Required'),
    employeeGroup: z.string().min(1, 'Employee Group Required'),
    department: z.string().min(1, 'Department Required'),
    designation: z.string().min(1, 'Designation Required'),
    grade: z.string().min(1, 'Grade Required'),
    fatherName: createStringOnlySchema("Father's Name", 1, 50),
    motherName: createStringOnlySchema("Mother's Name", 1, 50),
    dateOfBirth: z.string().min(1, 'Date of Birth Required'),
    dateOfJoining: z.string().min(1, 'Date of Joining Required'),
    dateOfConfirmation: z.string().optional(),
    dateOfRetirement: z.string().optional(),
    gender: z.string().min(1, 'Gender Required'),
    maritalStatus: z.string().min(1, 'Marital Status Required'),
    religion: z.string().min(1, 'Religion Required'),
    casteCategory: z.string().min(1, 'Caste Category Required'),
    caste: z.string().min(1, 'Caste Required'),
    bloodGroup: z.string().optional(),
    salaryType: z.string().min(1, 'Salary Type Required'),
    modeOfPayment: z.string().min(1, 'Mode of Payment Required'),
    employeePhoto: z.string().min(1, 'Employee Photo Required'),
    subjectTaught: z.string().max(50, 'Subject Taught must not exceed 50 characters').optional(),
    epf: z.preprocess((val) => val === true || val === 'on', z.boolean()).optional(),
    ppf: z.preprocess((val) => val === true || val === 'on', z.boolean()).optional(),
    phdResearchGuide: z.preprocess((val) => val === true || val === 'on', z.boolean()).optional(),
    recognitionYear: z.string().max(4, 'Recognition Year must not exceed 4 characters').regex(/^\d*$/, 'Recognition Year must contain only numbers').optional(),
    teachingNonTeaching: z.string().min(1, 'Teaching/Non-Teaching Required'),
    pfApplicable: z.preprocess((val) => val === true || val === 'on', z.boolean()).optional(),
    ptMaxAmount: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const num = Number.parseFloat(val);
            return !Number.isNaN(num) && num >= 0;
        }, 'PT Max Amount must be a positive number'),
    pfMaxAmount: z.preprocess((val) => val === true || val === 'on', z.boolean()).optional(),
    pfFixedAmount: z.preprocess((val) => val === true || val === 'on', z.boolean()).optional(),
    pfAccNo: z.string().max(22, 'PF Acc. No. must not exceed 22 characters').optional(),
    uanNumber: z.string().max(12, 'UAN Number must not exceed 12 characters').optional(),
    pfDate: z.string().optional(),
    esiApplicable: z.preprocess((val) => val === true || val === 'on', z.boolean()).optional(),
    esiAccNo: z.string().max(10, 'ESI Acc. No. must not exceed 10 characters').optional(),
    gratuityAccNo: z.string().max(25, 'Gratuity Acc No. must not exceed 20 characters').optional(),
    esiDate: z.string().optional(),
    nationalSSN: z.string().max(9, 'National SSN must not exceed 9 characters').regex(/^\d*$/, 'National SSN must contain only numbers').optional(),
    aadharNo: z
        .string()
        .min(1, 'Aadhaar No. Required')
        .max(12, 'Aadhar No. must not exceed 12 characters')
        .refine((val) => validateAadharNumber(val), 'Aadhar No. must be a valid 12-digit number'),
    panCardNo: z
        .string()
        .min(1, 'PAN Card No. Required')
        .max(10, 'PAN Card No. must not exceed 10 characters')
        .refine((val) => validatePANNumber(val), 'PAN Card No. must be in valid format (e.g., ABCDE1234F)'),
    mobileDetails: z
        .array(
            z.object({
                mobileNo: z
                    .string()
                    .min(1, 'Mobile No. Required')
                    .max(10, 'Mobile No. must not exceed 10 characters')
                    .refine((val) => validateMobileNumber(val), 'Mobile No. must be a valid 10-digit number'),
                type: z.string().optional()
            })
        )
        .min(1, 'At least one mobile number is required'),
    emailDetails: z
        .array(
            z.object({
                emailId: z
                    .string()
                    .max(100, 'Email must not exceed 100 characters')
                    .refine((val) => {
                        if (!val) return true;
                        return validateEmail(val);
                    }, 'Email must be in valid format')
                    .optional(),
                type: z.string().optional()
            })
        )
        .optional(),
    bankDetails: z
        .array(
            z.object({
                hrmeB_Id: z.number().optional(), // ID for updates
                employerBankName: z.string().min(1, 'Bank Name Required'),
                bankAccountNo: z.string().min(1, 'Account No. Required'),
                accountType: z.string().optional()
            })
        )
        .optional(),
    // Address tab fields
    contactAddress: z.string().min(1, 'Please enter address').max(100, 'Contact Address must not exceed 100 characters'),
    contactArea: z.string().min(1, 'Area Required'),
    contactCountry: z.string().min(1, 'Country Required'),
    contactState: z.string().min(1, 'State Required'),
    contactCity: z.string().min(1, 'City Required'),
    contactPincode: z
        .string()
        .min(1, 'Pincode Required')
        .refine((val) => {
            return validatePincode(val);
        }, 'Pincode must be a valid numerical value (5-10 digits)'),
    permanentAddress: z.string().min(1, 'Please enter address').max(100, 'Permanent Address must not exceed 100 characters'),
    permanentArea: z.string().min(1, 'Area Required'),
    permanentCountry: z.string().min(1, 'Country Required'),
    permanentState: z.string().min(1, 'State Required'),
    permanentCity: z.string().min(1, 'City Required'),
    permanentPincode: z
        .string()
        .min(1, 'Pincode Required')
        .refine((val) => {
            return validatePincode(val);
        }, 'Pincode must be a valid numerical value (5-10 digits)'),
    sameAsCommunicationAddress: z.preprocess((val) => val === true || val === 'on', z.boolean()).optional(),
    // Other tabs
    qualificationDetails: z.array(qualificationDetailSchema).optional(),
    experienceDetails: z.array(experienceDetailSchema).optional(),
    documentList: z.array(documentSchema).min(1, 'Please add at least one document'),
    employeeHeight: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const num = Number.parseFloat(val);
            if (Number.isNaN(num) || num < 0) return false;
            // Validate DECIMAL(5,2) format: max 3 digits before decimal, 2 digits after
            const decimalRegex = /^\d{1,3}(\.\d{1,2})?$/;
            return decimalRegex.test(val.trim());
        }, 'Height must be a valid number (max 999.99)'),
    employeeHeightUnit: z.string().max(10, 'Unit of measure (Height) must not exceed 10 characters').optional(),
    employeeWeight: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const num = Number.parseFloat(val);
            if (Number.isNaN(num) || num < 0) return false;
            // Validate DECIMAL(5,2) format: max 3 digits before decimal, 2 digits after
            const decimalRegex = /^\d{1,3}(\.\d{1,2})?$/;
            return decimalRegex.test(val.trim());
        }, 'Weight must be a valid number (max 999.99)'),
    employeeWeightUnit: z.string().max(10, 'Unit of measure (Weight) must not exceed 10 characters').optional(),
    eyeSightIssue: z.string().max(255, 'Eye Sight Issue must not exceed 255 characters').optional(),
    anyHealthIssue: z.string().max(500, 'Any Health Issue must not exceed 500 characters').optional(),
    identificationMark: z.string().max(255, 'Identification Mark must not exceed 255 characters').optional(),
    biometricCode: z
        .string()
        .max(50, 'Biometric Code must not exceed 50 characters')
        .refine((val) => {
            if (!val) return true; // Allow empty (optional field)
            // Must be alpha-numeric (letters and numbers only)
            return /^[A-Za-z0-9]+$/.test(val);
        }, 'Biometric Code must be an alpha-numeric string')
        .optional(),
    rfCardId: z
        .string()
        .max(50, 'RF card ID must not exceed 50 characters')
        .refine((val) => {
            if (!val) return true; // Allow empty (optional field)
            // Must be alpha-numeric (letters and numbers only)
            return /^[A-Za-z0-9]+$/.test(val);
        }, 'RF card ID must be an alpha-numeric string')
        .optional(),
    punchRelaxation: z.preprocess((val) => val === true || val === 'on', z.boolean()).optional(),
    stopPension: z.preprocess((val) => val === true || val === 'on', z.boolean()).optional(),
    dateOfStopPension: z.string().optional(),
    msTeamsUserName: z.string().max(100, 'MS Teams UserName must not exceed 100 characters').optional(),
    msTeamsPassword: z.string().max(255, 'MS Teams Password must not exceed 255 characters').optional(),
    employeeLeft: z.preprocess((val) => val === true || val === 'on', z.boolean()).optional(),
    lastWorkingDay: z.string().optional(),
    reasonForLeaving: z.string().max(50, 'Reason for leaving must not exceed 50 characters').optional(),
    // Payroll tab fields
    earningList: z.array(payrollItemSchema).optional(),
    deductionList: z.array(payrollItemSchema).optional(),
    arrearList: z.array(payrollItemSchema).optional()
});

// Helper function to apply common refinements to both add and update schemas
const applyCommonRefinements = <T extends z.ZodObject<any, any, any>>(schema: T) => {
    return schema
        .refine(
            (data) => {
                // Validate Date of Confirmation must be after Date of Joining
                if (data.dateOfConfirmation && data.dateOfJoining) {
                    return new Date(data.dateOfConfirmation) >= new Date(data.dateOfJoining);
                }
                return true;
            },
            {
                message: 'Date of Confirmation must be after Date of Joining',
                path: ['dateOfConfirmation']
            }
        )
        .refine(
            (data) => {
                // Validate Date of Stop Pension is required when Stop Pension is checked
                if (data.stopPension && !data.dateOfStopPension) {
                    return false;
                }
                return true;
            },
            {
                message: 'Date of Stop Pension is required when Stop Pension is checked',
                path: ['dateOfStopPension']
            }
        )
        .refine(
            (data) => {
                // Validate Last Working Day and Reason For Leaving are required when Employee Left is checked
                if (data.employeeLeft) {
                    if (!data.lastWorkingDay || !data.reasonForLeaving) {
                        return false;
                    }
                }
                return true;
            },
            {
                message: 'Last Working Day and Reason For Leaving are required when Employee Left is checked',
                path: ['lastWorkingDay']
            }
        )
        .refine(
            (data) => {
                // Validate Bank Details if Mode of Payment is Bank
                if (data.modeOfPayment === 'Bank') {
                    if (!data.bankDetails || data.bankDetails.length === 0) {
                        return false;
                    }
                }
                return true;
            },
            {
                message: 'Bank Details are required when Mode of Payment is Bank',
                path: ['bankDetails']
            }
        );
};

// Main employee register form schema (for adding new employee)
export const employeeRegisterFormSchema = applyCommonRefinements(baseEmployeeRegisterSchema);

// Update schema - merge base schema with optional employeePhoto for updates
const baseUpdateSchema = baseEmployeeRegisterSchema.merge(
    z.object({
        employeePhoto: z.string().optional() // Make photo optional for updates
    })
);

export const employeeRegisterUpdateFormSchema = applyCommonRefinements(baseUpdateSchema);

// Export schema object matching the pattern from preadmission
export const employeeRegisterSchemas = {
    add: employeeRegisterFormSchema,
    update: employeeRegisterUpdateFormSchema
};
