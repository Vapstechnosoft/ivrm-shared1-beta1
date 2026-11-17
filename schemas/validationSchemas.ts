import { z } from 'zod';

/**
 * Creates a schema with min and max length validations.
 *
 * @param {string} field - The name of the field (for error messages).
 * @param {number} min - The minimum allowed length (inclusive).
 * @param {number} max - The maximum allowed length (inclusive).
 * @returns {z.ZodString} The string schema.
 */

export function createStringSchema(field: string, min: number, max: number) {
    return z
        .string({ message: `${field} Required` })
        .min(min, { message: min === 1 ? `${field} Required` : `Minimum ${min} characters required for ${field}` })
        .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
        .refine((value) => value.trim() === value, {
            message: `${field} cannot have leading or trailing spaces`
        });
}

export function createOptionalStringSchema(field: string, min: number, max: number) {
    return z
        .string()
        .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
        .refine((value) => value.length === 0 || value.trim() === value, {
            message: `${field} cannot have leading or trailing spaces`
        })
        .refine((value) => value.length === 0 || value.length >= min, {
            message: `${field} must have at least ${min} characters or be empty.`,
            path: [field]
        })
        .optional()
        .or(z.literal('')); // Allow empty string explicitly
}

export function createOptionalNumberOnlyStringSchema(field: string, min: number, max: number) {
    return z
        .string()
        .regex(/^\d*$/, { message: `${field} must contain only numbers` }) // allows only digits
        .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
        .refine((value) => value.length === 0 || value.length >= min, {
            message: `${field} must have at least ${min} digits or be empty.`
        })
        .refine((value) => value.length === 0 || value.trim() === value, {
            message: `${field} cannot have leading or trailing spaces`
        })
        .optional()
        .or(z.literal('')); // empty allowed
}

//for percentaige allow with dot

export function createOptionalNumberOnlyPrecentageSchema(field: string, min: number, max: number) {
    return z
        .union([
            z.literal(''),
            z
                .string()
                // ❗ Allow only digits and dot
                .regex(/^[0-9.]+$/, {
                    message: `${field} must contain only numbers and dots`
                })
                // ❗ Min / Max length (before refine)
                .min(min, { message: `${field} must have at least ${min} characters` })
                .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
                // ❗ No leading or trailing spaces
                .refine((value) => value.trim() === value, {
                    message: `${field} cannot have leading or trailing spaces`
                })
        ])
        .optional();
}

export function createNumberOnlyStringSchema(field: string, min: number, max: number) {
    return z
        .string()
        .regex(/^\d+$/, { message: `${field} must contain only numbers` }) // at least 1 digit
        .min(min, { message: min === 1 ? `${field} Required` : `${field} must have at least ${min} digits` })
        .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
        .refine((value) => value.trim() === value, {
            message: `${field} cannot have leading or trailing spaces`
        });
}

export function createNumberOnlyStringSchemaRequired(field: string, min: number, max: number) {
    return z
        .string({
            required_error: `${field} Required`,
            invalid_type_error: `${field} must be a string`
        })
        .trim() // removes leading/trailing spaces before validation
        .regex(/^\d+$/, { message: `${field} must contain only numbers` }) // only digits, not optional
        .min(min, { message: min === 1 ? `${field} Required` : `${field} must have at least ${min} digits` })
        .max(max, { message: `Maximum ${max} characters allowed for ${field}` });
}

export function createGenderSchema(field: string, allowedValues?: number[]) {
    const base = z
        .union([z.number(), z.string().regex(/^\d+$/, { message: `${field} must be a numeric id` })])
        .transform((val) => (typeof val === 'string' ? Number(val) : val))
        .refine((v) => Number.isInteger(v as number), { message: `${field} must be an integer` });

    if (Array.isArray(allowedValues) && allowedValues.length > 0) {
        return base.refine((v) => allowedValues.includes(v as number), {
            message: `${field} must be one of: ${allowedValues.join(', ')}`
        });
    }

    return base;
}

