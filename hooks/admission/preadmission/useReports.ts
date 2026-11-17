import { ADMISSION_QUERY_KEYS, PREADMISSION_QUERY_KEYS } from '@/constants/query-keys';
import {
    getAttendanceAbsentSmsReport,
    getAttendanceReport,
    getMonthEndReport,
    getPreAdmissionEmailSmsReport,
    getPreAdmissionMonthEndReport,
    getPreAdmissionRegistrationReport,
    getStudentAttendanceReport,
    getStudentTcReport,
    getStudyCertficateReport,
    getclasswiseStudentDetails
} from '@/server/admission/preadmission/reports/report';
import { addOrUpdateStudentCountReport, getParentDashboardDetails } from '@/server/admission/preadmission/reports/student_count_report';
import {
    type ElectiveItem,
    GetClassTeacherReport,
    GetDateOfBirth,
    GetStudentYearlyAttendance,
    getAdmissionRegister,
    getStudentSearch,
    getTotalStrengthReport,
    getadmissionStudentsDropdown
} from '@/server/admission/preadmission/reports/student_yearly_attendance';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useStudentCountReport = (filterPayload?: any, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.STUDENT_COUNT_REPORT, filterPayload ?? {}, searchParams ?? {}],
            queryFn: async () =>
                addOrUpdateStudentCountReport(
                    filterPayload || {
                        report_type: 1,
                        type: 'between',
                        from_date: new Date().toISOString(),
                        to_date: new Date().toISOString(),
                        asmay_id: 0,
                        asmcl_id: 0
                    },
                    searchParams
                ),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.STUDENT_COUNT_REPORT]
            });
        }
    };
};

export const useParentDashboard = (asmay_id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.PARENTS_DASHBOARD, asmay_id],
            queryFn: async () => getParentDashboardDetails(asmay_id),
            staleTime: 0,
            enabled: !!asmay_id
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.PARENTS_DASHBOARD]
            });
        }
    };
};
export const useStudentTcReport = (data: any, searchParams: ApiSearchparams, enabled = true) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.STUDENT_TC_REPORT, data, searchParams],
            queryFn: async () => getStudentTcReport(data, searchParams),
            staleTime: 0,
            enabled: enabled && !!data,
            refetchOnWindowFocus: false
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.STUDENT_TC_REPORT]
            });
        }
    };
};
export const useMonthEndReport = (data: any, enabled = true) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MONTH_END_REPORT, data],
            queryFn: async () => getMonthEndReport(data),
            staleTime: 0,
            enabled: enabled && !!data,
            refetchOnWindowFocus: false
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MONTH_END_REPORT]
            });
        }
    };
};
export const usePreAdmissionMonthEndReport = (data: any, searchParams: ApiSearchparams, enabled = true) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.PRE_ADMISSION_MONTH_END_REPORT, data, searchParams],
            queryFn: async () => getPreAdmissionMonthEndReport(data, searchParams),
            staleTime: 0,
            enabled: enabled && !!data,
            refetchOnWindowFocus: false
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.PRE_ADMISSION_MONTH_END_REPORT]
            });
        }
    };
};
export const usePreAdmissionRegistrationReport = (
    academicIdParam: number,
    fromDateParam: string | null,
    toDateParam: string | null,
    searchParams?: ApiSearchparams
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [
                ADMISSION_QUERY_KEYS.PRE_ADMISSION_REGISTRATION_REPORT,
                academicIdParam,
                fromDateParam,
                toDateParam,
                searchParams ?? {}
            ],
            queryFn: async () =>
                getPreAdmissionRegistrationReport(
                    {
                        academicYearId: academicIdParam,
                        fromDate: fromDateParam,
                        toDate: toDateParam
                    },
                    searchParams
                ),
            staleTime: 0,
            refetchOnWindowFocus: false
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.PRE_ADMISSION_REGISTRATION_REPORT]
            })
    };
};
export const usePreAdmissionEmailSmsReport = (
    academicIdParam: number,
    fromDateParam: string | null,
    toDateParam: string | null,
    searchParams?: ApiSearchparams
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [
                ADMISSION_QUERY_KEYS.PRE_ADMISSION_REGISTRATION_REPORT,
                academicIdParam,
                fromDateParam,
                toDateParam,
                searchParams ?? {}
            ],
            queryFn: async () =>
                getPreAdmissionEmailSmsReport(
                    {
                        academicYearId: academicIdParam,
                        fromDate: fromDateParam,
                        toDate: toDateParam
                    },
                    searchParams
                ),
            staleTime: 0,
            refetchOnWindowFocus: false
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.PRE_ADMISSION_REGISTRATION_REPORT]
            })
    };
};
export const useStudentYearlyAttendance = (ASMAY_Id: number, ASMCL_Id: number, ASMS_Id: number | undefined, searchParams?: ApiSearchparams, enabled: boolean = true) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_STUDENT_LISTS, ASMAY_Id, ASMCL_Id, ASMS_Id, searchParams ?? {}],
            queryFn: async () => GetStudentYearlyAttendance(ASMAY_Id, ASMCL_Id, ASMS_Id ?? 0, searchParams),
            staleTime: 0,
            enabled: enabled && !!ASMAY_Id && ASMS_Id !== undefined && !!ASMCL_Id
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_STUDENT_LISTS]
            });
        }
    };
};

