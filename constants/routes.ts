export const AUTH_ROUTES = {
    SIGN_IN: '/sign-in',
    FORGOT_PASSWORD: '/forgot-password',
    TERMS: '/terms'
};

export const ROUTES = {
    DASHBOARD: '/',
    ADMISSION: {
        ADMISSION: '/admission',
        ADMISSION_SUB_MENUS: {
            PREADMISSION: '/preadmission',
            PREADMISSION_SUB_MENUS: {
                CONFIGURATION: '/configuration',
                CONFIGURATION_SUB_MENUS: {
                    MASTER_ACADEMIC_YEAR: '/academic-year'
                },
                SECTION: '/section',
                SECTION_SUB_MENUS: {
                    NEW_SECTION: '/new-class'
                },
                MASTERS: '/masters',
                MASTERS_SUB_MENUS: {
                    MASTERS_CLASS: '/class',
                    MASTERS_CATEGORY: '/category',
                    MASTERS_SECTION: '/section',
                    MASTERS_CLASS_CATEGORY: '/class-category',
                    MASTERS_RELIGION: '/religion',
                    MASTERS_CASTE_CATEGORY: '/caste-category',
                    MASTERS_CASTE: '/caste'
                },
                TRANSACTIONS: '/transactions',
                TRANSACTIONS_SUB_MENUS: {
                    APPLICATION_FORM: '/application-form'
                },
                REPORTS: '/reports',
                REPORTS_SUB_MENUS: {
                    STUDENT_COUNT_REPORT: '/student-count-report'
                },
                ATTENDANCE_ENTRY: '/attendance-entry',
                ATTENDANCE_ENTRY_SUB_MENUS: {
                    ENTRY_TYPE: '/attendance_entry_type',
                    LOGIN_PRIVILEGES: '/login-privileges',
                    STUDENT_ATTENDANCE: '/student-attendance'
                },
                STUDENT_TC: '/student-transfer-certificate',
                STUDENT_TC_SUB_MENUS: {
                    APPLY: '/apply',
                    CANCEL: '/cancel'
                }
            }
        }
    },
    HRMS: {
        HRMS: '/hrms',
        HRMS_SUB_MENUS: {
            CONFIG: '/hrms/config',
            CONFIG_SUB_MENUS: {
                MASTERS: '/masters',
                MASTERS_SUB_MENUS: {
                    BANK: '/bank',
                    COURSE: '/course',
                    EMPLOYEE_CATEGORY: '/employee-category',
                    GENDER: '/gender',
                    MARITAL_STATUS: '/marital-status',
                    SPECIALIZATION: '/specialization',
                    EARNINGS_DEDUCTIONS: '/earnings-deductions',
                    PROFESSIONAL_TAX: '/professional-tax',
                    PAYROLL_STANDARD: '/payroll-standard',
                    LOAN: '/loan',
                    LEAVE_YEAR: '/leave-year',
                    GROUP_DEPT_DESSG_MAPPING: '/group-dept-dessg-mapping',
                    RELIGION_CATEGORY_MAPPING: '/religion-category-mapping'
                }
            }
        }
    }
};

export const PUBLIC_ROUTES = {
    PAYMENT_SUCCESS: '/admission/preadmission/transactions/application-form/payment/success',
    PAYMENT_FAILURE: '/admission/preadmission/transactions/application-form/payment/failure'
};
