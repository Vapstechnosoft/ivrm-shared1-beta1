import { z } from 'zod';

/**
 * Attendance Management Validation Schemas
 */

// Helper function to check if date is not in the past
const notPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
};

// Helper function to check if date is not in the future
const notFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
};

/**
 * 1. Master Driver Shift Schema
 */
export const masterDriverShiftSchema = {
    addOrUpdate: z
        .object({
            shift: z.string().min(1, 'Shift is required'),
            driver: z.string().min(1, 'Driver is required'),
            fromDate: z
                .string()
                .min(1, 'From Date is required')
                .refine((date) => {
                    const d = new Date(date);
                    return notPastDate(d);
                }, 'From Date cannot be a past date'),
            toDate: z
                .string()
                .min(1, 'To Date is required')
                .refine((date) => {
                    const d = new Date(date);
                    return notPastDate(d);
                }, 'To Date cannot be a past date'),
            remarks: z.string().max(250, 'Remarks must not exceed 250 characters').min(1, 'Remarks is required'),
            saturdayOff: z.boolean().optional(),
            sundayWorking: z.boolean().optional()
        })
        .refine((data) => new Date(data.toDate) >= new Date(data.fromDate), {
            message: 'To Date must be equal to or after From Date',
            path: ['toDate']
        })
};

/**
 * 2. Employee Shift Mapping Schema
 */
export const employeeShiftMappingSchema = {
    addOrUpdate: z
        .object({
            shiftName: z.string().min(1, 'Shift Name is required'),
            applicableDate: z
                .string()
                .min(1, 'Date is required')
                .refine((date) => {
                    const d = new Date(date);
                    return notPastDate(d);
                }, 'Date cannot be a past date'),
            type: z.array(z.string()).optional(), // Optional - used for filtering
            department: z.array(z.string()).optional(), // Optional - used for filtering
            designation: z.array(z.string()).optional(), // Optional - used for filtering
            dayType: z.array(z.string()).optional(), // Optional - used for filtering
            employees: z
                .array(z.string())
                .min(1, 'At least one employee must be selected')
                .refine((employees) => employees.length > 0, {
                    message: 'At least one employee must be selected'
                }),
            // Timing fields
            shiftStartTime: z.string().optional(),
            lunchStartTime: z.string().optional(),
            shiftEndTime: z.string().optional(),
            lunchEndTime: z.string().optional(),
            totalWorkingHours: z.string().optional(),
            delayPerShift: z.string().optional(),
            halfDayWorkingHours: z.string().optional(),
            earlyPerShift: z.string().optional(),
            lunchHours: z.string().optional()
        })
};

/**
 * 3. Holiday Master Mapping Schema
 */
export const holidayMasterSchema = {
    addOrUpdate: z
        .object({
            calendarYear: z.string().min(1, 'Calendar Year is required'),
            department: z.string().optional(), // Optional - will be validated conditionally
            holidayType: z.string().min(1, 'Holiday Type is required'),
            selectedDays: z.array(z.string()).optional(), // Optional - Select Day multi-select
            fromDate: z.string().optional(), // Optional - will be validated conditionally
            toDate: z.string().optional(), // Optional - End Date
            name: z.string().optional(), // Optional - will be validated conditionally
            remarks: z.string().max(250, 'Remarks must not exceed 250 characters').optional()
        })
        .superRefine((data, ctx) => {
            // Conditional validation for PUBLIC HOLIDAY and WEEK END
            if (data.holidayType === 'PUBLIC HOLIDAY' || data.holidayType === 'WEEK END') {
                // Validate fromDate
                if (!data.fromDate || data.fromDate.length === 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Holiday Date is required',
                        path: ['fromDate']
                    });
                } else {
                    const fromDateObj = new Date(data.fromDate);
                    if (!notPastDate(fromDateObj)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Holiday Date cannot be a past date',
                            path: ['fromDate']
                        });
                    }
                }

                // Validate name
                if (!data.name || data.name.length === 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Holiday Name is required',
                        path: ['name']
                    });
                } else if (data.name.length > 100) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Holiday Name must not exceed 100 characters',
                        path: ['name']
                    });
                }
            }
            
            // Conditional validation for WEEK DAY
            if (data.holidayType === 'WEEK DAY') {
                // For WEEK DAY, at least one day must be selected
                if (!data.selectedDays || data.selectedDays.length === 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'At least one day must be selected for WEEK DAY holiday type',
                        path: ['selectedDays']
                    });
                }
                
                // For WEEK DAY, department is required
                if (!data.department || data.department.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Department is required for WEEK DAY holiday type',
                        path: ['department']
                    });
                }
            }
        })
        .refine(
            (data) => {
                // If End Date is provided, it must be on or after Holiday Date
                if (data.toDate && data.fromDate) {
                    return new Date(data.toDate) >= new Date(data.fromDate);
                }
                return true;
            },
            { message: 'End Date must be on or after Holiday Date', path: ['toDate'] }
        )
};

