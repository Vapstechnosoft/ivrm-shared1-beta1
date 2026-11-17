/**
 * HRMS Master Module Validation Rules
 * Based on field length specifications from HRMSMaster - Field length document
 */

// Validation patterns
export const VALIDATION_PATTERNS = {
    // Alphabet only (letters only)
    ALPHABET_ONLY: /^[A-Za-z\s]+$/,

    // Alphanumeric (letters and numbers)
    ALPHANUMERIC: /^[A-Za-z0-9\s]+$/,

    // Alphanumeric but not purely numeric (must contain at least one letter)
    ALPHANUMERIC_NOT_NUMERIC_ONLY: /^(?=.*[A-Za-z])[A-Za-z0-9\s]+$/,

    // Numeric only
    NUMERIC_ONLY: /^[0-9]+$/,

    // Decimal numbers
    DECIMAL_NUMERIC: /^[0-9]+(\.[0-9]+)?$/,

    // IFSC Code pattern (4 alphabets + 0 + 6 digits) - exactly 11 characters
    IFSC_CODE: /^[A-Z]{4}0[0-9]{6}$/,

    // Account number (numeric only, 9-18 digits, cannot start with 0)
    ACCOUNT_NUMBER: /^[1-9][0-9]{8,17}$/,

    // Leave year format (4 digits YYYY)
    LEAVE_YEAR: /^[0-9]{4}$/,

    // Bank name (alphanumeric + spaces + .)
    BANK_NAME: /^[A-Za-z0-9\s.]+$/,

    // Branch name (alphanumeric + spaces + /, -, .)
    BRANCH_NAME: /^[A-Za-z0-9\s/\-.]+$/,

    // Bank address (alphanumeric + commas, /, -, .)
    BANK_ADDRESS: /^[A-Za-z0-9\s,/\-.]+$/
};

// Error messages
export const VALIDATION_MESSAGES = {
    REQUIRED: (field: string) => `${field} is required`,
    MAX_LENGTH: (field: string, max: number) => `${field} must not exceed ${max} characters`,
    MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
    ALPHABET_ONLY: (field: string) => `${field} must contain only letters and spaces`,
    ALPHANUMERIC: (field: string) => `${field} must contain only letters, numbers, and spaces`,
    ALPHANUMERIC_NOT_NUMERIC_ONLY: (field: string) => `${field} must contain letters and numbers, but cannot be purely numeric`,
    NUMERIC_ONLY: (field: string) => `${field} must contain only numbers`,
    DECIMAL_NUMERIC: (field: string) => `${field} must be a valid number`,
    MIN_VALUE: (field: string, min: number) => `${field} must be at least ${min}`,
    MAX_VALUE: (field: string, max: number) => `${field} must not exceed ${max}`,
    INVALID_FORMAT: (field: string) => `${field} format is invalid`,
    POSITIVE_NUMBER: (field: string) => `${field} must be a positive number`,
    UNIQUE: (field: string) => `${field} must be unique`,
    CANNOT_START_WITH_ZERO: (field: string) => `${field} cannot start with 0`,
    INVALID_IFSC: () => 'Enter valid IFSC Code (e.g., SBIN0000123)',
    DUPLICATE_ACCOUNT: () => 'Duplicate Account Number not allowed',
    DATE_RANGE: () => 'From Date must be earlier than To Date',
    DATE_OVERLAP: () => 'Date cannot overlap with existing leave year',
    AMOUNT_RANGE: () => 'Amount From must be less than or equal to Amount To',
    PERCENTAGE_RANGE: () => 'Percentage must be between 0 and 100'
};

// Employee Category Master Validations
export const EMPLOYEE_TYPE_VALIDATION = {
    HRMET_EmployeeType: {
        required: VALIDATION_MESSAGES.REQUIRED('Employee Type'),
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Employee Type', 50)
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Employee Type');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Employee Type cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Employee Type must contain at least one alphabet character';
            }
            // Uniqueness validation should be checked against the database
            return true;
        }
    }
};

export const GROUP_TYPE_VALIDATION = {
    HRMGT_GroupType: {
        required: VALIDATION_MESSAGES.REQUIRED('Group Type'),
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Group Type', 50)
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Group Type');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Group Type cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Group Type must contain at least one alphabet character';
            }
            // Uniqueness validation should be checked against the database
            return true;
        }
    },
    HRMGT_GroupCode: {
        required: VALIDATION_MESSAGES.REQUIRED('Group Code'),
        maxLength: {
            value: 10,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Group Code', 10)
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Group Code');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Group Code cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Group Code must contain at least one alphabet character';
            }
            // Uniqueness validation should be checked against the database
            return true;
        }
    },
    HRMGT_Order: {
        validate: (value: number | string) => {
            // Order is typically auto-generated or can be manually set using "SET ORDER" functionality
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
            if (Number.isNaN(numValue) || numValue < 0) {
                return 'Order must be a non-negative integer';
            }
            return true;
        }
    }
};

export const DEPARTMENT_VALIDATION = {
    HRMD_DepartmentName: {
        required: VALIDATION_MESSAGES.REQUIRED('Department Name'),
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Department Name', 50)
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Department Name');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Department Name cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Department Name must contain at least one alphabet character';
            }
            // Uniqueness validation should be checked against the database
            return true;
        }
    },
    HRMD_InternalTrainingMinimumHours: {
        required: VALIDATION_MESSAGES.REQUIRED('Internal Training Minimum Hours'),
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('Internal Training Minimum Hours')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Internal Training Minimum Hours', 0)
        },
        validate: (value: string | number) => {
            const numValue = typeof value === 'string' ? Number.parseInt(value, 10) : value;
            if (Number.isNaN(numValue) || numValue < 0) {
                return 'Internal Training Minimum Hours must be a positive number or zero';
            }
            return true;
        }
    },
    HRMD_Order: {
        validate: (value: number | string) => {
            // Order is typically auto-generated or can be manually set using "SET ORDER" functionality
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
            if (Number.isNaN(numValue) || numValue < 0) {
                return 'Order must be a non-negative integer';
            }
            return true;
        }
    }
};