export const useClassTeacherReport = (ASMAY_Id: number, flag: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_CLASS_TEACHER_REPORT, ASMAY_Id, flag, searchParams ?? {}],
            queryFn: async () => GetClassTeacherReport(ASMAY_Id, flag, searchParams),
            staleTime: 0,
            enabled: !!ASMAY_Id
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_CLASS_TEACHER_REPORT]
            });
        }
    };
};

export const useTotalStrengthReport = (
    asmay_Id: number,
    asmcL_Id: number,
    amC_Id: number,
    statusFlag: string,
    amsT_SOL: string,
    withtc: string,
    withdeactive: string,
    electivearray: ElectiveItem[]
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [
                ADMISSION_QUERY_KEYS.TOTAL_STRENGTH_REPORT,
                asmay_Id,
                asmcL_Id,
                amC_Id,
                statusFlag,
                amsT_SOL,
                withtc,
                withdeactive,
                electivearray
            ],
            queryFn: () =>
                getTotalStrengthReport(asmay_Id, asmcL_Id, amC_Id, statusFlag, amsT_SOL, withtc, withdeactive, electivearray, {
                    page_size: 100000
                }),
            enabled: asmay_Id > 0 && statusFlag !== '' && amsT_SOL !== '' && withtc !== '' && withdeactive !== '',
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.TOTAL_STRENGTH_REPORT]
            });
        }
    };
};

export const useStudentSearch = (
    stuStatus: string,
    field: string,
    Operator: string,
    value: string,
    condition: string,
    searchParams?: ApiSearchparams
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.STUDENT_SEARCH, stuStatus, field, Operator, value, condition, searchParams ?? {}],
            queryFn: async () => getStudentSearch(stuStatus, field, Operator, value, condition, searchParams),
            staleTime: 0,
            enabled: !!stuStatus && !!field && !!Operator && !!value && !!condition
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.STUDENT_SEARCH]
            });
        }
    };
};
export const useStudyCertificateReport = (data: any, enabled = true) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.STUDY_CERTIFICATE_REPORT, data],
            queryFn: async () => getStudyCertficateReport(data),
            staleTime: 0,
            enabled: enabled && !!data,
            refetchOnWindowFocus: false
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.STUDY_CERTIFICATE_REPORT]
            });
        }
    };
};
export const useAdmissionRegister = (ASMAY_Id: number, AttendanceType: number, payload?: any, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_REGISTER, ASMAY_Id, AttendanceType, payload, searchParams ?? {}],
            queryFn: async () => getAdmissionRegister(ASMAY_Id, AttendanceType, payload, searchParams),
            staleTime: 0,
            enabled: !!ASMAY_Id && !!AttendanceType && !!payload
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_REGISTER]
            });
        }
    };
};
export const ClasswiseStudentDetails = (
    asmaY_Id: number,
    studentScope: number,
    fmcC_Id: number,

    payload?: any,
    searchParams?: ApiSearchparams
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.CLASS_WISE_STUDENT_REPORT, asmaY_Id, fmcC_Id, studentScope, payload, searchParams ?? {}],
            queryFn: async () => getclasswiseStudentDetails(asmaY_Id, fmcC_Id, studentScope, payload, searchParams),
            staleTime: 0,
            enabled: !!payload
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.CLASS_WISE_STUDENT_REPORT]
            });
        }
    };
};