/**
 * 4. Employee Missing Logs Schema
 */
const missingLogEntrySchema = z.object({
    time: z.string().min(1, 'Time is required'),
    inOut: z.enum(['IN', 'OUT'], {
        required_error: 'Input/Output is required',
        invalid_type_error: 'Input/Output must be either IN or OUT'
    }),
    remarks: z.string().max(250, 'Remarks must not exceed 250 characters').optional(),
    file: z.string().optional(),
    uploadFile: z.instanceof(File).optional().refine((file) => {
        if (!file) return true;
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        return file.size <= maxSize && allowedTypes.includes(file.type);
    }, 'File must be jpg, png, or pdf and not exceed 5MB')
});

export const employeeMissingLogsSchema = {
    addOrUpdate: z.object({
        employeeName: z.string().min(1, 'Employee Name is required'),
        date: z
            .string()
            .min(1, 'Date is required')
            .refine((date) => {
                const d = new Date(date);
                return notFutureDate(d);
            }, 'Date cannot be in the future'),
        entries: z
            .array(missingLogEntrySchema)
            .min(1, 'At least one missing log entry is required')
    })
};

/**
 * 5. Master Shift Schema
 */
export const masterShiftSchema = {
    addOrUpdate: z
        .object({
            shiftName: z.string().min(1, 'Shift Name is required').max(100, 'Shift Name must not exceed 100 characters'),
            startTime: z.string().min(1, 'Shift Start Time is required'),
            endTime: z.string().min(1, 'Shift End Time is required'),
            remarks: z.string().min(1, 'Remarks is required').max(250, 'Remarks must not exceed 250 characters'),
            specificDay: z.boolean().optional()
        })
        .refine(
            (data) => {
                const startTime = data.startTime.split(':');
                const endTime = data.endTime.split(':');
                const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
                const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
                return endMinutes > startMinutes;
            },
            {
                message: 'Shift End Time must be after Shift Start Time',
                path: ['endTime']
            }
        )
};

/**
 * 6. Shift Setting Master Schema
 */
export const shiftSettingMasterSchema = {
    addOrUpdate: z
        .object({
            shiftName: z.string().min(1, 'Shift Name is required'),
            shiftStartTime: z.string().min(1, 'Shift Start Time is required'),
            shiftEndTime: z.string().min(1, 'Shift End Time is required'),
            totalWorkingHours: z.string().min(1, 'Total Working Hours per Shift is required'),
            halfDayWorkingHours: z.string().min(1, 'Half-day Working Hours per Shift is required'),
            lunchStartTime: z.string().optional(),
            lunchEndTime: z.string().optional(),
            lunchHours: z.string().optional(),
            delayPerShift: z.string().optional(),
            earlyPerShift: z.string().optional(),
            isActive: z.boolean().optional()
        })
        .refine(
            (data) => {
                const startTime = data.shiftStartTime.split(':');
                const endTime = data.shiftEndTime.split(':');
                const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
                const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
                return endMinutes > startMinutes;
            },
            {
                message: 'Shift End Time must be after Shift Start Time',
                path: ['shiftEndTime']
            }
        )
        .refine(
            (data) => {
                if (data.lunchStartTime && data.lunchEndTime) {
                    const startTime = data.lunchStartTime.split(':');
                    const endTime = data.lunchEndTime.split(':');
                    const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
                    const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
                    return endMinutes > startMinutes;
                }
                return true;
            },
            {
                message: 'Lunch End Time must be after Lunch Start Time',
                path: ['lunchEndTime']
            }
        )
};

/**
 * 7. GPS Location Attendance Schema
 */
export const gpsLocationAttendanceSchema = {
    addOrUpdate: z.object({
        employeeName: z.string().min(1, 'Employee Name is required'),
        clientName: z.string().min(1, 'Client Name is required'),
        salesLead: z.string().min(1, 'Sales Lead is required'),
        remarks: z.string().min(1, 'Remark is required').max(250, 'Remark must not exceed 250 characters'),
        punchFlag: z.boolean().optional(),
        date: z.string().optional(),
        designation: z.string().optional(),
        location: z.string().optional()
    })
};

/**
 * Report Filter Schemas
 */

/**
 * GPS Location Report Filter Schema
 */