export const DESIGNATION_VALIDATION = {
    HRMDES_DesignationName: {
        required: VALIDATION_MESSAGES.REQUIRED('Designation Name'),
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Designation Name', 50)
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Designation Name');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Designation Name cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Designation Name must contain at least one alphabet character';
            }
            // Uniqueness validation should be checked against the database
            return true;
        }
    },
    HRMDES_SanctionedSeats: {
        required: VALIDATION_MESSAGES.REQUIRED('Sanctioned Seats'),
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('Sanctioned Seats')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Sanctioned Seats', 0)
        },
        validate: (value: string | number) => {
            const numValue = typeof value === 'string' ? Number.parseInt(value, 10) : value;
            if (Number.isNaN(numValue) || numValue < 0) {
                return 'Sanctioned Seats must be a positive number or zero';
            }
            return true;
        }
    },
    HRMDES_BasicAmount: {
        required: VALIDATION_MESSAGES.REQUIRED('Basic Amount'),
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Basic Amount')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Basic Amount', 0)
        },
        validate: (value: string | number) => {
            const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
            if (Number.isNaN(numValue) || numValue < 0) {
                return 'Basic Amount must be a positive number or zero';
            }
            // DECIMAL(10, 2) or INTEGER(10) - up to 10 digits
            if (numValue > 9999999999) {
                return 'Basic Amount must not exceed 10 digits';
            }
            return true;
        }
    },
    HRMDES_DisplaySanctionedSeats: {
        required: VALIDATION_MESSAGES.REQUIRED('Display Sanctioned Seats'),
        validate: (value: string | boolean) => {
            // Must be Yes/No (boolean or TINYINT(1))
            if (value === undefined || value === null || value === '') {
                return 'Display Sanctioned Seats must be selected (Yes/No)';
            }
            return true;
        }
    },
    HRMDES_Order: {
        validate: (value: number | string) => {
            // Order is typically auto-generated or can be manually set using "SET ORDER" functionality
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
            if (Number.isNaN(numValue) || numValue < 0) {
                return 'Order must be a non-negative integer';
            }
            return true;
        }
    }
};

export const GRADE_VALIDATION = {
    gradeName: {
        required: VALIDATION_MESSAGES.REQUIRED('Grade Name'),
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Grade Name', 50)
        },
        pattern: {
            value: VALIDATION_PATTERNS.ALPHABET_ONLY,
            message: VALIDATION_MESSAGES.ALPHABET_ONLY('Grade Name')
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Grade Name');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Grade Name cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Grade Name must contain at least one alphabet character';
            }
            return true;
        }
    },
    gradeDisplayName: {
        required: VALIDATION_MESSAGES.REQUIRED('Grade Display Name'),
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Grade Display Name', 50)
        },
        pattern: {
            value: VALIDATION_PATTERNS.ALPHABET_ONLY,
            message: VALIDATION_MESSAGES.ALPHABET_ONLY('Grade Display Name')
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Grade Display Name');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Grade Display Name cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Grade Display Name must contain at least one alphabet character';
            }
            return true;
        }
    },
    payScaleFrom: {
        required: VALIDATION_MESSAGES.REQUIRED('Pay Scale From'),
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Pay Scale From')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Pay Scale From', 0)
        },
        max: {
            value: 9999999999, // 10 digits including decimals
            message: VALIDATION_MESSAGES.MAX_VALUE('Pay Scale From', 9999999999)
        }
    },
    payScaleTo: {
        required: VALIDATION_MESSAGES.REQUIRED('Pay Scale To'),
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Pay Scale To')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Pay Scale To', 0)
        },
        max: {
            value: 9999999999, // 10 digits including decimals
            message: VALIDATION_MESSAGES.MAX_VALUE('Pay Scale To', 9999999999)
        }
    },
    increment: {
        required: VALIDATION_MESSAGES.REQUIRED('Increment'),
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Increment', 0)
        },
        max: {
            value: 999, // 3 digits max
            message: VALIDATION_MESSAGES.MAX_VALUE('Increment', 999)
        },
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Increment')
        }
    }
};

export const BANK_VALIDATION = {
    HRMBK_BankName: {
        required: VALIDATION_MESSAGES.REQUIRED('Bank Name'),
        minLength: {
            value: 3,
            message: VALIDATION_MESSAGES.MIN_LENGTH('Bank Name', 3)
        },
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Bank Name', 50)
        },
        pattern: {
            value: VALIDATION_PATTERNS.BANK_NAME,
            message: 'Bank Name must contain only alphabets, numbers, spaces, and periods (.)'
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Bank Name');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Bank Name cannot be empty or contain only spaces';
            }
            if (trimmed.length < 3) {
                return VALIDATION_MESSAGES.MIN_LENGTH('Bank Name', 3);
            }
            // Check if it contains at least one alphabet character
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Bank Name must contain at least one alphabet character';
            }
            // Uniqueness validation: Must be unique w.r.t all details are same. Can be duplicate with unique account number.
            // This is a placeholder - implement actual uniqueness check
            return true;
        }
    },
    HRMBK_BranchName: {
        required: VALIDATION_MESSAGES.REQUIRED('Branch Name'),
        minLength: {
            value: 3,
            message: VALIDATION_MESSAGES.MIN_LENGTH('Branch Name', 3)
        },
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Branch Name', 50)
        },
        pattern: {
            value: VALIDATION_PATTERNS.BRANCH_NAME,
            message: 'Branch Name must contain only alphabets, numbers, spaces, /, -, and periods (.)'
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Branch Name');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Branch Name cannot be empty or contain only spaces';
            }
            if (trimmed.length < 3) {
                return VALIDATION_MESSAGES.MIN_LENGTH('Branch Name', 3);
            }
            // Check if it contains at least one alphabet character
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Branch Name must contain at least one alphabet character';
            }
            return true;
        }
    },
    HRMBK_AccountNumber: {
        required: VALIDATION_MESSAGES.REQUIRED('Account Number'),
        minLength: {
            value: 9,
            message: VALIDATION_MESSAGES.MIN_LENGTH('Account Number', 9)
        },
        maxLength: {
            value: 18,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Account Number', 18)
        },
        pattern: {
            value: VALIDATION_PATTERNS.ACCOUNT_NUMBER,
            message: 'Account Number must be numeric, 9-18 digits, and cannot start with 0'
        },
        validate: async (value: string) => {
            // Uniqueness validation: Must be unique
            // This is a placeholder - implement actual uniqueness check
            return true;
        }
    },
    HRMBK_IFSCCode: {
        required: VALIDATION_MESSAGES.REQUIRED('IFSC Code'),
        pattern: {
            value: VALIDATION_PATTERNS.IFSC_CODE,
            message: VALIDATION_MESSAGES.INVALID_IFSC()
        },
        validate: (value: string) => {
            if (!value || value.length !== 11) {
                return 'IFSC Code must be exactly 11 characters (e.g., SBIN0000123)';
            }
            return true;
        }
    },
    HRMBK_BankAddress: {
        maxLength: {
            value: 250,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Bank Address', 250)
        },
        pattern: {
            value: VALIDATION_PATTERNS.BANK_ADDRESS,
            message: 'Invalid characters in Bank Address. Only alphanumeric, commas, /, -, and periods (.) allowed'
        },
        validate: async (value: string) => {
            // Bank Address is optional, but if provided, it must have actual content
            if (value) {
                const trimmed = value.trim();
                if (trimmed.length === 0) {
                    return 'Bank Address cannot contain only spaces';
                }
                // Check if it contains at least one alphabet character
                if (!/[A-Za-z]/.test(trimmed)) {
                    return 'Bank Address must contain at least one alphabet character';
                }
            }
            return true;
        }
    }
};