export function createOptionalStringSchemaNotAllowNumbersOnly(field: string, min: number, max: number) {
    return (
        z
            .string()
            .max(max, { message: `Maximum ${max} characters allowed for ${field}` })

            // ❗ Prevent leading/trailing spaces
            .refine((value) => value.length === 0 || value.trim() === value, {
                message: `${field} cannot have leading or trailing spaces`
            })

            // ❗   numbers-only input
            .refine((value) => value.length === 0 || !/^\d+$/.test(value), {
                message: `${field} cannot contain only numbers`
            })

            // ❗ Must meet minimum length if not empty
            .refine((value) => value.length === 0 || value.length >= min, {
                message: `${field} must have at least ${min} characters or be empty.`
            })

            .optional()
            .or(z.literal(''))
    ); // Allow empty string explicitly
}

export function createStringSchemaNotAllowNumbersOnly(field: string, min: number, max: number) {
    return (
        z
            .string({ message: `${field} Required` })

            // 👉 Apply min & max early (before refine), so no TS error
            .min(min, { message: min === 1 ? `${field} Required` : `${field} must have at least ${min} characters` })
            .max(max, { message: `Maximum ${max} characters allowed for ${field}` })

            // ❗ No special characters allowed — only letters, numbers, spaces
            .regex(/^[A-Za-z0-9\s]+$/, {
                message: `${field} cannot contain special characters`
            })

            // ❗ Prevent leading/trailing spaces
            .refine((value) => value.trim() === value, {
                message: `${field} cannot have leading or trailing spaces`
            })

            // ❗ Prevent only-numbers
            .refine((value) => !/^\d+$/.test(value), {
                message: `${field} cannot contain only numbers`
            })
    );
}

export function createStringOnlySchema(field: string, min: number, max: number) {
    return z
        .string({ message: `${field} Required` })
        .min(min, { message: min === 1 ? `${field} Required` : `Minimum ${min} characters required for ${field}` })
        .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
        .regex(/^[A-Za-z\s]+$/, { message: `${field} must contain only letters` })
        .refine((value) => value.trim() === value, {
            message: `${field} cannot have leading or trailing spaces`
        });
}

export function createStringOnlyOptionalSchema(field: string, min: number, max: number) {
    return z
        .union([
            z.literal(''),
            z
                .string()
                .regex(/^(?!\s).*(?<!\s)$/, {
                    message: `${field} must not start or end with spaces`
                })
                .min(min, { message: `Minimum ${min} characters required for ${field}` })
                .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
        ])
        .optional();
}

//allow comma

export function createStringOnlyOptionalallowComma(field: string, min: number, max: number) {
    return z
        .string()
        .trim()
        .regex(/^[A-Za-z,\s]+$/, {
            message: `${field} must contain only letters, commas, and spaces`
        })
        .min(min, { message: `Minimum ${min} characters required for ${field}` })
        .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
        .optional()
        .or(z.literal(''));
}

export function createAlphaNumericWithCommaTrailingSpaceOptional(field: string, min: number, max: number) {
    return z
        .union([
            z.literal(''),
            z
                .string()
                .regex(/^(?!\s)[A-Za-z0-9,\s]+(?<!\s)$/, {
                    message: `${field} must not start or end with spaces and may contain only letters, numbers`
                })
                .min(min, { message: `Minimum ${min} characters required for ${field}` })
                .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
        ])
        .optional();
}

export function createAlphanumericSchema(field: string, min: number, max: number, optional = false) {
    const baseSchema = z
        .string({ message: `${field} Required` })
        .min(min, { message: min === 1 ? `${field} Required` : `Minimum ${min} characters required for ${field}` })
        .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
        .regex(/^[a-zA-Z0-9]*$/, {
            message: `${field} must contain only alphanumeric characters`
        })
        .refine((value) => value.trim() === value, {
            message: `${field} cannot have leading or trailing spaces`
        });

    if (optional) {
        return baseSchema
            .optional()
            .or(z.literal(''))
            .transform((v) => (v === '' ? undefined : v));
    }

    return baseSchema;
}