export const gpsLocationReportFilterSchema = z
    .object({
        filterType: z.enum(['Between Date', 'Employee Wise'], {
            required_error: 'Filter Type is required'
        }),
        employee: z.string().optional(),
        fromDate: z.string().optional(),
        toDate: z.string().optional()
    })
    .refine(
        (data) => {
            if (data.filterType === 'Employee Wise') {
                return !!data.employee;
            }
            return true;
        },
        {
            message: 'Employee Name is required when Employee Wise is selected',
            path: ['employee']
        }
    )
    .refine(
        (data) => {
            if (data.filterType === 'Between Date') {
                return !!data.fromDate && !!data.toDate;
            }
            return true;
        },
        {
            message: 'Date Range is required when Between Date is selected',
            path: ['fromDate']
        }
    )
    .refine(
        (data) => {
            if (data.filterType === 'Between Date' && data.fromDate && data.toDate) {
                return new Date(data.toDate) >= new Date(data.fromDate);
            }
            return true;
        },
        {
            message: 'To Date must be on or after From Date',
            path: ['toDate']
        }
    );

/**
 * Employee In/Out Report Filter Schema
 */
export const employeeInOutReportFilterSchema = z
    .object({
        branch: z.string().optional(),
        type: z.array(z.string()).optional(), // Optional - used for filtering
        department: z.array(z.string()).min(1, 'At least one department must be selected'),
        designation: z.array(z.string()).min(1, 'At least one designation must be selected'),
        allOrIndividual: z.enum(['All', 'Individual'], {
            required_error: 'All/Individual selection is required'
        }),
        codeOrName: z.enum(['Code', 'Name']).optional(),
        query: z.string().optional(),
        fromDate: z.string().min(1, 'From Date is required'),
        toDate: z.string().min(1, 'To Date is required'),
        timeInTimeOut: z.enum(['Time In', 'Time Out', 'In Out']).optional() // Optional - used for filtering
    })
    .refine(
        (data) => {
            if (data.allOrIndividual === 'Individual') {
                return !!data.codeOrName;
            }
            return true;
        },
        {
            message: 'Code / Name is required when Individual is selected',
            path: ['codeOrName']
        }
    )
    .refine(
        (data) => {
            if (data.allOrIndividual === 'Individual') {
                return !!data.query;
            }
            return true;
        },
        {
            message: 'Employee code or name is required when Individual is selected',
            path: ['query']
        }
    )
    .refine(
        (data) => {
            return new Date(data.toDate) >= new Date(data.fromDate);
        },
        {
            message: 'To Date must be on or after From Date',
            path: ['toDate']
        }
    );

/**
 * Employee LateIn/EarlyOut Report Filter Schema
 */
export const employeeLateInEarlyOutReportFilterSchema = z
    .object({
        type: z.array(z.string()).min(1, 'At least one employee type must be selected'),
        department: z.array(z.string()).min(1, 'At least one department must be selected'),
        designation: z.array(z.string()).min(1, 'At least one designation must be selected'),
        allOrIndividual: z.enum(['All', 'Individual'], {
            required_error: 'All/Individual selection is required'
        }),
        codeOrName: z.enum(['Code', 'Name']).optional(),
        query: z.string().optional(),
        fromDate: z.string().min(1, 'From Date is required'),
        toDate: z.string().min(1, 'To Date is required'),
        mode: z.enum(['Late By', 'Early Out', 'Late In Early Out'], {
            required_error: 'Late By/Early Out/Late In-Early Out selection is required'
        })
    })
    .refine(
        (data) => {
            if (data.allOrIndividual === 'Individual') {
                return !!data.query;
            }
            return true;
        },
        {
            message: 'Employee code or name is required when Individual is selected',
            path: ['query']
        }
    )
    .refine(
        (data) => {
            return new Date(data.toDate) >= new Date(data.fromDate);
        },
        {
            message: 'To Date must be on or after From Date',
            path: ['toDate']
        }
    );

/**
 * Employee Log Report Filter Schema
 */
export const employeeLogReportFilterSchema = z
    .object({
        type: z.array(z.string()).min(1, 'At least one employee type must be selected'),
        department: z.array(z.string()).min(1, 'At least one department must be selected'),
        designation: z.array(z.string()).min(1, 'At least one designation must be selected'),
        allOrIndividual: z.enum(['All', 'Individual'], {
            required_error: 'All/Individual selection is required'
        }),
        codeOrName: z.enum(['Code', 'Name']).optional(),
        query: z.string().optional(),
        dateMode: z.enum(['Date', 'Monthly', 'From Date'], {
            required_error: 'Date mode selection is required'
        }),
        date: z.string().optional(),
        month: z.string().optional(),
        fromDate: z.string().optional(),
        toDate: z.string().optional(),
        metric: z.enum(['Punch Time', 'Late In', 'Early Out'], {
            required_error: 'Punch Time / Late In / Early Out selection is required'
        })
    })
    .refine(
        (data) => {
            if (data.allOrIndividual === 'Individual') {
                return !!data.query;
            }
            return true;
        },
        {
            message: 'Employee code or name is required when Individual is selected',
            path: ['query']
        }
    )
    .refine(
        (data) => {
            if (data.dateMode === 'Date') {
                return !!data.date;
            }
            if (data.dateMode === 'Monthly') {
                return !!data.month;
            }
            if (data.dateMode === 'From Date') {
                return !!data.fromDate && !!data.toDate;
            }
            return true;
        },
        {
            message: 'Date, Monthly, or Date Range is required based on selected mode',
            path: ['date']
        }
    )
    .refine(
        (data) => {
            if (data.fromDate && data.toDate) {
                return new Date(data.toDate) >= new Date(data.fromDate);
            }
            return true;
        },
        {
            message: 'To Date must be on or after From Date',
            path: ['toDate']
        }
    );