export const EARNING_DEDUCTION_VALIDATION = {
    HRMED_Name: {
        required: VALIDATION_MESSAGES.REQUIRED('Name'),
        minLength: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_LENGTH('Name', 1)
        },
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Name', 50)
        },
        pattern: {
            value: VALIDATION_PATTERNS.ALPHANUMERIC,
            message: 'Name must contain only alphanumeric characters and spaces'
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Name');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Name cannot be empty or contain only spaces';
            }
            if (trimmed.length < 1) {
                return VALIDATION_MESSAGES.MIN_LENGTH('Name', 1);
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Name must contain at least one alphabet character';
            }
            // Uniqueness validation should be checked against the database
            // This is a placeholder - implement actual uniqueness check
            return true;
        }
    },
    HRMED_EDTypeFlag: {
        required: VALIDATION_MESSAGES.REQUIRED('Type'),
        validate: (value: string) => {
            if (!value || value.trim() === '') {
                return 'Type must be selected from predefined list';
            }
            return true;
        }
    },
    HRMED_RoundOffFlag: {
        validate: (value: string) => {
            if (value && value !== '' && !['No', 'RoundUp', 'RoundDown', 'HalfRoundUp'].includes(value)) {
                return 'Rounding To must be a valid system option';
            }
            return true;
        }
    },
    HRMED_EarnDedFlag: {
        required: VALIDATION_MESSAGES.REQUIRED('Earning/Deduction'),
        validate: (value: string) => {
            const validOptions = ['Earning', 'Deduction', 'Arrear', 'Gross'];
            if (!value || !validOptions.includes(value)) {
                return 'Earning/Deduction must be selected (Earning, Deduction, Arrear, or Gross)';
            }
            return true;
        }
    },
    HRMED_AmountPercentFlag: {
        required: VALIDATION_MESSAGES.REQUIRED('Amount/Percentage'),
        validate: (value: string) => {
            if (!value || !['Amount', 'Percentage'].includes(value)) {
                return 'Amount/Percentage must be selected';
            }
            return true;
        }
    },
    HRMED_AmountPercent: {
        required: VALIDATION_MESSAGES.REQUIRED('Amount/Percentage'),
        validate: (value: string, formValues: any) => {
            const numValue = Number.parseFloat(value);
            if (Number.isNaN(numValue)) {
                return 'Amount/Percentage must be a valid number';
            }
            if (numValue < 1) {
                return 'Amount/Percentage cannot be less than 1';
            }
            const calculationType = formValues.HRMED_AmountPercentFlag;
            if (calculationType === 'Amount') {
                // Amount: up to 10 digits (e.g., 9999999999)
                if (numValue > 9999999999) {
                    return 'Amount must not exceed 10 digits';
                }
            } else if (calculationType === 'Percentage') {
                // Percentage: 0-100, up to 5 digits including decimal (e.g., 99.99)
                if (numValue > 100) {
                    return 'Percentage must not exceed 100';
                }
                if (value.length > 5) {
                    return 'Percentage must not exceed 5 characters (e.g., 99.99)';
                }
            }
            return true;
        }
    },
    HRMED_ReviseFlg: {
        // Optional checkbox - no validation needed
    },
    HRMED_Order: {
        // Optional - typically auto-generated or set via SET ORDER functionality
        validate: (value: number | string) => {
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
            if (Number.isNaN(numValue) || numValue < 0) {
                return 'Order must be a non-negative integer';
            }
            return true;
        }
    }
};

export const GENDER_VALIDATION = {
    HRMGEN_GenderName: {
        required: VALIDATION_MESSAGES.REQUIRED('Gender Name'),
        minLength: {
            value: 3,
            message: VALIDATION_MESSAGES.MIN_LENGTH('Gender Name', 3)
        },
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Gender Name', 50)
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Gender Name');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Gender Name cannot be empty or contain only spaces';
            }
            if (trimmed.length < 3) {
                return VALIDATION_MESSAGES.MIN_LENGTH('Gender Name', 3);
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Gender Name must contain at least one alphabet character';
            }
            return true;
        }
    }
};

export const LEAVE_YEAR_VALIDATION = {
    HRMLY_LeaveYear: {
        required: VALIDATION_MESSAGES.REQUIRED('Leave Year'),
        pattern: {
            value: VALIDATION_PATTERNS.LEAVE_YEAR,
            message: 'Leave Year must be exactly 4 digits (YYYY format, e.g., 2024)'
        },
        validate: (value: string) => {
            if (!value || value.length !== 4) {
                return 'Leave Year must be exactly 4 digits (YYYY)';
            }
            const year = Number.parseInt(value, 10);
            if (Number.isNaN(year) || year < 1900 || year > 2100) {
                return 'Leave Year must be a valid year between 1900 and 2100';
            }
            // Uniqueness validation should be checked against the database
            return true;
        }
    },
    HRMLY_FromDate: {
        required: VALIDATION_MESSAGES.REQUIRED('From Date'),
        validate: (value: string, formValues: any) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('From Date');
            const fromDate = new Date(value);
            const toDate = formValues.HRMLY_ToDate ? new Date(formValues.HRMLY_ToDate) : null;
            if (toDate && fromDate >= toDate) {
                return VALIDATION_MESSAGES.DATE_RANGE();
            }
            // Date overlap validation should be checked against the database
            return true;
        }
    },
    HRMLY_ToDate: {
        required: VALIDATION_MESSAGES.REQUIRED('To Date'),
        validate: (value: string, formValues: any) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('To Date');
            const toDate = new Date(value);
            const fromDate = formValues.HRMLY_FromDate ? new Date(formValues.HRMLY_FromDate) : null;
            if (fromDate && fromDate >= toDate) {
                return VALIDATION_MESSAGES.DATE_RANGE();
            }
            // Date overlap validation should be checked against the database
            return true;
        }
    }
};

