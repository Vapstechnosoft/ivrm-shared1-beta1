/**
 * HRMS Transaction Module Validation Rules
 *
 * This file contains all validation rules and patterns for the HRMS Transaction module forms.
 * It provides centralized validation logic with consistent error messages.
 */

// Validation Patterns
export const VALIDATION_PATTERNS = {
    ALPHABET_ONLY: /^[A-Za-z\s]+$/,
    ALPHANUMERIC: /^[A-Za-z0-9\s]+$/,
    NUMERIC_ONLY: /^[0-9]+$/,
    DECIMAL: /^\d+(\.\d{1,2})?$/,
    PERCENTAGE: /^(100(\.00)?|[0-9]{1,2}(\.[0-9]{1,2})?)$/,
    REFERENCE_NUMBER: /^[A-Za-z0-9]+$/,
    TEXT_WITH_SPACES: /^[A-Za-z0-9\s.,!?@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/]*$/
};

// Validation Messages
export const VALIDATION_MESSAGES = {
    REQUIRED: (field: string) => `${field} is required`,
    MAX_LENGTH: (field: string, max: number) => `${field} must not exceed ${max} characters`,
    MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
    NUMERIC_ONLY: (field: string) => `${field} must contain only numbers`,
    ALPHABET_ONLY: (field: string) => `${field} must contain only letters`,
    ALPHANUMERIC_ONLY: (field: string) => `${field} must contain only letters and numbers`,
    DECIMAL_FORMAT: (field: string) => `${field} must be a valid decimal number`,
    PERCENTAGE_RANGE: (field: string) => `${field} must be between 0 and 100`,
    MIN_VALUE: (field: string, min: number) => `${field} must be at least ${min}`,
    MAX_VALUE: (field: string, max: number) => `${field} must not exceed ${max}`,
    INVALID_DATE: (field: string) => `${field} must be a valid date`,
    FUTURE_DATE: (field: string) => `${field} cannot be a future date`,
    PAST_DATE: (field: string) => `${field} cannot be a past date`,
    SELECT_OPTION: (field: string) => `Please select a ${field}`,
    SELECT_ONE_OPTION: (field: string) => `Please select one ${field} option`
};

// Employee Loan Validation
export const EMPLOYEE_LOAN_VALIDATION = {
    employeeId: {
        required: VALIDATION_MESSAGES.REQUIRED('Employee')
    },
    appliedDate: {
        required: VALIDATION_MESSAGES.REQUIRED('Applied Date')
    },
    loanTypeId: {
        required: VALIDATION_MESSAGES.REQUIRED('Loan Type')
    },
    modeOfPayment: {
        required: VALIDATION_MESSAGES.REQUIRED('Mode of Payment')
    },
    referenceNo: {
        maxLength: {
            value: 50,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Reference Number', 50)
        },
        pattern: {
            value: VALIDATION_PATTERNS.ALPHANUMERIC,
            message: VALIDATION_MESSAGES.ALPHANUMERIC_ONLY('Reference Number')
        }
    },
    loanAmount: {
        required: VALIDATION_MESSAGES.REQUIRED('Loan Amount'),
        min: {
            value: 0.01,
            message: VALIDATION_MESSAGES.MIN_VALUE('Loan Amount', 0.01)
        },
        max: {
            value: 99999999.99,
            message: VALIDATION_MESSAGES.MAX_VALUE('Loan Amount', 99999999.99)
        }
    },
    loanInterest: {
        required: VALIDATION_MESSAGES.REQUIRED('Loan Interest'),
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Loan Interest', 0)
        },
        max: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Loan Interest', 100)
        }
    },
    loanInstallments: {
        required: VALIDATION_MESSAGES.REQUIRED('Loan Installments'),
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Loan Installments', 1)
        },
        max: {
            value: 9999,
            message: VALIDATION_MESSAGES.MAX_VALUE('Loan Installments', 9999)
        }
    },
    loanEMI: {
        required: VALIDATION_MESSAGES.REQUIRED('Loan EMI'),
        min: {
            value: 0.01,
            message: VALIDATION_MESSAGES.MIN_VALUE('Loan EMI', 0.01)
        },
        max: {
            value: 99999999.99,
            message: VALIDATION_MESSAGES.MAX_VALUE('Loan EMI', 99999999.99)
        }
    }
};

// Mass Updation Validation
export const MASS_UPDATION_VALIDATION = {
    groupType: {
        required: VALIDATION_MESSAGES.REQUIRED('Group Type')
    },
    department: {
        required: VALIDATION_MESSAGES.REQUIRED('Department')
    },
    designation: {
        required: VALIDATION_MESSAGES.REQUIRED('Designation')
    },
    earningType: {
        required: VALIDATION_MESSAGES.SELECT_ONE_OPTION('Earning')
    },
    amountType: {
        required: VALIDATION_MESSAGES.SELECT_ONE_OPTION('Amount')
    },
    head: {
        required: VALIDATION_MESSAGES.REQUIRED('Head')
    },
    percentage: {
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Percentage', 0)
        },
        max: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Percentage', 100)
        }
    },
    action: {
        required: VALIDATION_MESSAGES.SELECT_ONE_OPTION('Action')
    }
};