export const useadmissionStudentsDropdown = (ASMAY_Id?: number, ASMCL_Id?: number, ASMS_Id?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [
                ADMISSION_QUERY_KEYS.ADMISSION_STUDENTS_DROPDOWN,
                ASMAY_Id ?? ({} as number),
                ASMCL_Id ?? ({} as number),
                ASMS_Id ?? ({} as number)
            ],
            queryFn: async () => {
                if (!ASMAY_Id || Number(ASMAY_Id) <= 0) {
                    return { data: [] } as any;
                }
                return await getadmissionStudentsDropdown(Number(ASMAY_Id), Number(ASMCL_Id), Number(ASMS_Id));
            },
            staleTime: 0,
            enabled: Boolean(ASMAY_Id && Number(ASMAY_Id) > 0 && ASMCL_Id && Number(ASMCL_Id) > 0 && ASMS_Id && Number(ASMS_Id) > 0)
        }),
        refetchAll: (id?: number) => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.ADMISSION_STUDENTS_DROPDOWN, id ?? {}]
            });
        }
    };
};
export const useAttendanceAbsentSmsReport = (asmaY_Id: number, from_date: string, frequency: string, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.ATTENDANCE_ABSENT_REPORT, asmaY_Id, from_date, frequency, searchParams ?? {}],
            queryFn: async () => getAttendanceAbsentSmsReport(asmaY_Id, from_date, frequency, searchParams),
            staleTime: 0,
            enabled: !!asmaY_Id
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.ATTENDANCE_ABSENT_REPORT]
            });
        }
    };
};
export const useAttendanceReport = (asmaY_Id: number, from_date: string, frequency: string, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.ATTENDANCE_REPORT, asmaY_Id, from_date, frequency, searchParams ?? {}],
            queryFn: async () => getAttendanceReport(asmaY_Id, from_date, frequency, searchParams),
            staleTime: 0,
            enabled: !!asmaY_Id
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.ATTENDANCE_REPORT]
            });
        }
    };
};
export const useStudentAttendanceReport = (
    asmaY_Id: number,
    classId: number,
    SectionId: number,
    studentId: number | undefined,
    monthId: number | undefined,
    monthDateWise: number | undefined,
    fromDate: Date | null | undefined,
    toDate: Date | null | undefined,
    dailyDate: Date | null | undefined,
    selectionMode: number,
    studentStatus: number,
    searchParams?: ApiSearchparams
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [
                ADMISSION_QUERY_KEYS.STUDENT_ATTENDANCE_REPORT,
                asmaY_Id,
                classId,
                SectionId,
                studentId,
                monthId,
                monthDateWise,
                fromDate,
                toDate,
                dailyDate,
                selectionMode,
                studentStatus,
                searchParams ?? {}
            ],
            queryFn: async () =>
                getStudentAttendanceReport(
                    asmaY_Id,
                    classId,
                    SectionId,
                    studentId,
                    monthId,
                    monthDateWise,
                    fromDate,
                    toDate,
                    dailyDate,
                    selectionMode,
                    studentStatus,
                    searchParams
                ),
            staleTime: 0,
            enabled: !!asmaY_Id
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.STUDENT_ATTENDANCE_REPORT]
            });
        }
    };
};

export const useDateOfBirth = (ASMAY_Id: number, ASMCL_Id: number, ASMS_Id: number, AMST_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.DATE_OF_BIRTH_REPORT, ASMAY_Id, ASMCL_Id, ASMS_Id, AMST_Id, searchParams ?? {}],
            queryFn: async () => GetDateOfBirth(ASMAY_Id, ASMCL_Id, ASMS_Id, AMST_Id, searchParams),
            staleTime: 0,
            enabled: !!ASMAY_Id && !!ASMS_Id && ASMCL_Id !== undefined
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.DATE_OF_BIRTH_REPORT]
            });
        }
    };
};