// Master Leave Validation
export const MASTER_LEAVE_VALIDATION = {
    leaveName: {
        required: VALIDATION_MESSAGES.REQUIRED('Leave Name'),
        maxLength: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Leave Name', 100)
        },
        // Accepts alphanumeric and special characters
        pattern: {
            value: /^[A-Za-z0-9\s\-_.,!@#$%^&*()]+$/,
            message: 'Leave Name accepts alphanumeric and special characters'
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Leave Name');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Leave Name cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Leave Name must contain at least one alphabet character';
            }
            // Uniqueness validation should be checked against the database
            // This is a placeholder - implement actual uniqueness check
            return true;
        }
    },
    leaveCode: {
        required: VALIDATION_MESSAGES.REQUIRED('Leave Code'),
        maxLength: {
            value: 10,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Leave Code', 10)
        },
        // Accepts alphanumeric characters only
        pattern: {
            value: VALIDATION_PATTERNS.ALPHANUMERIC,
            message: VALIDATION_MESSAGES.ALPHANUMERIC('Leave Code')
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Leave Code');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Leave Code cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Leave Code must contain at least one alphabet character';
            }
            // Uniqueness validation should be checked against the database
            // This is a placeholder - implement actual uniqueness check
            return true;
        }
    },
    leaveDetails: {
        required: VALIDATION_MESSAGES.REQUIRED('Leave Details'),
        maxLength: {
            value: 250,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Leave Details', 250)
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Leave Details');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Leave Details cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Leave Details must contain at least one alphabet character';
            }
            return true;
        }
    },
    leaveType: {
        required: VALIDATION_MESSAGES.REQUIRED('Leave Type'),
        validate: (value: string) => {
            const validTypes = ['On_Duty', 'Comp_Off', 'LWP', 'EL', 'SL'];
            if (value && !validTypes.includes(value)) {
                return 'Leave Type must be selected from the predefined list';
            }
            return true;
        }
    },
    leaveApplyCriteria: {
        required: VALIDATION_MESSAGES.REQUIRED('Leave Apply Criteria'),
        validate: (value: string) => {
            const validCriteria = ['Before', 'After', 'Same Day', 'Month', 'Quarter'];
            if (value && !validCriteria.includes(value)) {
                return 'Leave Apply Criteria must be selected from the predefined list';
            }
            return true;
        }
    },
    daysForApplyCriteria: {
        required: VALIDATION_MESSAGES.REQUIRED('Days for Apply Criteria'),
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Days for Apply Criteria', 1)
        },
        max: {
            value: 999,
            message: VALIDATION_MESSAGES.MAX_VALUE('Days for Apply Criteria', 999)
        },
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('Days for Apply Criteria')
        },
        validate: (value: string) => {
            const numValue = parseInt(value, 10);
            if (isNaN(numValue) || numValue <= 0) {
                return 'Days for Apply Criteria must be a positive integer';
            }
            return true;
        }
    },
    maxDaysForApply: {
        required: VALIDATION_MESSAGES.REQUIRED('Max Days For Apply'),
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Max Days For Apply', 1)
        },
        max: {
            value: 999,
            message: VALIDATION_MESSAGES.MAX_VALUE('Max Days For Apply', 999)
        },
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('Max Days For Apply')
        },
        validate: (value: string) => {
            const numValue = parseInt(value, 10);
            if (isNaN(numValue) || numValue <= 0) {
                return 'Max Days For Apply must be a positive integer';
            }
            return true;
        }
    },
    leaveCredit: {
        // Optional checkbox - no validation needed
    },
    lateDeduct: {
        // Optional checkbox - no validation needed
    },
    probationNotApplicable: {
        // Optional checkbox - no validation needed
    }
};

// Master Leave List Validation (same as Master Leave but with different field lengths)
export const MASTER_LEAVE_LIST_VALIDATION = {
    leaveName: {
        required: VALIDATION_MESSAGES.REQUIRED('Leave Name'),
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Leave Name', 50)
        },
        // Accepts alphanumeric and special characters
        pattern: {
            value: /^[A-Za-z0-9\s\-_.,!@#$%^&*()]+$/,
            message: 'Leave Name accepts alphanumeric and special characters'
        },
        validate: async (value: string) => {
            // Uniqueness validation should be checked against the database
            return true;
        }
    },
    leaveCode: {
        required: VALIDATION_MESSAGES.REQUIRED('Leave Code'),
        maxLength: {
            value: 10,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Leave Code', 10)
        },
        // Accepts alphanumeric characters only
        pattern: {
            value: VALIDATION_PATTERNS.ALPHANUMERIC,
            message: VALIDATION_MESSAGES.ALPHANUMERIC('Leave Code')
        },
        validate: async (value: string) => {
            // Uniqueness validation should be checked against the database
            return true;
        }
    },
    leaveType: {
        required: VALIDATION_MESSAGES.REQUIRED('Leave Type'),
        maxLength: {
            value: 20,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Leave Type', 20)
        },
        validate: (value: string) => {
            const validTypes = ['On_Duty', 'Comp_Off', 'LWP', 'EL', 'SL'];
            if (value && !validTypes.includes(value)) {
                return 'Leave Type must be selected from the predefined list';
            }
            return true;
        }
    },
    leaveApplyCriteria: {
        required: VALIDATION_MESSAGES.REQUIRED('Leave Apply Criteria'),
        maxLength: {
            value: 20,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Leave Apply Criteria', 20)
        },
        validate: (value: string) => {
            const validCriteria = ['Before', 'After', 'Same Day', 'Month', 'Quarter'];
            if (value && !validCriteria.includes(value)) {
                return 'Leave Apply Criteria must be selected from the predefined list';
            }
            return true;
        }
    },
    daysForApplyCriteria: {
        required: VALIDATION_MESSAGES.REQUIRED('Days for Apply Criteria'),
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Days for Apply Criteria', 1)
        },
        max: {
            value: 999,
            message: VALIDATION_MESSAGES.MAX_VALUE('Days for Apply Criteria', 999)
        },
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('Days for Apply Criteria')
        },
        validate: (value: string) => {
            const numValue = parseInt(value, 10);
            if (isNaN(numValue) || numValue <= 0) {
                return 'Days for Apply Criteria must be a positive integer';
            }
            return true;
        }
    },
    maxDaysForApply: {
        // Optional but if provided, must be a positive integer
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Max Days For Apply', 1)
        },
        max: {
            value: 999,
            message: VALIDATION_MESSAGES.MAX_VALUE('Max Days For Apply', 999)
        },
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('Max Days For Apply')
        },
        validate: (value: string) => {
            if (!value) return true; // Optional field
            const numValue = parseInt(value, 10);
            if (isNaN(numValue) || numValue <= 0) {
                return 'Max Days For Apply must be a positive integer';
            }
            return true;
        }
    },
    leaveDetails: {
        required: VALIDATION_MESSAGES.REQUIRED('Leave Details'),
        maxLength: {
            value: 200,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Leave Details', 200)
        }
    },
    leaveCredit: {
        // Optional checkbox - no validation needed
    },
    lateDeduct: {
        // Optional checkbox - no validation needed
    },
    probationNotApplicable: {
        // Optional checkbox - no validation needed
    }
};

