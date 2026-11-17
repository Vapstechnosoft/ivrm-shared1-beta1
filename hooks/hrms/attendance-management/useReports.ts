import { HRMS_QUERY_KEYS } from '@/constants/query-keys';
import { getEmployeeAbsentReport } from '@/server/hrms/hrmsConfig/reports/employee-absent-report';
import { getEmployeeInOutReport } from '@/server/hrms/hrmsConfig/reports/employee-inout-report';
import { getEmployeeLateInEarlyOutReport } from '@/server/hrms/hrmsConfig/reports/employee-latein-earlyout-report';
import { getEmployeeLogReport } from '@/server/hrms/hrmsConfig/reports/employee-log-report';
import { getEmployeeMonthlyReport } from '@/server/hrms/hrmsConfig/reports/employee-monthly-report';
import { getEmployeeYearlyReport } from '@/server/hrms/hrmsConfig/reports/employee-yearly-report';
import { getFOMonthEndReport } from '@/server/hrms/hrmsConfig/reports/fo-monthend-report';
import { getGPSLocationReport } from '@/server/hrms/hrmsConfig/reports/gps-location-report';
import { getHolidayReport } from '@/server/hrms/hrmsConfig/reports/holiday-report';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// ============================================================================
// EMPLOYEE LOG REPORT
// ============================================================================
export function useEmployeeLogReport(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_LOG_REPORT, searchParams ?? {}],
            queryFn: async () => getEmployeeLogReport({}, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_LOG_REPORT]
            });
        }
    };
}

// ============================================================================
// EMPLOYEE IN-OUT REPORT
// ============================================================================
export function useEmployeeInOutReport(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_INOUT_REPORT, searchParams ?? {}],
            queryFn: async () => getEmployeeInOutReport({}, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_INOUT_REPORT]
            });
        }
    };
}

// ============================================================================
// EMPLOYEE ABSENT REPORT
// ============================================================================
export function useEmployeeAbsentReport(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_ABSENT_REPORT, searchParams ?? {}],
            queryFn: async () => getEmployeeAbsentReport({}, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_ABSENT_REPORT]
            });
        }
    };
}

// ============================================================================
// EMPLOYEE LATE IN EARLY OUT REPORT
// ============================================================================
export function useEmployeeLateInEarlyOutReport(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_LATEIN_EARLYOUT_REPORT, searchParams ?? {}],
            queryFn: async () => getEmployeeLateInEarlyOutReport({}, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_LATEIN_EARLYOUT_REPORT]
            });
        }
    };
}

// ============================================================================
// EMPLOYEE MONTHLY REPORT
// ============================================================================
export function useEmployeeMonthlyReport(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_MONTHLY_REPORT, searchParams ?? {}],
            queryFn: async () => getEmployeeMonthlyReport({}, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_MONTHLY_REPORT]
            });
        }
    };
}

// ============================================================================
// EMPLOYEE YEARLY REPORT
// ============================================================================
export function useEmployeeYearlyReport(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_YEARLY_REPORT, searchParams ?? {}],
            queryFn: async () => getEmployeeYearlyReport({}, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.EMPLOYEE_YEARLY_REPORT]
            });
        }
    };
}

// ============================================================================
// FO MONTH END REPORT
// ============================================================================
export function useFOMonthEndReport(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.FO_MONTHEND_REPORT, searchParams ?? {}],
            queryFn: async () => getFOMonthEndReport({}, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.FO_MONTHEND_REPORT]
            });
        }
    };
}

// ============================================================================
// GPS LOCATION REPORT
// ============================================================================
export function useGPSLocationReport(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.GPS_LOCATION_REPORT, searchParams ?? {}],
            queryFn: async () => getGPSLocationReport({}, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.GPS_LOCATION_REPORT]
            });
        }
    };
}

// ============================================================================
// HOLIDAY REPORT
// ============================================================================
export function useHolidayReport(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.HOLIDAY_REPORT, searchParams ?? {}],
            queryFn: async () => getHolidayReport({}, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.HOLIDAY_REPORT]
            });
        }
    };
}