// Create email validation schema with optional field
export function createEmailSchema(field: string, min: number, max: number, optional = false) {
    const baseSchema = z
        .string({ message: `${field} is required` })
        .min(min, { message: `${field} is required` })
        .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
        .email({ message: `${field} must be a valid email address` })
        .refine((value) => value.trim() === value, {
            message: `${field} cannot have leading or trailing spaces`
        })
        // ❗ Must contain at least one letter before @
        .refine((value) => /[A-Za-z]/.test(value.split('@')[0]), {
            message: `${field} must contain at least one letter before '@'`
        });

    if (optional) {
        return baseSchema
            .optional()
            .or(z.literal(''))
            .transform((v) => (v === '' ? undefined : v));
    }

    return baseSchema;
}

export function deleteIdSchema(field: string) {
    return z.string({ message: `${field} is required` }).refine((value) => value.length > 0, {
        message: `${field} is required`,
        path: [field]
    });
}

export function createCustomStringSchema(field: string, min: number, max: number) {
    return z
        .string({ message: `${field} is required` })
        .min(min, { message: `Minimum ${min} characters required for ${field}` })
        .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
        .refine((val) => /[A-Za-z0-9]/.test(val), { message: `${field} cannot contain only special characters` })
        .refine((value) => value.trim() === value, {
            message: `${field} cannot have leading or trailing spaces`
        })
        .refine((val) => /^[A-Za-z0-9][A-Za-z0-9+\s!@#$%^&*(),.?":{}|<>-]*$/.test(val), {
            message: `${field} should not start with a special character`
        })
        .refine((val) => !/^[0-9]+$/.test(val), { message: `${field} cannot be only numbers` });
}

export function createExamCustomStringSchema(field: string, min: number, max: number) {
    return z
        .string({ message: `${field} is required` })
        .min(min, { message: `Minimum ${min} characters required for ${field}` })
        .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
        .refine((val) => /[A-Za-z0-9]/.test(val), { message: `${field} cannot contain only special characters` })
        .refine((value) => value.trim() === value, {
            message: `${field} cannot have leading or trailing spaces`
        })
        .refine((val) => /^[A-Za-z0-9][A-Za-z0-9+_\s!@#$%^&*(),.?":{}|<>-]*$/.test(val), {
            message: `${field} should not start with a special character`
        });
    //.refine((val) => !/^[0-9]+$/.test(val), { message: `${field} cannot be only numbers` });
}
export function createOptionalAlphaNumericSchema(field: string, min: number, max: number) {
    return z
        .union([
            z.literal(''),
            z
                .string()
                // ❗ Length rules first
                .min(min, { message: `${field} must have at least ${min} characters` })
                .max(max, { message: `${field} must not exceed ${max} characters` })
                // ❗ Letters, numbers, spaces INSIDE only
                .regex(/^(?!\s)[A-Za-z0-9 ]+(?<!\s)$/, {
                    message: `${field} may contain letters, numbers, and spaces (no leading or trailing spaces)`
                })

                // ❗ Must contain at least one letter
                .refine((value) => /[A-Za-z]/.test(value), {
                    message: `${field} must contain at least one letter`
                })
        ])
        .optional();
}

export function createOptionalAlphaNumericAllowBothSchema(field: string, min: number, max: number) {
    return z
        .union([
            z.literal(''),
            z
                .string()
                // Length rules
                .min(min, { message: `${field} must have at least ${min} characters` })
                .max(max, { message: `${field} must not exceed ${max} characters` })

                // Letters, numbers, spaces inside only (no leading/trailing space)
                .regex(/^(?!\s)[A-Za-z0-9 ]+(?<!\s)$/, {
                    message: `${field} may contain letters, numbers, and spaces (no leading or trailing spaces)`
                })
        ])
        .optional();
}

//pancard schema

export function createAlphanumericSchemaPanCard(field: string, optional = false) {
    const baseSchema = z
        .string()
        .length(10, { message: `${field} must be exactly 10 characters` })
        .refine((value) => /^[A-Za-z0-9]+$/.test(value), {
            message: `${field} must contain only alphanumeric characters`
        })
        .refine((value) => /[A-Za-z]/.test(value), {
            message: `${field} must contain at least one letter`
        })
        .refine((value) => /\d/.test(value), {
            message: `${field} must contain at least one number`
        })
        .refine((value) => value.trim() === value, {
            message: `${field} cannot have leading or trailing spaces`
        });

    if (optional) {
        return baseSchema
            .optional()
            .or(z.literal(''))
            .transform((v) => (v === '' ? undefined : v));
    }

    return baseSchema;
}