// Leave Authorization Validation
export const LEAVE_AUTHORIZATION_VALIDATION = {
    gradeName: {
        required: VALIDATION_MESSAGES.REQUIRED('Select Grade'),
        validate: (value: string) => {
            if (!value || value.trim() === '') {
                return 'Select Grade is required. Must select a grade from the list';
            }
            return true;
        }
    },
    groupTypeName: {
        required: VALIDATION_MESSAGES.REQUIRED('Group Type'),
        validate: (value: string) => {
            if (!value || value.trim() === '') {
                return 'Group Type is required. Must select a group type from the list';
            }
            return true;
        }
    },
    departmentName: {
        required: VALIDATION_MESSAGES.REQUIRED('Department Type'),
        validate: (value: string) => {
            if (!value || value.trim() === '') {
                return 'Department Type is required. Must select a department from the list';
            }
            return true;
        }
    },
    designationName: {
        required: VALIDATION_MESSAGES.REQUIRED('Designation Type'),
        validate: (value: string) => {
            if (!value || value.trim() === '') {
                return 'Designation Type is required. Must select a designation from the list';
            }
            return true;
        }
    },
    leaveType: {
        required: VALIDATION_MESSAGES.REQUIRED('Leave Type'),
        validate: (value: string) => {
            if (!value || value.trim() === '') {
                return 'Leave Type is required. Must select a leave type from the list';
            }
            return true;
        }
    },
    orderOfApproval: {
        required: VALIDATION_MESSAGES.REQUIRED('Order of Approval'),
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Order of Approval', 1)
        },
        max: {
            value: 999,
            message: VALIDATION_MESSAGES.MAX_VALUE('Order of Approval', 999)
        },
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('Order of Approval')
        },
        validate: (value: string | number) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Order of Approval');
            const numValue = typeof value === 'number' ? value : parseInt(String(value), 10);
            if (isNaN(numValue) || numValue <= 0) {
                return 'Order of Approval must be a positive integer';
            }
            return true;
        }
    },
    approvalPerson: {
        required: VALIDATION_MESSAGES.REQUIRED('Approval Person'),
        validate: (value: string) => {
            if (!value || value.trim() === '') {
                return 'Approval Person is required. Must select or enter a valid person\'s name';
            }
            return true;
        }
    },
    finalFlag: {
        // Optional checkbox - no validation needed
    }
};

export const LOAN_TYPE_VALIDATION = {
    HRML_LoanType: {
        required: VALIDATION_MESSAGES.REQUIRED('Loan Type'),
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Loan Type', 50)
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Loan Type');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Loan Type cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Loan Type must contain at least one alphabet character';
            }
            // Uniqueness validation should be checked against the database
            return true;
        }
    },
    HRML_Max: {
        required: VALIDATION_MESSAGES.REQUIRED('Max Loan Amount'),
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Max Loan Amount')
        },
        min: {
            value: 0.01,
            message: VALIDATION_MESSAGES.POSITIVE_NUMBER('Max Loan Amount')
        },
        validate: (value: string | number) => {
            const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
            if (Number.isNaN(numValue) || numValue <= 0) {
                return VALIDATION_MESSAGES.POSITIVE_NUMBER('Max Loan Amount');
            }
            // DECIMAL(10, 2) or INTEGER(10) - up to 10 digits
            if (numValue > 9999999999) {
                return 'Max Loan Amount must not exceed 10 digits';
            }
            return true;
        }
    }
};

export const MARITAL_STATUS_VALIDATION = {
    HRMMS_MaritalStatus: {
        required: VALIDATION_MESSAGES.REQUIRED('Marital Status'),
        minLength: {
            value: 2,
            message: VALIDATION_MESSAGES.MIN_LENGTH('Marital Status', 2)
        },
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Marital Status', 50)
        },
        pattern: {
            value: VALIDATION_PATTERNS.ALPHABET_ONLY,
            message: 'Marital Status must contain only alphabetic characters and spaces (no numeric or special characters)'
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Marital Status');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Marital Status cannot be empty or contain only spaces';
            }
            if (trimmed.length < 2) {
                return VALIDATION_MESSAGES.MIN_LENGTH('Marital Status', 2);
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Marital Status must contain at least one alphabet character';
            }
            // Uniqueness validation should be checked against the database
            return true;
        }
    }
};

export const COURSE_VALIDATION = {
    HRMC_QualificationName: {
        required: VALIDATION_MESSAGES.REQUIRED('Qualification Name'),
        maxLength: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Qualification Name', 100)
        },
        pattern: {
            value: VALIDATION_PATTERNS.ALPHANUMERIC,
            message: 'Qualification Name must contain only alphanumeric characters and spaces'
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Qualification Name');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Qualification Name cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Qualification Name must contain at least one alphabet character';
            }
            // Uniqueness validation should be checked against the database
            return true;
        }
    },
    HRMC_QualificationDescription: {
        required: VALIDATION_MESSAGES.REQUIRED('Qualification Description'),
        minLength: {
            value: 3,
            message: VALIDATION_MESSAGES.MIN_LENGTH('Qualification Description', 3)
        },
        maxLength: {
            value: 150,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Qualification Description', 150)
        },
        pattern: {
            value: VALIDATION_PATTERNS.ALPHANUMERIC,
            message: 'Qualification Description must contain only alphanumeric characters and spaces'
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Qualification Description');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Qualification Description cannot be empty or contain only spaces';
            }
            if (trimmed.length < 3) {
                return VALIDATION_MESSAGES.MIN_LENGTH('Qualification Description', 3);
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'Qualification Description must contain at least one alphabet character';
            }
            return true;
        }
    },
    HRMC_Specialization: {
        required: VALIDATION_MESSAGES.REQUIRED('Specialization'),
        validate: (value: string | boolean) => {
            // Must be Yes/No (radio button)
            if (value === undefined || value === null || value === '') {
                return 'Specialization must be selected (Yes/No)';
            }
            return true;
        }
    },
    HRMC_DefaultQualification: {
        required: VALIDATION_MESSAGES.REQUIRED('Default Qualification'),
        validate: (value: string | boolean) => {
            // Must be Yes/No (radio button)
            // Only one qualification can be set as default - this should be checked at the database/API level
            if (value === undefined || value === null || value === '') {
                return 'Default Qualification must be selected (Yes/No)';
            }
            return true;
        }
    }
};