/**
 * Employee Monthly Report Filter Schema
 */
export const employeeMonthlyReportFilterSchema = z
    .object({
        type: z.array(z.string()).min(1, 'At least one employee type must be selected'),
        department: z.array(z.string()).min(1, 'At least one department must be selected'),
        designation: z.array(z.string()).min(1, 'At least one designation must be selected'),
        allOrIndividual: z.enum(['All', 'Individual'], {
            required_error: 'All/Individual selection is required'
        }),
        employeeName: z.string().optional(),
        fromDate: z.string().min(1, 'From Date is required'),
        toDate: z.string().min(1, 'To Date is required'),
        reportOptions: z.array(z.enum(['Total Working Days', 'Show Holiday Punch', 'Format One', 'Date Of Joining', 'Total Absent Days'])).optional()
    })
    .refine(
        (data) => {
            if (data.allOrIndividual === 'Individual') {
                return !!data.employeeName;
            }
            return true;
        },
        {
            message: 'Employee Name is required when Individual is selected',
            path: ['employeeName']
        }
    )
    .refine(
        (data) => {
            return new Date(data.toDate) >= new Date(data.fromDate);
        },
        {
            message: 'To Date must be on or after From Date',
            path: ['toDate']
        }
    );

/**
 * Employee Yearly Report Filter Schema
 */
export const employeeYearlyReportFilterSchema = z
    .object({
        type: z.array(z.string()).min(1, 'At least one employee type must be selected'),
        department: z.array(z.string()).min(1, 'At least one department must be selected'),
        designation: z.array(z.string()).min(1, 'At least one designation must be selected'),
        allOrIndividual: z.enum(['All', 'Individual'], {
            required_error: 'All/Individual selection is required'
        }),
        employee: z.string().optional(),
        fromDate: z.string().min(1, 'From Date is required'),
        toDate: z.string().min(1, 'To Date is required'),
        mode: z.array(z.enum(['Date Of Joining', 'Show Holiday Punch', 'Total working Day'])).optional()
    })
    .refine(
        (data) => {
            if (data.allOrIndividual === 'Individual') {
                return !!data.employee;
            }
            return true;
        },
        {
            message: 'Employee Name is required when Individual is selected',
            path: ['employee']
        }
    )
    .refine(
        (data) => {
            return new Date(data.toDate) >= new Date(data.fromDate);
        },
        {
            message: 'To Date must be on or after From Date',
            path: ['toDate']
        }
    );

/**
 * FO Month End Report Filter Schema
 */
export const foMonthEndReportFilterSchema = z.object({
    year: z.string().min(1, 'Year is required'),
    month: z.string().min(1, 'Month is required'),
    ieName: z.string().min(1, 'IE Name is required')
});

/**
 * Holiday Report Filter Schema
 */
export const holidayReportFilterSchema = z.object({
    calendarYear: z.string().min(1, 'Calendar Year is required'),
    holidayType: z.string().min(1, 'Holiday Type is required')
});

/**
 * Employee Absent Report Filter Schema
 */
export const employeeAbsentReportFilterSchema = z
    .object({
        type: z.array(z.string()).min(1, 'At least one type must be selected'),
        department: z.array(z.string()).min(1, 'At least one department must be selected'),
        designation: z.array(z.string()).min(1, 'At least one designation must be selected'),
        allOrIndividual: z.enum(['All', 'Individual'], {
            required_error: 'All/Individual selection is required'
        }),
        employee: z.string().optional(),
        fromDate: z.string().min(1, 'From Date is required'),
        toDate: z.string().min(1, 'To Date is required')
    })
    .refine(
        (data) => {
            if (data.allOrIndividual === 'Individual') {
                return !!data.employee;
            }
            return true;
        },
        {
            message: 'Employee is required when Individual is selected',
            path: ['employee']
        }
    )
    .refine(
        (data) => {
            return new Date(data.toDate) >= new Date(data.fromDate);
        },
        {
            message: 'To Date must be on or after From Date',
            path: ['toDate']
        }
    );