//with  not have number and special character

export function createOptionalStringWithLettersSchema(field: string, min: number, max: number) {
    return (
        z
            .string()
            .max(max, { message: `Maximum ${max} characters allowed for ${field}` })

            // No leading/trailing spaces
            .refine((value) => value.length === 0 || value.trim() === value, {
                message: `${field} cannot have leading or trailing spaces`
            })

            // Must contain at least ONE letter (to avoid only numbers / only special chars)
            .refine((value) => value.length === 0 || /[A-Za-z]/.test(value), {
                message: `${field} must contain at least one letter`
            })

            // Min length (if not empty)
            .refine((value) => value.length === 0 || value.length >= min, {
                message: `${field} must have at least ${min} characters or be empty.`
            })

            .optional()
            .or(z.literal(''))
    ); // empty allowed
}

//with number letter not optional
export function createOptionalAlphaNumericSchemaNotOptional(field: string, min: number, max: number) {
    return (
        z
            .string()
            .min(min, { message: `${field} must have at least ${min} characters` })
            .max(max, { message: `Maximum ${max} characters allowed for ${field}` })

            // Only letters and numbers allowed
            .regex(/^[A-Za-z0-9]+$/, {
                message: `${field} can contain only letters and numbers`
            })

            // No leading or trailing spaces
            .refine((value) => value.trim() === value, {
                message: `${field} cannot have leading or trailing spaces`
            })

            // Must contain at least one alphabet
            .refine((value) => /[A-Za-z]/.test(value), {
                message: `${field} must contain at least one letter`
            })

            // Optional (undefined allowed, but empty string not allowed)
            .optional()
    );
}

export function isAlphabetsOnly(text: string): boolean {
    return /^[a-zA-Z\s]*$/.test(text);
}

export function createRequiredAlphaNumericWithSpaceSchema(field: string, min: number, max: number) {
    return (
        z
            .string()
            .min(min, { message: `${field} must have at least ${min} characters` })
            .max(max, { message: `Maximum ${max} characters allowed for ${field}` })

            // Allow letters, numbers, and spaces
            .regex(/^[A-Za-z0-9 ]+$/, {
                message: `${field} can contain only letters, numbers, and spaces`
            })

            // No leading or trailing spaces
            .refine((value) => value.trim() === value, {
                message: `${field} cannot have leading or trailing spaces`
            })

            // Must contain at least one alphabet
            .refine((value) => /[A-Za-z]/.test(value), {
                message: `${field} must contain at least one letter`
            })

            // Must not be only numbers
            .refine((value) => !/^[0-9]+$/.test(value), {
                message: `${field} cannot contain only numbers`
            })
    );
}

export function createAllAllowedRequired(field: string, min: number, max: number) {
    return z
        .union([
            z.number(), // ✅ allow number input

            z
                .string()
                .min(min, { message: `${field} must have at least ${min} characters` })
                .max(max, { message: `Maximum ${max} characters allowed for ${field}` })

                // ❌ no leading or trailing spaces
                .refine((value) => value.trim() === value, { message: `${field} cannot have leading or trailing spaces` })
        ])
        .refine((value) => value !== '' && value !== null && value !== undefined, { message: `${field} is required` });
}

export function createAllAllowedOptional(field: string, min: number, max: number) {
    return z
        .union([
            z.number(),

            z
                .string()
                .max(max, { message: `Maximum ${max} characters allowed for ${field}` })
                .refine((value) => value.length === 0 || value.trim() === value, {
                    message: `${field} cannot have leading or trailing spaces`
                })
                .refine((value) => value.length === 0 || value.length >= min, {
                    message: `${field} must have at least ${min} characters or be empty`
                })
        ])
        .optional()
        .or(z.literal(''));
}