export const SPECIALIZATION_VALIDATION = {
    HRMSPL_SpecialisationName: {
        required: VALIDATION_MESSAGES.REQUIRED('Specialization Name'),
        maxLength: {
            value: 10,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Specialization Name', 10)
        },
        pattern: {
            value: /^[A-Za-z]+$/,
            message: 'Specialization Name must contain exactly 10 alphabetic characters'
        },
        validate: (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('Specialization Name');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'Specialization Name cannot be empty or contain only spaces';
            }
            if (trimmed.length !== 10) {
                return 'Specialization Name must be exactly 10 alphabetic characters';
            }
            if (!/^[A-Za-z]+$/.test(trimmed)) {
                return 'Specialization Name must contain only alphabetic characters';
            }
            return true;
        }
    }
};

// Professional Tax Validation
export const PROFESSIONAL_TAX_VALIDATION = {
    HRMPT_AmountFrom: {
        required: VALIDATION_MESSAGES.REQUIRED('Amount From'),
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Amount From')
        },
        min: {
            value: 0.01,
            message: VALIDATION_MESSAGES.POSITIVE_NUMBER('Amount From')
        },
        validate: (value: string | number, formValues: any) => {
            const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
            if (Number.isNaN(numValue) || numValue <= 0) {
                return VALIDATION_MESSAGES.POSITIVE_NUMBER('Amount From');
            }
            const amountTo = formValues.HRMPT_AmountTo ? (typeof formValues.HRMPT_AmountTo === 'string' ? Number.parseFloat(formValues.HRMPT_AmountTo) : formValues.HRMPT_AmountTo) : null;
            if (amountTo !== null && numValue >= amountTo) {
                return 'Amount From must be less than Amount To';
            }
            return true;
        }
    },
    HRMPT_AmountTo: {
        required: VALIDATION_MESSAGES.REQUIRED('Amount To'),
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Amount To')
        },
        min: {
            value: 0.01,
            message: VALIDATION_MESSAGES.POSITIVE_NUMBER('Amount To')
        },
        validate: (value: string | number, formValues: any) => {
            const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
            if (Number.isNaN(numValue) || numValue <= 0) {
                return VALIDATION_MESSAGES.POSITIVE_NUMBER('Amount To');
            }
            const amountFrom = formValues.HRMPT_AmountFrom ? (typeof formValues.HRMPT_AmountFrom === 'string' ? Number.parseFloat(formValues.HRMPT_AmountFrom) : formValues.HRMPT_AmountFrom) : null;
            if (amountFrom !== null && numValue <= amountFrom) {
                return 'Amount To must be greater than Amount From';
            }
            return true;
        }
    },
    HRMPT_ProfessionalTax: {
        required: VALIDATION_MESSAGES.REQUIRED('Professional Tax'),
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Professional Tax')
        },
        min: {
            value: 0.01,
            message: VALIDATION_MESSAGES.POSITIVE_NUMBER('Professional Tax')
        }
    }
};