// Salary Advance Validation
export const SALARY_ADVANCE_VALIDATION = {
    employeeId: {
        required: VALIDATION_MESSAGES.REQUIRED('Employee')
    },
    entryDate: {
        required: VALIDATION_MESSAGES.REQUIRED('Entry Date')
    },
    advancedYear: {
        required: VALIDATION_MESSAGES.REQUIRED('Advanced Year'),
        min: {
            value: 2000,
            message: VALIDATION_MESSAGES.MIN_VALUE('Advanced Year', 2000)
        },
        max: {
            value: 2100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Advanced Year', 2100)
        }
    },
    advancedMonth: {
        required: VALIDATION_MESSAGES.REQUIRED('Advanced Month'),
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Advanced Month', 1)
        },
        max: {
            value: 12,
            message: VALIDATION_MESSAGES.MAX_VALUE('Advanced Month', 12)
        }
    },
    advancedAmount: {
        required: VALIDATION_MESSAGES.REQUIRED('Advanced Amount'),
        min: {
            value: 0.01,
            message: VALIDATION_MESSAGES.MIN_VALUE('Advanced Amount', 0.01)
        },
        max: {
            value: 99999999.99,
            message: VALIDATION_MESSAGES.MAX_VALUE('Advanced Amount', 99999999.99)
        }
    },
    modeOfPayment: {
        required: VALIDATION_MESSAGES.REQUIRED('Mode of Payment')
    },
    referenceNo: {
        maxLength: {
            value: 255,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Reference Number', 255)
        },
        pattern: {
            value: VALIDATION_PATTERNS.ALPHANUMERIC,
            message: VALIDATION_MESSAGES.ALPHANUMERIC_ONLY('Reference Number')
        }
    },
    remarks: {
        maxLength: {
            value: 500,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Remarks', 500)
        }
    }
};

// Salary Approval Validation
export const SALARY_APPROVAL_VALIDATION = {
    groupType: {
        // Not mandatory - no validation required
    },
    department: {
        // Not mandatory - no validation required
    },
    designation: {
        // Not mandatory - no validation required
    },
    month: {
        required: VALIDATION_MESSAGES.REQUIRED('Month'),
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Month', 1)
        },
        max: {
            value: 12,
            message: VALIDATION_MESSAGES.MAX_VALUE('Month', 12)
        }
    },
    year: {
        required: VALIDATION_MESSAGES.REQUIRED('Year'),
        min: {
            value: 2000,
            message: VALIDATION_MESSAGES.MIN_VALUE('Year', 2000)
        },
        max: {
            value: 2100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Year', 2100)
        }
    }
};

// Salary Calculation Validation
export const SALARY_CALCULATION_VALIDATION = {
    groupType: {
        // Not mandatory - no validation required
    },
    department: {
        // Not mandatory - no validation required
    },
    designation: {
        // Not mandatory - no validation required
    },
    month: {
        required: VALIDATION_MESSAGES.REQUIRED('Month'),
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Month', 1)
        },
        max: {
            value: 12,
            message: VALIDATION_MESSAGES.MAX_VALUE('Month', 12)
        }
    },
    year: {
        required: VALIDATION_MESSAGES.REQUIRED('Year'),
        min: {
            value: 2000,
            message: VALIDATION_MESSAGES.MIN_VALUE('Year', 2000)
        },
        max: {
            value: 2100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Year', 2100)
        }
    }
};

// Salary Increment Process Validation
export const SALARY_INCREMENT_PROCESS_VALIDATION = {
    employeeId: {
        required: VALIDATION_MESSAGES.REQUIRED('Employee')
    },
    incrementDate: {
        required: VALIDATION_MESSAGES.REQUIRED('Increment Date')
    },
    head: {
        required: VALIDATION_MESSAGES.REQUIRED('Head')
    },
    incrementType: {
        // Not mandatory - no validation required
    },
    percentage: {
        min: {
            value: 0,
            message: VALIDATION_MESSAGES.MIN_VALUE('Percentage', 0)
        },
        max: {
            value: 100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Percentage', 100)
        }
    },
    remarks: {
        maxLength: {
            value: 500,
            message: VALIDATION_MESSAGES.MAX_LENGTH('Remarks', 500)
        }
    }
};

// Salary Updation Validation
export const SALARY_UPDATION_VALIDATION = {
    groupType: {
        // Not mandatory - no validation required
    },
    department: {
        // Not mandatory - no validation required
    },
    designation: {
        // Not mandatory - no validation required
    },
    month: {
        required: VALIDATION_MESSAGES.REQUIRED('Month'),
        min: {
            value: 1,
            message: VALIDATION_MESSAGES.MIN_VALUE('Month', 1)
        },
        max: {
            value: 12,
            message: VALIDATION_MESSAGES.MAX_VALUE('Month', 12)
        }
    },
    year: {
        required: VALIDATION_MESSAGES.REQUIRED('Year'),
        min: {
            value: 2000,
            message: VALIDATION_MESSAGES.MIN_VALUE('Year', 2000)
        },
        max: {
            value: 2100,
            message: VALIDATION_MESSAGES.MAX_VALUE('Year', 2100)
        }
    },
    head: {
        // Not mandatory - no validation required
    },
    earningDeduction: {
        required: VALIDATION_MESSAGES.SELECT_ONE_OPTION('Earning/Deduction')
    },
    amountType: {
        required: VALIDATION_MESSAGES.SELECT_ONE_OPTION('Amount Type')
    }
};

// Export all validation rules as a single object for easy access
export const HRMS_TRANSACTION_VALIDATION = {
    EMPLOYEE_LOAN: EMPLOYEE_LOAN_VALIDATION,
    MASS_UPDATION: MASS_UPDATION_VALIDATION,
    SALARY_ADVANCE: SALARY_ADVANCE_VALIDATION,
    SALARY_APPROVAL: SALARY_APPROVAL_VALIDATION,
    SALARY_CALCULATION: SALARY_CALCULATION_VALIDATION,
    SALARY_INCREMENT_PROCESS: SALARY_INCREMENT_PROCESS_VALIDATION,
    SALARY_UPDATION: SALARY_UPDATION_VALIDATION
};