// Payroll Standard Validation
export const PAYROLL_STANDARD_VALIDATION = {
    // Provident Fund
    HRMPS_PFAccountPrefix: {
        required: VALIDATION_MESSAGES.REQUIRED('PF Account Prefix'),
        maxLength: {
            value: 10,
            message: VALIDATION_MESSAGES.MAX_LENGTH('PF Account Prefix', 10)
        },
        pattern: {
            value: VALIDATION_PATTERNS.ALPHANUMERIC,
            message: VALIDATION_MESSAGES.ALPHANUMERIC('PF Account Prefix')
        },
        validate: async (value: string) => {
            if (!value) return VALIDATION_MESSAGES.REQUIRED('PF Account Prefix');
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return 'PF Account Prefix cannot be empty or contain only spaces';
            }
            if (!/[A-Za-z]/.test(trimmed)) {
                return 'PF Account Prefix must contain at least one alphabet character';
            }
            return true;
        }
    },
    HRMPS_PFMaxAmount: {
        required: VALIDATION_MESSAGES.REQUIRED('PF Max Amount'),
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('PF Max Amount')
        },
        min: {
            value: 0.01,
            message: VALIDATION_MESSAGES.POSITIVE_NUMBER('PF Max Amount')
        },
        validate: (value: string | number) => {
            const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
            if (Number.isNaN(numValue) || numValue <= 0) {
                return VALIDATION_MESSAGES.POSITIVE_NUMBER('PF Max Amount');
            }
            // DECIMAL(10, 2) or INTEGER(10)
            if (numValue > 9999999999) {
                return 'PF Max Amount must not exceed 10 digits';
            }
            return true;
        }
    },
    HRMPS_OnlineExamPercent: {
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Online Exam %')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Online Exam %', 0)
        },
        max: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Online Exam %', 100)
        },
        validate: (value: string | number) => {
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
            if (Number.isNaN(numValue) || numValue < 0 || numValue > 100) {
                return 'Online Exam % must be between 0 and 100';
            }
            return true;
        }
    },
    HRMPS_EPFPercent: {
        required: VALIDATION_MESSAGES.REQUIRED('EPF %'),
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('EPF %')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('EPF %', 0)
        },
        max: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_VALUE('EPF %', 100)
        }
    },
    HRMPS_EPFPercentAfterRetirement: {
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('EPF % After Retirement')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('EPF % After Retirement', 0)
        },
        max: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_VALUE('EPF % After Retirement', 100)
        }
    },
    HRMPS_AccNo2Percent: {
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Acc No. 2 %')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Acc No. 2 %', 0)
        },
        max: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Acc No. 2 %', 100)
        }
    },
    HRMPS_AC2MinAmount: {
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('A/C2 Min Amount')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('A/C2 Min Amount', 0)
        },
        validate: (value: string | number) => {
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
            if (Number.isNaN(numValue) || numValue < 0) {
                return 'A/C2 Min Amount must be a positive number or zero';
            }
            return true;
        }
    },
    HRMPS_AccNo21Percent: {
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Acc No. 21 %')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Acc No. 21 %', 0)
        },
        max: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Acc No. 21 %', 100)
        }
    },
    HRMPS_AC21MinAmount: {
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('A/C21 Min Amount')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('A/C21 Min Amount', 0)
        },
        validate: (value: string | number) => {
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
            if (Number.isNaN(numValue) || numValue < 0) {
                return 'A/C21 Min Amount must be a positive number or zero';
            }
            return true;
        }
    },
    HRMPS_AccNo22Percent: {
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Acc No. 22 %')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Acc No. 22 %', 0)
        },
        max: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Acc No. 22 %', 100)
        }
    },
    HRMPS_AC22MinAmount: {
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('A/C22 Min Amount')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('A/C22 Min Amount', 0)
        },
        validate: (value: string | number) => {
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
            if (Number.isNaN(numValue) || numValue < 0) {
                return 'A/C22 Min Amount must be a positive number or zero';
            }
            return true;
        }
    },
    HRMPS_EducationCess: {
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Education Cess')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Education Cess', 0)
        },
        max: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Education Cess', 100)
        }
    },
    HRMPS_PartAMaxLimit: {
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Part A Max Limit')
        },
        min: {
            value: 0.01,
            message: VALIDATION_MESSAGES.POSITIVE_NUMBER('Part A Max Limit')
        },
        validate: (value: string | number) => {
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
            if (Number.isNaN(numValue) || numValue <= 0) {
                return VALIDATION_MESSAGES.POSITIVE_NUMBER('Part A Max Limit');
            }
            return true;
        }
    },
    HRMPS_PartBMaxLimit: {
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Part B Max Limit')
        },
        min: {
            value: 0.01,
            message: VALIDATION_MESSAGES.POSITIVE_NUMBER('Part B Max Limit')
        },
        validate: (value: string | number) => {
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
            if (Number.isNaN(numValue) || numValue <= 0) {
                return VALIDATION_MESSAGES.POSITIVE_NUMBER('Part B Max Limit');
            }
            return true;
        }
    },
    HRMPS_AsPerEmployee: {
        validate: (value: string | boolean) => {
            // Must be Yes/No (BOOLEAN or TINYINT(1))
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            return true;
        }
    },
    HRMPS_RetirementYears: {
        required: VALIDATION_MESSAGES.REQUIRED('Retirement Years'),
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('Retirement Years')
        },
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Retirement Years', 1)
        },
        validate: (value: string | number) => {
            const numValue = typeof value === 'string' ? Number.parseInt(value, 10) : value;
            if (Number.isNaN(numValue) || numValue <= 0) {
                return 'Retirement Years must be a positive integer';
            }
            return true;
        }
    },
    // ESI
    HRMPS_ESIAccountPrefix: {
        required: VALIDATION_MESSAGES.REQUIRED('ESI Account Prefix'),
        maxLength: {
            value: 10,
            message: VALIDATION_MESSAGES.MAX_LENGTH('ESI Account Prefix', 10)
        },
        pattern: {
            value: VALIDATION_PATTERNS.ALPHANUMERIC,
            message: VALIDATION_MESSAGES.ALPHANUMERIC('ESI Account Prefix')
        }
    },
    HRMPS_ESIMaxPercent: {
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('ESI Max %')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('ESI Max %', 0)
        },
        max: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_VALUE('ESI Max %', 100)
        }
    },
    HRMPS_ESIMaxAmount: {
        required: VALIDATION_MESSAGES.REQUIRED('ESI Max Amount'),
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('ESI Max Amount')
        },
        min: {
            value: 0.01,
            message: VALIDATION_MESSAGES.POSITIVE_NUMBER('ESI Max Amount')
        },
        validate: (value: string | number) => {
            const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
            if (Number.isNaN(numValue) || numValue <= 0) {
                return VALIDATION_MESSAGES.POSITIVE_NUMBER('ESI Max Amount');
            }
            return true;
        }
    },
    HRMPS_EmployerContributionPercent: {
        required: VALIDATION_MESSAGES.REQUIRED('Employer Contribution %'),
        pattern: {
            value: VALIDATION_PATTERNS.DECIMAL_NUMERIC,
            message: VALIDATION_MESSAGES.DECIMAL_NUMERIC('Employer Contribution %')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Employer Contribution %', 0)
        },
        max: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Employer Contribution %', 100)
        }
    },
    // Salary Days
    HRMPS_FromDay: {
        required: VALIDATION_MESSAGES.REQUIRED('From Day'),
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('From Day', 1)
        },
        max: {
            value: 31,
            message: VALIDATION_MESSAGES.MAX_VALUE('From Day', 31)
        },
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('From Day')
        }
    },
    HRMPS_ToDay: {
        required: VALIDATION_MESSAGES.REQUIRED('To Day'),
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('To Day', 1)
        },
        max: {
            value: 31,
            message: VALIDATION_MESSAGES.MAX_VALUE('To Day', 31)
        },
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('To Day')
        },
        validate: (value: string | number, formValues: any) => {
            const numValue = typeof value === 'string' ? Number.parseInt(value, 10) : value;
            const fromDay = formValues.HRMPS_FromDay ? (typeof formValues.HRMPS_FromDay === 'string' ? Number.parseInt(formValues.HRMPS_FromDay, 10) : formValues.HRMPS_FromDay) : null;
            if (fromDay !== null && numValue < fromDay) {
                return 'To Day must be greater than or equal to From Day';
            }
            return true;
        }
    },
    // Arrear Details
    HRMPS_ShowArrearSalaryReport: {
        validate: (value: string | boolean) => {
            // Yes/No selection (BOOLEAN or TINYINT(1))
            return true;
        }
    },
    HRMPS_SeparateArrearSalaryReport: {
        validate: (value: string | boolean) => {
            // Yes/No selection (BOOLEAN or TINYINT(1))
            return true;
        }
    },
    HRMPS_OnlyArrearHead: {
        validate: (value: string | boolean) => {
            // Yes/No selection (BOOLEAN or TINYINT(1))
            return true;
        }
    },
    // Approval Process
    HRMPS_SalaryApproval: {
        validate: (value: string | boolean) => {
            // Yes/No selection (BOOLEAN or TINYINT(1))
            return true;
        }
    },
    HRMPS_Leave: {
        validate: (value: string | boolean) => {
            // Yes/No selection (BOOLEAN or TINYINT(1))
            return true;
        }
    },
    HRMPS_SalaryAdvance: {
        validate: (value: string | boolean) => {
            // Yes/No selection (BOOLEAN or TINYINT(1))
            return true;
        }
    },
    HRMPS_Increment: {
        validate: (value: string | boolean) => {
            // Yes/No selection (BOOLEAN or TINYINT(1))
            return true;
        }
    },
    HRMPS_Loan: {
        validate: (value: string | boolean) => {
            // Yes/No selection (BOOLEAN or TINYINT(1))
            return true;
        }
    },
    HRMPS_Probation: {
        validate: (value: string | boolean) => {
            // Yes/No selection (BOOLEAN or TINYINT(1))
            return true;
        }
    },
    // Payment Method
    HRMPS_PaymentMethod: {
        validate: (value: string | number) => {
            // Radio buttons: Method 1-5, only one can be selected at a time (TINYINT(1) or ENUM)
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            return true;
        }
    },
    // Increment Process
    HRMPS_OptionalHolidays: {
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('Optional Holidays')
        },
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Optional Holidays', 0)
        },
        validate: (value: string | number) => {
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'string' ? Number.parseInt(value, 10) : value;
            if (Number.isNaN(numValue) || numValue < 0) {
                return 'Optional Holidays must be a non-negative integer';
            }
            return true;
        }
    },
    HRMPS_FixedIncrement: {
        validate: (value: string | boolean) => {
            // Yes/No selection (BOOLEAN or TINYINT(1))
            return true;
        }
    },
    HRMPS_Applicable: {
        validate: (value: string | boolean) => {
            // Yes/No selection (BOOLEAN or TINYINT(1))
            return true;
        }
    },
    HRMPS_MinimumPeriod: {
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('Minimum Period')
        },
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Minimum Period', 1)
        },
        validate: (value: string | number) => {
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'string' ? Number.parseInt(value, 10) : value;
            if (Number.isNaN(numValue) || numValue <= 0) {
                return 'Minimum Period must be a positive integer';
            }
            return true;
        }
    },
    HRMPS_IncrementMonth: {
        validate: (value: string | number) => {
            // Must be selected from a list of months (VARCHAR(10) or INT)
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            return true;
        }
    },
    HRMPS_IncrementOnceInMonths: {
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('Increment Once In Months')
        },
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Increment Once In Months', 1)
        },
        validate: (value: string | number) => {
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'string' ? Number.parseInt(value, 10) : value;
            if (Number.isNaN(numValue) || numValue <= 0) {
                return 'Increment Once In Months must be a positive integer';
            }
            return true;
        }
    },
    HRMPS_AlertDays: {
        pattern: {
            value: VALIDATION_PATTERNS.NUMERIC_ONLY,
            message: VALIDATION_MESSAGES.NUMERIC_ONLY('Alert Days')
        },
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Alert Days', 1)
        },
        validate: (value: string | number) => {
            if (value === undefined || value === null || value === '') {
                return true; // Optional
            }
            const numValue = typeof value === 'string' ? Number.parseInt(value, 10) : value;
            if (Number.isNaN(numValue) || numValue <= 0) {
                return 'Alert Days must be a positive integer';
            }
            return true;
        }
    }
};

// Utility function to validate pay scale range
export const validatePayScaleRange = (from: number, to: number): string | null => {
    if (from >= to) {
        return 'Pay Scale From must be less than Pay Scale To';
    }
    return null;
};

// Utility function to validate salary range
export const validateSalaryRange = (from: number, to: number): string | null => {
    if (from >= to) {
        return 'Salary From must be less than Salary To';
    }
    return null;
};

// Utility function to validate date range
export const validateDateRange = (fromDate: string, toDate: string): string | null => {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (from >= to) {
        return 'From Date must be before To Date';
    }
    return null;
};

// Group Department Designation Mapping Validation
export const GROUP_DEPT_DESIGNATION_MAPPING_VALIDATION = {
    HRMGDDM_GroupType: {
        required: VALIDATION_MESSAGES.REQUIRED('Group Type'),
        validate: (value: string) => {
            if (!value || value.trim() === '') {
                return 'Group Type must be selected from dropdown list';
            }
            return true;
        }
    },
    HRMGDDM_Department: {
        required: VALIDATION_MESSAGES.REQUIRED('Department'),
        validate: (value: string) => {
            if (!value || value.trim() === '') {
                return 'Department must be selected from dropdown list';
            }
            return true;
        }
    },
    HRMGDDM_Designation: {
        required: VALIDATION_MESSAGES.REQUIRED('Designation'),
        validate: (value: string | string[]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) {
                return 'At least one Designation must be selected from the multi-select list';
            }
            return true;
        }
    }
};

// Religion Category Mapping Validation
export const RELIGION_CATEGORY_MAPPING_VALIDATION = {
    HRMRCM_Religion: {
        required: VALIDATION_MESSAGES.REQUIRED('Religion'),
        validate: (value: string) => {
            if (!value || value.trim() === '') {
                return 'Religion must be selected from dropdown list';
            }
            return true;
        }
    },
    HRMRCM_CasteCategory: {
        required: VALIDATION_MESSAGES.REQUIRED('Caste Category'),
        validate: (value: string | string[]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) {
                return 'At least one Caste Category must be selected from the multi-select list';
            }
            return true;
        }
    }
};

// Export all validation rules as a single object for easy access
export const HRMS_MASTER_VALIDATION = {
    EMPLOYEE_TYPE: EMPLOYEE_TYPE_VALIDATION,
    GROUP_TYPE: GROUP_TYPE_VALIDATION,
    DEPARTMENT: DEPARTMENT_VALIDATION,
    DESIGNATION: DESIGNATION_VALIDATION,
    GRADE: GRADE_VALIDATION,
    BANK: BANK_VALIDATION,
    EARNING_DEDUCTION: EARNING_DEDUCTION_VALIDATION,
    GENDER: GENDER_VALIDATION,
    LEAVE_YEAR: LEAVE_YEAR_VALIDATION,
    MASTER_LEAVE: MASTER_LEAVE_VALIDATION,
    MASTER_LEAVE_LIST: MASTER_LEAVE_LIST_VALIDATION,
    LEAVE_AUTHORIZATION: LEAVE_AUTHORIZATION_VALIDATION,
    LOAN_TYPE: LOAN_TYPE_VALIDATION,
    MARITAL_STATUS: MARITAL_STATUS_VALIDATION,
    COURSE: COURSE_VALIDATION,
    SPECIALIZATION: SPECIALIZATION_VALIDATION,
    PROFESSIONAL_TAX: PROFESSIONAL_TAX_VALIDATION,
    PAYROLL_STANDARD: PAYROLL_STANDARD_VALIDATION,
    GROUP_DEPT_DESIGNATION_MAPPING: GROUP_DEPT_DESIGNATION_MAPPING_VALIDATION,
    RELIGION_CATEGORY_MAPPING: RELIGION_CATEGORY_MAPPING_VALIDATION
};
